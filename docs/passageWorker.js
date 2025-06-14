lgbm_inference_script = `
    import lightgbm as lgb
    import json

    model = lgb.Booster(model_file='model.txt')
    inputs = json.load(open('input.json'))
    model_input = [[x.get(col,None) for col in model.feature_name()] for x in inputs]
    
    res = model.predict(model_input)
    res_list = [x[2]/(x[1]+x[0]) for x in res]
    res_list
  `

error_cnn_inference_script = `
import os
os.environ["OPENBLAS_NUM_THREADS"] = "4"

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
import json
START_TOK = "<S>"
END_TOK = "<E>"
PAD_TOK = "<P>"

tok_to_idx = {
    "<S>": 0,
    "<E>": 1,
    "<P>": 2,
    " ": 3,
    "!": 4,
    '"': 5,
    "%": 6,
    "'": 7,
    "(": 8,
    ")": 9,
    ",": 10,
    "-": 11,
    ".": 12,
    "0": 13,
    "1": 14,
    "2": 15,
    "3": 16,
    "4": 17,
    "5": 18,
    "6": 19,
    "7": 20,
    "8": 21,
    "9": 22,
    ":": 23,
    ";": 24,
    "?": 25,
    "A": 26,
    "B": 27,
    "C": 28,
    "D": 29,
    "E": 30,
    "F": 31,
    "G": 32,
    "H": 33,
    "I": 34,
    "J": 35,
    "K": 36,
    "L": 37,
    "M": 38,
    "N": 39,
    "O": 40,
    "P": 41,
    "Q": 42,
    "R": 43,
    "S": 44,
    "T": 45,
    "U": 46,
    "V": 47,
    "W": 48,
    "X": 49,
    "Y": 50,
    "Z": 51,
    "_": 52,
    "a": 53,
    "b": 54,
    "c": 55,
    "d": 56,
    "e": 57,
    "f": 58,
    "g": 59,
    "h": 60,
    "i": 61,
    "j": 62,
    "k": 63,
    "l": 64,
    "m": 65,
    "n": 66,
    "o": 67,
    "p": 68,
    "q": 69,
    "r": 70,
    "s": 71,
    "t": 72,
    "u": 73,
    "v": 74,
    "w": 75,
    "x": 76,
    "y": 77,
    "z": 78,
    "£": 79,
}

def conv1d(x, w, b, pad):
    # x: (B, Cin, L), w: (Cout, Cin, K), b: (Cout,)
    x_p = np.pad(x, ((0, 0), (0, 0), (pad, pad)))
    K = w.shape[2]
    # windows: (B, Cin, Lout, K)
    windows = sliding_window_view(x_p, window_shape=K, axis=2)
    # einsum: batch b, cin c, length l, kernel k
    #         weight o c k
    # -> output b o l
    y = np.tensordot(windows, w, axes=([1, 3], [1, 2]))
    # reorder to (B, Cout, Lout)
    return np.moveaxis(y, -1, 1) + b[None, :, None]

def batchnorm1d(x, rm, rv, w, b, eps=1e-5):
    return (x - rm[None, :, None]) / np.sqrt(rv[None, :, None] + eps) * w[
        None, :, None
    ] + b[None, :, None]

def gelu(x):
    # tanh‐based approximation, no erf needed
    return 0.5 * x * (1 + np.tanh(np.sqrt(2 / np.pi) * (x + 0.044715 * x**3)))

def layernorm(x, w, b, eps=1e-5):
    mu = x.mean(-1, keepdims=True)
    var = x.var(-1, keepdims=True)
    w = w[None]
    b = b[None]
    return (x - mu) / np.sqrt(var + eps) * w + b

def linear(x, w, b):
    return x @ w.T + b

def tokenize(string_value, len_seq=0, max_pad=17):
    chars = [START_TOK] + list(string_value)+ [END_TOK]
    return [tok_to_idx[c] for c in chars] + [tok_to_idx[PAD_TOK] for _ in range(min(len_seq - len(chars),max_pad))]

class CNNCharErrorModel():
    def __init__(self, weights_path):
        self.params = np.load(weights_path)
        self.emb_w = self.params['embedding.weight']
        self.mlp_w = self.params['final_mlp.0.weight']
        self.mlp_b = self.params['final_mlp.0.bias']
        self.out_w = self.params['out.weight']

    def forward_fn(self, x_idx):
        emb = self.emb_w[x_idx]  # [B,L,emb_dim]
        for n in range(1, 6):
            feats = []
            channel_count = 5
            for i in range(channel_count):
                cw = self.params[f"conv{n}.convs1.{i}.0.weight"]
                cb = self.params[f"conv{n}.convs1.{i}.0.bias"]
                rm = self.params[f"conv{n}.convs1.{i}.1.running_mean"]
                rv = self.params[f"conv{n}.convs1.{i}.1.running_var"]
                bw = self.params[f"conv{n}.convs1.{i}.1.weight"]
                bb = self.params[f"conv{n}.convs1.{i}.1.bias"]
                t = emb.transpose(0, 2, 1)
                y = conv1d(t, cw, cb, pad=cw.shape[-1] // 2)
                y = batchnorm1d(y, rm, rv, bw, bb)
                feats.append(gelu(y))
            cat = np.concatenate(feats, 1)  # [B,sum(channels), L]
            cat = cat.transpose(0, 2, 1)  # [B, L, sum(channels)]
            proj_w = self.params[f"conv{n}.project1.weight"]
            proj_b = self.params[f"conv{n}.project1.bias"]
            res = linear(cat, proj_w, proj_b)
            rw = self.params[f"conv{n}.res_weight"]
            res += emb * rw
            # layernorm per layer has its own params; reload them each loop
            ln_w = self.params[f"conv{n}.norm2.weight"]
            ln_b = self.params[f"conv{n}.norm2.bias"]
            emb = gelu(layernorm(res, ln_w, ln_b))

        x = gelu(linear(emb, self.mlp_w, self.mlp_b))
        logits = linear(x, self.out_w, np.zeros(self.out_w.shape[0]))
        return logits

inputs = json.load(open('input_2.json')) # expecting list of length B strings
toks = [tokenize(x, len_seq=602) for x in inputs]
model_input = np.array(toks)

model = CNNCharErrorModel('error_model_weights.npz')
res = model.forward_fn(model_input)
res_list = [[float(x) for x in ps[1:len(s)+1]] for s,ps in zip(inputs,res)] # B x len s
res_list
`
BETTER_ERROR_MODEL = true;
HAS_SUCCEEDED_ONCE = false;

importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js");
let pyodide = undefined;

let currentSource = 'wikipedia';
let quadgramFrequency = {};
let defaultQuadgramErrorModel = {};
const source_passages = {}
let passage_user_info_features = {};
let word_feats = {};
let is_initialised = {value: false};

source_paths = {
    'wikipedia': 'https://jameshargreaves12.github.io/reference_data/cleaned_wikipedia_articles.txt',
    'sherlock': 'https://jameshargreaves12.github.io/reference_data/sherlock_holmes.txt'
}

async function setup_pyodide() {
  pyodide = await loadPyodide();
  // Pyodide is now ready to use...

  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport("micropip");
  const [x,lgbm_response, error_model_response] = await Promise.all([
    micropip.install(['lightgbm', 'numpy']),
    fetch('https://jameshargreaves12.github.io/reference_data/lgbm_model.txt'),
    fetch('https://jameshargreaves12.github.io/reference_data/error_model_weights.npz')
  ]);
  // await micropip.install('numpy');
  const lgbm_model = await lgbm_response.text();
  await pyodide.FS.writeFile('model.txt', lgbm_model);

  const error_model = await error_model_response.arrayBuffer();
  await pyodide.FS.writeFile('error_model_weights.npz', new Uint8Array(error_model));
  console.log("Model saved to pyodide successfully");
}


const arrFreqAndFileName = [[quadgramFrequency, 'quadgrams_2'], [defaultQuadgramErrorModel, 'quadgram_error_model']];
const get_features = (passage, user_intro_acc, user_intro_wpm) => {
  const features = {
    "user_intro_acc": user_intro_acc,
    "user_intro_wpm": user_intro_wpm,
  };

  // features["passage_many_to_end_count"] = passage_feats[passage]
  // const passage_user_info = passage_user_info_features[passage]
  // features["passage_median_relative_wpm"] = passage_user_info ? passage_user_info[0] : undefined;
  // features["passage_median_relative_acc"] = passage_user_info ? passage_user_info[1] : undefined;
  
  const wordScores = passage.split(" ").filter(word => word_feats[word]).map(word => word_feats[word]);
  if (wordScores.length > 0) {
    // features["word_many_to_end_max"] = Math.max(...wordScores);
    // features["word_many_to_end_min"] = Math.min(...wordScores);
    features["word_zero_to_end_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[0], 0) / wordScores.length;
    features["word_one_to_end_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[1], 0) / wordScores.length;
    features["word_many_to_end_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[2], 0) / wordScores.length;
    // features["word_many_to_end_count_positive"] = wordScores.filter(score => score > 0).length;
    // features["word_many_to_end_count_negative"] = wordScores.filter(score => score < 0).length;
  }else{
    // features["word_many_to_end_max"] = undefined;
    // features["word_many_to_end_min"] = undefined;
    features["word_zero_to_end_mean"] = undefined;
    features["word_one_to_end_mean"] = undefined;
    features["word_many_to_end_mean"] = undefined;
    // features["word_many_to_end_count_positive"] = undefined;
    // features["word_many_to_end_count_negative"] = undefined;
  }
  const utcNow = new Date();
  // features["time_hour"] = utcNow.getHours();
  // features["time_minutes"] = utcNow.getMinutes();
  // features["passage_len"] = passage.length;
  // features["passage_error_score_norm"] = get_default_error_score_norm(passage, defaultQuadgramErrorModel);
  return features;
}

const call_lgbm = async (passages, user_intro_acc, user_intro_wpm) => {
  const data = passages.map(passage => (
    get_features(passage, user_intro_acc, user_intro_wpm)
  ));
  // console.log(data);
  // Save the model text to the Pyodide file system
  pyodide.FS.writeFile('input.json', JSON.stringify(data));
  
  // Load the model from the file system
  const res = await pyodide.runPythonAsync(lgbm_inference_script);
  const result = res.toJs();
  return result;
}

// It is slow so for now only do a single passage at a time
const call_cnn_error_model = async (passage) => {
  pyodide.FS.writeFile('input_2.json', JSON.stringify([passage]));
  const start_cnn = performance.now();
  const res_cnn = await pyodide.runPythonAsync(error_cnn_inference_script);
  const result_cnn = res_cnn.toJs();
  const end_cnn = performance.now();
  const durationSec = (end_cnn - start_cnn) / 1000;
  console.log('CNN call took', durationSec.toFixed(3), 'seconds'); // seconds
  return result_cnn[0];
}

let ERROR_SCORE_CACHE_KEY = 'na'
let ERROR_SCORE_CACHE = []
const error_scores_cached = async (passage) => {
  if (ERROR_SCORE_CACHE_KEY == passage) {
    return ERROR_SCORE_CACHE;
  }
  ERROR_SCORE_CACHE_KEY = passage;
  ERROR_SCORE_CACHE = await call_cnn_error_model(passage);
  return ERROR_SCORE_CACHE;
}

const add_error_highlight_indecies = async (passages, highlight_error_pct) => {
  // For performance reasons only do it for the top passage
  const cnn_score = await error_scores_cached(passages[0].passage)
  const indexToScore = cnn_score.map((score, index) => ({index, score}));
  const highlightIndecies = indexToScore.sort((a, b) => b.score - a.score).slice(0, highlight_error_pct*passages[0].passage.length).map(item => item.index);

  passages[0].error_scores = cnn_score;
  passages[0].highlightIndecies = highlightIndecies;
  return passages;
}

const load_lgbm_feat_files = async () => {
    // const a = fetch(`https://jameshargreaves12.github.io/reference_data/passage_feats.json`)
    //     .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //     }).then(data => {
    //       passage_feats = data;
    //     })
    // const b = fetch(`https://jameshargreaves12.github.io/reference_data/passage_user_info_feats.json`)
    //     .then(response => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //     }).then(data => {
    //       passage_user_info_features = data;
    //     })
    const c = fetch(`https://jameshargreaves12.github.io/reference_data/word_feats.json`)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        }).then(data => {
          word_feats = data;
        })
    return Promise.all([c]);
}

const fetches = arrFreqAndFileName.map(([freq, fileName]) => 
    fetch(`https://jameshargreaves12.github.io/reference_data/${fileName}.json`)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
        // Set the appropriate frequency variable based on ngram type
        for (let key in data) {
            freq[key] = data[key];
        }
        })
)
Promise.all([...fetches, setup_pyodide(), load_lgbm_feat_files()]).then(() => {
  is_initialised.value = true;
  console.log("Initialized passage worker");
});

function getOrPad(passage, index) {
    if (index < 0) {
      return "<S>";
    }
    if (index >= passage.length) {
      return "<E>";
    }
    return passage[index];
}


function get_default_error_score_norm(passage, quadgram_error_model){
    let model_score = 0
    for (let i = 0; i < passage.length; i++) {
        const char = getOrPad(passage, i)
        const bigram = getOrPad(passage, i+1) + char
        const trigram = getOrPad(passage, i+2) + bigram
        const quadgram = getOrPad(passage, i+3) + trigram
        model_score += quadgram_error_model["seen_preds"][quadgram] || quadgram_error_model["default"]
    }
    return model_score / passage.length
}


function getErrorScoreAndMostLikelyErrorChars(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct) {
    let passageErrorScore = 0;
    let charWeight = Object.keys(seenLog['char']).length ** 2  / 75;
    let bigramWeight = Object.keys(seenLog['bigram']).length ** 2 / (75*75);
    let trigramWeight = Object.keys(seenLog['trigram']).length ** 2 / (75*75*75);
    let quadgramWeight = Object.keys(seenLog['quadgram']).length ** 2 / (75*75*75*75);
    let totalWeight = charWeight + bigramWeight + trigramWeight + quadgramWeight;
    charWeight /= totalWeight;
    bigramWeight /= totalWeight;
    trigramWeight /= totalWeight;
    quadgramWeight /= totalWeight;
    const indexToScore = [];
    const persoalErrorWeight = Math.min(1, errorCount / 500);
    const hightlightPersoalErrorWeight = Math.max(0.5, Math.min(1, errorCount / 500));

    for(let i = 0; i < passage.length; i++) {
      const char = getOrPad(passage, i);
      const bigram = getOrPad(passage, i+1) + char;
      const trigram = getOrPad(passage, i+2) + bigram;
      const quadgram = getOrPad(passage, i+3) + trigram;

      const personalCharScore = (errorLog['char'][char] || 0) / (seenLog['char'][char] || 1);
      const personalBigramScore = (errorLog['bigram'][bigram] || 0) / (seenLog['bigram'][bigram] || 1);
      const personalTrigramScore = (errorLog['trigram'][trigram] || 0) / (seenLog['trigram'][trigram] || 1);
      const personalQuadgramScore = (errorLog['quadgram'][quadgram] || 0) / (seenLog['quadgram'][quadgram] || 1);
      const p_score = charWeight * personalCharScore + bigramWeight * personalBigramScore + trigramWeight * personalTrigramScore + quadgramWeight * personalQuadgramScore;
      const d_score = (defaultQuadgramErrorModel["seen_preds"][quadgram] || defaultQuadgramErrorModel["default"])

      const charScore = (1 - hightlightPersoalErrorWeight) * d_score + hightlightPersoalErrorWeight * p_score;
      indexToScore.push({
        index: i,
        score: charScore
      }); 
      passageErrorScore += (1 - persoalErrorWeight) * d_score + persoalErrorWeight * p_score;
    }
    const highlightIndecies = indexToScore.sort((a, b) => b.score - a.score).slice(0, highlight_error_pct*passage.length).map(item => item.index);
    return {
      errorScore: passageErrorScore / passage.length,
      highlightIndecies
    };
}

function getErrorScores(passages, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct) {
  result = {
    errorScores: [],
    passageToHighlightIndecies: {}
  }
  for (let i = 0; i < passages.length; i++) {
    const passage = passages[i];
    const {errorScore,highlightIndecies} = getErrorScoreAndMostLikelyErrorChars(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct);
    result.errorScores.push(errorScore);
    result.passageToHighlightIndecies[passage] = highlightIndecies;
  }
  return result;
}

function getNaturalnessScore(passage, quadgramFrequency) {
    let naturalnessScore = 0;
    for(let i = 0; i < passage.length; i++) {
      const char = getOrPad(passage, i);
      const bigram = getOrPad(passage, i+1) + char;
      const trigram = getOrPad(passage, i+2) + bigram;
      const quadgram = getOrPad(passage, i+3) + trigram;

      naturalnessScore += (quadgramFrequency[quadgram] || 0);
    }
    return naturalnessScore / passage.length;
}

function getDesireForPassage(passage, quadgramFrequency, error_score, lgbm_score) {
    const expectedErrorScore = 0.1;
    const expectedNaturalnessScore = 0.00002;
    const naturalnessScore = getNaturalnessScore(passage, quadgramFrequency);
    return (error_score / expectedErrorScore) + 0.02 * (naturalnessScore / expectedNaturalnessScore) + lgbm_score * 3;
}


self.onmessage = async function(e) {
  try{
    if (e.data.type === 'sourceChange') {
      currentSource = e.data.source;
      if (source_passages[currentSource]) {
        return;
      }
      fetch(source_paths[currentSource])
        .then(response => response.text())
        .then(text => source_passages[currentSource] = text.split("\n"))
      return;
    }
    if (!is_initialised.value) {
      console.log("Not initialised");
      return;
    }

    const { 
      upcomingPassages, 
      recentPassages, 
      errorLog, 
      seenLog, 
      errorCount,
      user_intro_acc,
      user_intro_wpm,
      highlight_error_pct
    } = e.data;
    let correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource).map(passage => passage.passage);

    // not yet initialised
    if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
      return;
    }

    const passages = source_passages[currentSource];
    
    const newUpcomingPassages = [...correctSourceUpcomingPassages];
    
    for (let i = 0; i < 100; i++) {
      const randomPassage = passages[Math.floor(Math.random() * passages.length)];
      if (!newUpcomingPassages.includes(randomPassage) && !recentPassages.includes(randomPassage)) {
        newUpcomingPassages.push(randomPassage);
      } else {
        i--;
      }
    }
    const lgbm_scores = await call_lgbm(newUpcomingPassages, user_intro_acc, user_intro_wpm);
    const {errorScores, passageToHighlightIndecies} = getErrorScores(newUpcomingPassages, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct);

    const desire_for_passages = newUpcomingPassages.map((passage, index) => getDesireForPassage(passage, quadgramFrequency, errorScores[index], lgbm_scores[index]));
    const result = newUpcomingPassages.map((passage) => ({passage, source: currentSource, highlightIndecies: passageToHighlightIndecies[passage]})).sort((a, b) =>  - desire_for_passages[a.passage] + desire_for_passages[b.passage]).slice(0, 10);
    
    let result_with_error_highlight_indecies = result;
    try{
      if (BETTER_ERROR_MODEL && HAS_SUCCEEDED_ONCE) {
        result_with_error_highlight_indecies = await add_error_highlight_indecies(result,highlight_error_pct);
      }
    } catch (e) {
      BETTER_ERROR_MODEL = false;
    }
    HAS_SUCCEEDED_ONCE = true;
    self.postMessage(result_with_error_highlight_indecies);
  } catch (e) {
    self.postMessage({type: 'error', error: e});
  }
}; 