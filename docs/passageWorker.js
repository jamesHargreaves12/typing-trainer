// TODO weight this based on seen data and move it to hyperparams.
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
const NEG_INF = Number.POSITIVE_INFINITY;

importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js");
importScripts("hyperparams.js");
let pyodide = undefined;

let currentSource = 'wikipedia';
let quadgramFrequency = {};
let defaultQuadgramErrorModel = {};
const source_passages = {}
let passage_user_info_features = {};
let word_feats = {};
let is_initialised = { value: false };

source_paths = {
  'wikipedia': 'https://jameshargreaves12.github.io/reference_data/cleaned_wikipedia_articles.txt',
  'sherlock': 'https://jameshargreaves12.github.io/reference_data/sherlock_holmes.txt',
  'words': 'https://jameshargreaves12.github.io/reference_data/top_quality_words.json'
}

async function setup_pyodide() {
  pyodide = await loadPyodide();
  // Pyodide is now ready to use...

  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport("micropip");
  const [x, lgbm_response, error_model_response] = await Promise.all([
    micropip.install(['lightgbm', 'numpy']),
    fetch('https://jameshargreaves12.github.io/reference_data/lgbm_v3/lgbm_model.txt'),
    fetch('https://jameshargreaves12.github.io/reference_data/error_model_weights.npz')
  ]);
  // await micropip.install('numpy');
  const lgbm_model = await lgbm_response.text();
  await pyodide.FS.writeFile('model.txt', lgbm_model);

  const error_model = await error_model_response.arrayBuffer();
  await pyodide.FS.writeFile('error_model_weights.npz', new Uint8Array(error_model));
  console.log("Model saved to pyodide successfully");
}

// Gamma sampler (Marsaglia & Tsang)
function gammaSample(shape, scale = 1) {
  if (shape < 1) {
    // Weibull algorithm for shape < 1
    const u = Math.random();
    return gammaSample(1 + shape, scale) * Math.pow(u, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x, v;
    do {
      x = normalSample(); // N(0,1)
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = Math.random();
    if (
      u < 1 - 0.0331 * (x * x) * (x * x) ||
      Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))
    ) {
      return scale * d * v;
    }
  }
}

// Normal sampler using Box–Muller
function normalSample() {
  let u = 0, v = 0;
  while (u === 0) u = Math.random(); // avoid 0
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// Beta sampler
function betaSample(alpha, beta) {
  const x = gammaSample(alpha, 1);
  const y = gammaSample(beta, 1);
  return x / (x + y);
}

function samplePassages(alreadySeenPassages, passagesWithHp, count = 2) {
  const seenPassages = alreadySeenPassages;
  const passageWeights = [];
  for (let j = 0; j < passagesWithHp.length; j++) {
    const passage = passagesWithHp[j]["passage"];
    const alpha = passagesWithHp[j]["alpha"];
    const beta = passagesWithHp[j]["beta"];
    const p = betaSample(alpha, beta);
    passageWeights.push({ passage, weight: p });
  }
  const weightedPassages = passageWeights.sort((a, b) => b.weight - a.weight);
  const retPassages = [];
  for (let i = 0; i < weightedPassages.length; i++) {
    if (seenPassages.includes(weightedPassages[i].passage)) {
      continue;
    }
    seenPassages.push(weightedPassages[i].passage);
    retPassages.push(weightedPassages[i].passage);
    if (retPassages.length >= count) {
      break;
    }
  }
  return retPassages;
}


const arrFreqAndFileName = [[quadgramFrequency, 'quadgrams_2'], [defaultQuadgramErrorModel, 'quadgram_error_model']];
const get_or_zero = (obj, key) => obj[key] || 0;
const get_features = (passage, user_intro_acc, user_intro_wpm) => {
  const features = {
    "user_intro_acc": user_intro_acc,
    "user_intro_wpm": user_intro_wpm,
    "time_hour": new Date().getUTCHours(),
    "day_of_week": new Date().getUTCDay(),
  };

  // features["passage_many_to_end_count"] = passage_feats[passage]
  // const passage_user_info = passage_user_info_features[passage]
  // features["passage_median_relative_wpm"] = passage_user_info ? passage_user_info[0] : undefined;
  // features["passage_median_relative_acc"] = passage_user_info ? passage_user_info[1] : undefined;

  const wordScores = passage.split(" ").filter(word => word_feats[word]).map(word => word_feats[word]);
  if (wordScores.length > 0) {
    features["word_zero_to_end_count_max"] = Math.max(...wordScores.map(word_score => word_score[0]));
    features["word_one_to_end_count_max"] = Math.max(...wordScores.map(word_score => word_score[1]));
    features["word_many_to_end_max"] = Math.max(...wordScores.map(word_score => word_score[2]));

    // features["word_zero_to_end_max"] = Math.max(...wordScores.map(word_score => word_score[0]));
    features["word_one_to_end_count_min"] = Math.min(...wordScores.map(word_score => word_score[1]));
    features["word_many_to_end_min"] = Math.min(...wordScores.map(word_score => word_score[2]));

    // features["word_many_to_end_min"] = Math.min(...wordScores);
    features["word_zero_to_end_count_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[0], 0) / wordScores.length;
    features["word_one_to_end_count_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[1], 0) / wordScores.length;
    features["word_many_to_end_mean"] = wordScores.reduce((acc, word_scores) => acc + word_scores[2], 0) / wordScores.length;
    // features["word_many_to_end_count_positive"] = wordScores.filter(score => score > 0).length;
    // features["word_many_to_end_count_negative"] = wordScores.filter(score => score < 0).length;
  } else {
    features["word_zero_to_end_count_max"] = undefined;
    features["word_one_to_end_count_max"] = undefined;
    features["word_many_to_end_max"] = undefined;
    features["word_one_to_end_count_min"] = undefined;
    features["word_many_to_end_min"] = undefined;
    features["word_zero_to_end_count_mean"] = undefined;
    features["word_one_to_end_count_mean"] = undefined;
    features["word_many_to_end_mean"] = undefined;
    // features["word_many_to_end_count_positive"] = undefined;
    // features["word_many_to_end_count_negative"] = undefined;
  }
  // Count letters
  const letterCounts = passage.split("").reduce((acc, letter) => {
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});
  features["apostrophe_len"] = letterCounts["'"] || 0;
  features["comma_len"] = letterCounts[","] || 0;
  features["period_len"] = letterCounts["."] || 0;
  features["exclamation_mark_len"] = letterCounts["!"] || 0;
  features["passage_len"] = passage.length;
  features["open_paren_len"] = letterCounts["("] || 0;
  features["close_paren_len"] = letterCounts[")"] || 0;
  features["question_len"] = letterCounts["?"] || 0;
  features["colon_len"] = letterCounts[":"] || 0;
  features["dash_len"] = letterCounts["-"] || 0;
  "abcdefghijklmnopqrstuvwxyz0123456789".split("").forEach(letter => {
    features[letter + "_len"] = letterCounts[letter] || 0;
  });

  features["punc_len"] = "()\"',.?!-:".split("").reduce((acc, letter) => acc + get_or_zero(letterCounts, letter), 0);
  features["caps_len"] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").reduce((acc, letter) => acc + get_or_zero(letterCounts, letter), 0);
  features["numbers_len"] = "0123456789".split("").reduce((acc, letter) => acc + get_or_zero(letterCounts, letter), 0);

  return features;
}

const call_lgbm = async (passages, user_intro_acc, user_intro_wpm) => {
  const data = passages.map(passage => (
    get_features(passage, user_intro_acc, user_intro_wpm)
  ));
  // console.log(data);
  // Save the model text to the Pyodide file system
  console.log("feats", data[0]);
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

const cartesianProduct = (a, b) => {
  return [].concat(...a.map(x => b.map(y => [x, y])));
}

const LETTER_BASED_STRATEGY_MODES = ["letter-error", "letter-speed", "many-rep-letter-error", "many-rep-letter-speed", "words-error", "words-speed", "many-rep-words-error", "many-rep-words-speed"];

const LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz".split('');
const LOGICAL_LETTER_GROUPINGS = {
  most_common: "etaoinsr".split(''),
  punc: "(%!).?\",-:\\';_£'".split(''),
  caps: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(''),
  rare_letters: "zxjqkv".split(''),
  home_row: "asdfjkl".split(''),
  top_row: "qwertyuiop".split(''),
  bottom_row: "zxcvbnm".split(''),
  pinky: "qazp".split(''),
  ring_pinky: "qazpwsxol".split(''),
  left_hand: "qwertasdfgzxcv".split(''),
  right_hand: "yuiophjklnm".split(''),
  numbers: "1234567890".split(''),
  difficult_to_reach_letters: "ytbz".split('')
}

const LOGICAL_BIGRAM_GROUPINGS = {
  repeat_bigrams: LOWER_CASE_LETTERS.map((x, i) => `${x}${LOWER_CASE_LETTERS[i]}`),

  left_hand_only_bigrams: cartesianProduct(LOGICAL_LETTER_GROUPINGS.left_hand, LOGICAL_LETTER_GROUPINGS.left_hand)
    .map(([x, y]) => `${x}${y}`),

  right_hand_only_bigrams: cartesianProduct(LOGICAL_LETTER_GROUPINGS.right_hand, LOGICAL_LETTER_GROUPINGS.right_hand)
    .map(([x, y]) => `${x}${y}`),

  alternate_hand_bigrams: [
    ...cartesianProduct(LOGICAL_LETTER_GROUPINGS.left_hand, LOGICAL_LETTER_GROUPINGS.right_hand),
    ...cartesianProduct(LOGICAL_LETTER_GROUPINGS.right_hand, LOGICAL_LETTER_GROUPINGS.left_hand)
  ].map(([x, y]) => `${x}${y}`)
};

const finger_keys = ["qaz", "wsx", "edc", "rfvtg", "yhnujm", "ujm", "ik", "ol", "p"].map(x => x.split(''));


LOGICAL_BIGRAM_GROUPINGS.same_finger_bigrams = finger_keys.flatMap(fks =>
  cartesianProduct(fks, fks)
    .map(([x, y]) => `${x}${y}`)
    .filter(bigram => !LOGICAL_BIGRAM_GROUPINGS.repeat_bigrams.includes(bigram))
);

const getBestGuessTimeToTypeLetter = (speedLog) => {
  const timeToTypeLetter = {}
  for (let letter in speedLog['char']) {
    const priorStd = HYPERPARAMS["LETTER_SPEED_STD"][letter];
    const priorMean = HYPERPARAMS["LETTER_SPEED_MEAN"][letter];
    const priorVar = priorStd ** 2;

    const speeds = speedLog["char"][letter] || [];
    const N = speeds.length;
    if (N == 0) {
      timeToTypeLetter[letter] = priorMean;
    }
    else {
      const sampleMeanTimesN = speeds.reduce((a, b) => a + b, 0);
      const posteriorVar = 1 / (1 / priorVar + N / priorVar);
      const posteriorMean = posteriorVar * (priorMean / priorVar + sampleMeanTimesN / priorVar);
      timeToTypeLetter[letter] = posteriorMean;
    }
  }
  return timeToTypeLetter;
}

const computeSpeedChangePerRepEstimate = (timeToTypeLetter) => {
  const typeSpeedChangePerRep = {}
  for (let letter in timeToTypeLetter) {
    const tttLetter = timeToTypeLetter[letter];
    const changabilityPerOccurence = -Math.exp((HYPERPARAMS["LETTER_CHANGABILITY_PER_OCCURENCE_M"][letter] * tttLetter + HYPERPARAMS["LETTER_CHANGABILITY_PER_OCCURENCE_C"][letter]));
    typeSpeedChangePerRep[letter] = changabilityPerOccurence;
  }
  return typeSpeedChangePerRep;
}

const computeValuePerRepEstimateSpeed = (speedLog) => {
  const timeToTypeLetter = getBestGuessTimeToTypeLetter(speedLog);
  const typeSpeedChangePerRep = computeSpeedChangePerRepEstimate(timeToTypeLetter);

  const valuePerRep = {}
  for (let letter in typeSpeedChangePerRep) {
    const tscpr = typeSpeedChangePerRep[letter];
    const freq = HYPERPARAMS["LETTER_FREQUENCY"][letter];
    const timePerLetter = timeToTypeLetter[letter];
    const val = - (timePerLetter * tscpr * freq);  // negative so that the values is positive (tspcr is reduction in time)
    valuePerRep[letter] = Math.min(val, 0.0000005);
  }
  return valuePerRep;
}

const computeValuePerRepEstimateError = (charErrorLog, charSeenLog) => {
  const errorRateLetter = findUnigramErrorRates(charErrorLog, charSeenLog);
  const valuePerRep = {}
  for (let letter in errorRateLetter) {
    const errorRate = errorRateLetter[letter];
    const freq = HYPERPARAMS["LETTER_FREQUENCY"][letter];
    const val = freq * (errorRate - (errorRate / (1 + errorRate * HYPERPARAMS["ERROR_GAP_CHANGE_PER_OCCURENCE_M"][letter])));
    valuePerRep[letter] = val;
  }
  return valuePerRep;
}

const pickTopLetter = (letterValuesPair) => {
  if (letterValuesPair.length == 0) {
    return 'e';
  }
  const totalValue = letterValuesPair.reduce((a, b) => a + b[1], 0);
  const loc = Math.random() * totalValue;
  let cumSum = 0;
  for (let [letter, value] of letterValuesPair) {
    cumSum += value;
    if (cumSum > loc) {
      return letter;
    }
  }
  return 'e';
}

const isLowercaseLetter = (str) => {
  return str.length === 1 && str >= 'a' && str <= 'z';
}

const getLetterErrorSuggestionFromErrorLog = (charErrorLog, charSeenLog, previousRepSelectionStrategies, strategyMode) => {
  const errorSelectionStrategies = previousRepSelectionStrategies.filter(strategy => strategy && strategy.startsWith(strategyMode)).map(strategy => strategy.split("->")[1]);

  const valuePerRep = computeValuePerRepEstimateError(charErrorLog, charSeenLog);
  const wasLastNumber = errorSelectionStrategies.length == 0 ? false : isStringNumber(errorSelectionStrategies[0]);
  const topCharacters = Object.entries(valuePerRep).filter(([letter, value]) => !errorSelectionStrategies.slice(0, 7).includes(letter) && !(wasLastNumber && isStringNumber(letter)) && letter != " ").sort((a, b) => b[1] - a[1]);
  const topLetters = topCharacters.filter(([letter, value]) => isLowercaseLetter(letter));
  return [pickTopLetter(topCharacters.slice(0, 12)), pickTopLetter(topLetters.slice(0, 12))];
}

const isStringNumber = (str) => {
  return !isNaN(parseInt(str));
}

const getLetterSpeedSuggestionFromSpeedLog = (speedLog, previousRepSelectionStrategies, strategyMode) => {
  const speedSelectionStrategies = previousRepSelectionStrategies.filter(strategy => strategy && strategy.startsWith(strategyMode)).map(strategy => strategy.split("->")[1]);

  const valuePerRep = computeValuePerRepEstimateSpeed(speedLog);
  const wasLastNumber = speedSelectionStrategies.length == 0 ? false : isStringNumber(speedSelectionStrategies[0]);
  const topCharacters = Object.entries(valuePerRep).filter(([letter, value]) => !speedSelectionStrategies.includes(letter) && !(wasLastNumber && isStringNumber(letter)) && letter != " ").sort((a, b) => b[1] - a[1]);
  const topLetters = topCharacters.filter(([letter, value]) => isLowercaseLetter(letter));
  return [pickTopLetter(topCharacters.slice(0, 12)), pickTopLetter(topLetters.slice(0, 12))];
}

const suggestErrorGroupStrategyFromInterstingErrors = (interestingErrorLog, seenLog, previousRepSelectionStrategies) => {
  const previousErrorGroupStrategies = previousRepSelectionStrategies.filter(strategy => strategy && strategy.startsWith("error-group"));
  const charErrorLog = interestingErrorLog['char'];
  const bigramErrorLog = interestingErrorLog['bigram'];
  const charSeenLog = seenLog['char'];
  const bigramSeenLog = seenLog['bigram'];

  const groupErrorCount = {};
  const groupSeenCount = {};

  for (let group in LOGICAL_LETTER_GROUPINGS) {
    const groupChars = LOGICAL_LETTER_GROUPINGS[group];
    for (let char of groupChars) {
      groupErrorCount[group] = (groupErrorCount[group] || 0) + (charErrorLog[char] || 0);
      groupSeenCount[group] = (groupSeenCount[group] || 0) + (charSeenLog[char] || 0);
    }
  }
  for (let group in LOGICAL_BIGRAM_GROUPINGS) {
    const groupBigrams = LOGICAL_BIGRAM_GROUPINGS[group];
    for (let bigram of groupBigrams) {
      groupErrorCount[group] = (groupErrorCount[group] || 0) + (bigramErrorLog[bigram] || 0);
      groupSeenCount[group] = (groupSeenCount[group] || 0) + (bigramSeenLog[bigram] || 0);
    }
  }

  let maxCost = 0;
  let maxCostGroup = null;
  let previousSelectedStrategy = previousErrorGroupStrategies ? previousErrorGroupStrategies[0] : null;
  let tmp = []
  for (let group in groupErrorCount) {
    const errorCount = groupErrorCount[group] || 0;
    const seenCount = groupSeenCount[group] || 0;
    const meanRate = HYPERPARAMS["LOGICAL_GROUP_MEAN_RATE"][group];
    const std = HYPERPARAMS["LOGICAL_GROUP_STD"][group];
    const errorRate = findMAP(meanRate, std, errorCount, seenCount);
    const cost = errorRate * HYPERPARAMS["LOGICAL_GROUP_FREQUENCY"][group];
    tmp.push([cost, group, HYPERPARAMS["LOGICAL_GROUP_FREQUENCY"][group], errorRate]);
    // console.log(group, errorRate, cost);
    if (cost > maxCost && group != previousSelectedStrategy) {
      maxCost = cost;
      maxCostGroup = group;
    }
  }
  // Fallback just in case.
  if (maxCostGroup == null) {
    maxCostGroup = previousSelectedStrategy;
  }
  return maxCostGroup || "error-group";
}


function findMAP(base_model_mean, base_model_std, numPos, total, tol = 1e-10, maxIter = 30, verbose = false) {
  if (total == 0) {
    return base_model_mean;
  }

  const kink = 0.01;
  const totNeg = total - numPos;
  // start at ML (clamped into (0,1))
  let factor = 1;
  let e = base_model_mean;
  let hasCrossedKink = false;
  for (let i = 0; i < maxIter; i++) {
    // gradient of log-prior
    // Prior is a gaussian above the kink and then a sqrt decay to 0 bellow it
    const dPrior = e < kink
      ? (e === 0 ? Infinity : 0.5 / e)
      : -((e - base_model_mean) / base_model_std);

    // second deriv of log-prior
    const d2Prior = e < kink
      ? -1 / e / e
      : -1 / base_model_std;
    // gradient & Hessian of log-likelihood
    const dLik = numPos / e - totNeg / (1 - e);
    const d2Lik = -numPos / (e * e) - totNeg / ((1 - e) * (1 - e));
    // Newton step on -(prior+lik)
    const g = -(dPrior + dLik);
    const h = -(d2Prior + d2Lik);
    let step = g / h * factor;
    while (e < kink && e - step / 2 > kink && Math.abs(step) > tol) {
      factor *= 0.5;
      step = g / h * factor;
    }
    if (e < kink) {
      hasCrossedKink = true;
    } else if (e > kink && e - step < kink && hasCrossedKink) {
      // Indicates that this is the second time crossing the king, so put it very close to the kink so that the step size gets pushed down for the next step if it wants to cross back
      e = kink - tol / 2;
      continue;
    }
    if (verbose) {
      console.log(i, step, e);
    }
    e -= step;

    if (e <= 1e-3) { e = 1e-3; }
    if (e >= 1 - 1e-6) { e = 1 - 1e-6; }
    if (Math.abs(step) < tol) break;
  }
  return e;
}

function findUnigramErrorRates(charErrorLog, charSeenLog) {
  best_error_rates = {};
  for (let letter of Object.keys(charSeenLog)) {
    const errorCount = charErrorLog[letter] ?? 0;
    const seenCount = charSeenLog[letter] ?? 0;
    const verbose = false;
    if (verbose) {
      console.log("letter", letter, "errorCount", errorCount, "seenCount", seenCount, "verbose", verbose);
    }
    const bestErr = findMAP(
      HYPERPARAMS["LETTER_MEAN_RATE"][letter],
      HYPERPARAMS["LETTER_STD"][letter],
      errorCount,
      seenCount,
      1e-10,
      30,
      verbose
    );
    best_error_rates[letter] = bestErr;
  }
  return best_error_rates;
}
// TODO move to hyperparams.
const [CNN_WEIGHT, UNIGRAM_WEIGHT, BIAS] = [0.6850118774971654 * 3, 0.645296487587596 * 2, -0.014092068726190543 * 0] // * are basic fudge factors from me. TODO come up with a better method e.g.  it should be waited by reps complete

const add_error_highlight_indecies = async (passages, highlight_error_pct, unigramErrorLog, unigramSeenLog) => {
  // For performance reasons only do it for the top passage
  const highlightIndecies = await compute_error_highlight_indecies(passages[0].passage, highlight_error_pct, unigramErrorLog, unigramSeenLog);
  passages[0].highlightIndecies = highlightIndecies;
  return passages;
}

const compute_error_highlight_indecies = async (passage, highlight_error_pct, unigramErrorLog, unigramSeenLog) => {
  const cnn_score = await error_scores_cached(passage)
  const unigram_error_rates = findUnigramErrorRates(unigramErrorLog, unigramSeenLog);
  const unigram_score = passage.split('').map((char, _) => unigram_error_rates[char] || 0);
  const by_cnn = cnn_score.map((score, index) => ({ index, score: score })).sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
  const by_unigram = unigram_score.map((score, index) => ({ index, score: score })).sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
  const indexToScore = cnn_score.map((score, index) => ({ index, score: CNN_WEIGHT * score + UNIGRAM_WEIGHT * unigram_score[index] + BIAS }));
  const highlightIndecies = indexToScore.sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
  console.log("by_cnn", by_cnn);
  console.log("by_unigram", by_unigram);
  console.log("highlightIndecies", highlightIndecies);
  return highlightIndecies;
}

const load_lgbm_feat_files = async () => {
  const c = fetch(`https://jameshargreaves12.github.io/reference_data/lgbm_v3/word_feats.json`)
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


function get_default_error_score_norm(passage, quadgram_error_model) {
  let model_score = 0
  for (let i = 0; i < passage.length; i++) {
    const char = getOrPad(passage, i)
    const bigram = getOrPad(passage, i + 1) + char
    const trigram = getOrPad(passage, i + 2) + bigram
    const quadgram = getOrPad(passage, i + 3) + trigram
    model_score += quadgram_error_model["seen_preds"][quadgram] || quadgram_error_model["default"]
  }
  return model_score / passage.length
}


function getErrorScoreAndMostLikelyErrorChars(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct) {
  let passageErrorScore = 0;
  // These should probably come from hyperparams?
  let charWeight = Object.keys(seenLog['char']).length ** 2 / 75;
  let bigramWeight = Object.keys(seenLog['bigram']).length ** 2 / (75 * 75);
  let trigramWeight = Object.keys(seenLog['trigram']).length ** 2 / (75 * 75 * 75);
  let quadgramWeight = Object.keys(seenLog['quadgram']).length ** 2 / (75 * 75 * 75 * 75);
  let totalWeight = charWeight + bigramWeight + trigramWeight + quadgramWeight;
  charWeight /= totalWeight;
  bigramWeight /= totalWeight;
  trigramWeight /= totalWeight;
  quadgramWeight /= totalWeight;
  const indexToScore = [];
  const persoalErrorWeight = Math.min(1, errorCount / 500);
  const hightlightPersoalErrorWeight = Math.max(0.5, Math.min(1, errorCount / 500));

  for (let i = 0; i < passage.length; i++) {
    const char = getOrPad(passage, i);
    const bigram = getOrPad(passage, i + 1) + char;
    const trigram = getOrPad(passage, i + 2) + bigram;
    const quadgram = getOrPad(passage, i + 3) + trigram;

    const personalCharScore = (errorLog['char'][char] || 0) / (seenLog['char'][char] || 1);
    const personalBigramScore = (errorLog['bigram'][bigram] || 0) / (seenLog['bigram'][bigram] || 1);
    const personalTrigramScore = (errorLog['trigram'][trigram] || 0) / (seenLog['trigram'][trigram] || 1);
    const personalQuadgramScore = (errorLog['quadgram'][quadgram] || 0) / (seenLog['quadgram'][quadgram] || 1);
    const p_score = charWeight * personalCharScore + bigramWeight * personalBigramScore + trigramWeight * personalTrigramScore + quadgramWeight * personalQuadgramScore;
    const d_score = (defaultQuadgramErrorModel["seen_preds"][quadgram] || defaultQuadgramErrorModel["default"]);

    const charScore = (1 - hightlightPersoalErrorWeight) * d_score + hightlightPersoalErrorWeight * p_score;
    indexToScore.push({
      index: i,
      score: charScore
    });
    passageErrorScore += (1 - persoalErrorWeight) * d_score + persoalErrorWeight * p_score;
  }
  const highlightIndecies = indexToScore.sort((a, b) => b.score - a.score).slice(0, highlight_error_pct * passage.length).map(item => item.index);
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
    const { errorScore, highlightIndecies } = getErrorScoreAndMostLikelyErrorChars(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct);
    result.errorScores.push(errorScore);
    result.passageToHighlightIndecies[passage] = highlightIndecies;
  }
  return result;
}

function getNaturalnessScore(passage, quadgramFrequency) {
  let naturalnessScore = 0;
  for (let i = 0; i < passage.length; i++) {
    const char = getOrPad(passage, i);
    const bigram = getOrPad(passage, i + 1) + char;
    const trigram = getOrPad(passage, i + 2) + bigram;
    const quadgram = getOrPad(passage, i + 3) + trigram;

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

function getScoreBySelectionStrategy(passage, selectionStratedy) {
  if (selectionStratedy == null) {
    return 0;
  }
  if (!selectionStratedy.includes("->")) {
    console.error("Selection strategy must include ->");
    return 0;
  }
  const selectionMode = selectionStratedy.split("->")[0];
  const actualStrategy = selectionStratedy.split("->")[1];
  if (LETTER_BASED_STRATEGY_MODES.includes(selectionMode)) {
    const letterSuggestion = actualStrategy;
    return passage.split('').map((char, index) => letterSuggestion == char ? index : null).filter(index => index !== null).length / passage.length;
  }

  if (actualStrategy == "most_common") {
    return (passage.split('').filter(char => LOGICAL_LETTER_GROUPINGS["most_common"].includes(char)).length - passage.split('').filter(char => LOGICAL_LETTER_GROUPINGS["punc"].includes(char)).length) / passage.length;
  }

  if (actualStrategy in LOGICAL_LETTER_GROUPINGS) {
    const letters = LOGICAL_LETTER_GROUPINGS[actualStrategy];
    return passage.split('').filter(char => letters.includes(char)).length / passage.length;
  }
  if (actualStrategy in LOGICAL_BIGRAM_GROUPINGS) {
    const bigrams = LOGICAL_BIGRAM_GROUPINGS[actualStrategy];
    return passage.split('').filter((char, index) => bigrams.includes(char + getOrPad(passage, index + 1))).length / passage.length;
  }

  return 0;
}

function topNBySelectionStrategy(passages, selectionStratedy, n) {
  if (selectionStratedy == null) {
    return passages;
  }
  passages = passages.sort((a, b) => getScoreBySelectionStrategy(a, selectionStratedy) - getScoreBySelectionStrategy(b, selectionStratedy));
  return passages.slice(passages.length - n, passages.length);
}


function numberToWords(n) {
  if (n < 0 || n > 2100 || !Number.isInteger(n)) return null;
  const units = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

  function under100(num) {
    if (num < 20) return units[num];
    const t = Math.floor(num / 10), u = num % 10;
    return tens[t] + (u ? " " + units[u] : "");
  }

  if (n < 100) return under100(n);
  if (n < 1000) {
    const h = Math.floor(n / 100), r = n % 100;
    return units[h] + " hundred" + (r ? " and " + under100(r) : "");
  }
  if (n < 2000) {
    const r = n % 1000;
    return "one thousand" + (r ? " " + numberToWords(r) : "");
  }
  if (n <= 2100) {
    const r = n % 2000;
    return "two thousand" + (r ? " " + numberToWords(r) : "");
  }
}

function simplifySentence(input) {
  // Preserve abbreviations and numbers
  const abbreviations = /\b([A-Z]\.){2,}/g;
  const preserved = [];
  let text = input.replace(abbreviations, match => {
    preserved.push(match);
    return `__PRESERVED_${preserved.length - 1}__`;
  });

  let sentences = text.split(".");
  sentences = sentences.map(sentence => {
    sentence = sentence
      .trim()
      .split(/\s+/)
      .map((word, idx) => {
        if (idx > 0 && /^[A-Z][a-z]/.test(word) || /^[A-Z]{2,}$/.test(word)) return word;
        return word.toLowerCase();
      })
      .join(' ');
    return sentence;
  });
  text = sentences.join(". ");


  text = text.replace(/,(?=\s*\d{3})/g, '__NUMCOMMA__'); // keep numeric commas
  text = text.replace(/,(?=\s*[A-Z][a-z]+ \d{1,2}, \d{4})/g, '__DATECOMMA__'); // keep date commas
  text = text.replace(/,/g, ''); // remove other commas

  // Remove periods at sentence ends, keep for decimals
  text = text.replace(/(?<=\d)\.(?=\d)/g, '__DECIMAL__'); // decimal numbers
  text = text.replace(/\.(?=\s|$)/g, ''); // remove sentence periods

  // Remove semicolons, colons, and quotation marks
  text = text.replace(/[;:"“”]/g, '');

  // Remove parentheses and brackets
  text = text.replace(/[\(\)\[\]]/g, '');

  // Restore preserved tokens
  text = text
    .replace(/__PRESERVED_(\d+)__/g, (_, i) => preserved[i])
    .replace(/__NUMCOMMA__/g, ',')
    .replace(/__DATECOMMA__/g, ',')
    .replace(/__DECIMAL__/g, '.');

  return text.trim();
}

function makePassageEasy(passage) {

  // Replace all numbers in the passage with their string representation using numberToWords
  // We'll match numbers (integers) and replace them
  const easyPassageWithNumbers = passage.replace(/\b\d+\b/g, (match) => {
    const num = parseInt(match, 10);
    const val = numberToWords(num);
    if (val) {
      return val;
    }
    return match;
  });

  passage = simplifySentence(easyPassageWithNumbers);

  return passage;
  // const easyPassage = passage.split('').map(char => {
  //   if (LOGICAL_LETTER_GROUPINGS["punc"].includes(char)) {
  //     return " ";
  //   }
  //   return char;
  // }).join('');
  // return easyPassage.replace(/\s+/g, ' ').trim();
}

const shortenPassageBasedOnStrategy = (passages, strategy) => {
  if (!strategy || !LETTER_BASED_STRATEGY_MODES.includes(strategy.split("->")[0])) {
    return;
  }
  console.log("shortenPassageBasedOnStrategy", strategy, passages[0].passage);
  for (let i = 0; i < 1; i++) {
    const passage = passages[i].passage;
    let sentences = passage.split(".").map(sentence => sentence);
    const skip_indexs = [];
    for (let j = 0; j < sentences.length; j++) {
      const sentence = sentences[j];
      const strategyMode = strategy.split("->")[0];
      const actualStrategy = strategy.split("->")[1];
      if (strategyMode == "letter-speed" || strategyMode == "many-rep-letter-speed") {
        const letterSpeedSuggestion = actualStrategy;
        const numberOfInstances = sentence.split('').filter((char) => letterSpeedSuggestion == char).length;
        if (numberOfInstances == 0 && sentence.length > 10) {
          skip_indexs.push(j);
        }
      }
    }
    // Only remove sentences from start or end
    let remove_from_start = -1;
    let remove_from_end = sentences.length;
    for (let j = 0; j < sentences.length; j++) {
      if (skip_indexs.includes(j)) {
        remove_from_start = j;
      } else {
        break;
      }
    }
    for (let j = sentences.length - 1; j >= 0; j--) {
      if (skip_indexs.includes(j)) {
        remove_from_end = j;
      } else {
        break;
      }
    }
    let filtered_sentences = sentences.slice(remove_from_start + 1, remove_from_end).join(".").trim();

    if (`"'?!):;%,`.includes(filtered_sentences[0])) {
      filtered_sentences = filtered_sentences.slice(1).trim();
    }
    if (filtered_sentences.length > 30) {
      passages[i].passage = filtered_sentences;
    }
  }
}

const add_error_highlight_from_strategy = async (passages, strategy, unigramErrorLog, unigramSeenLog) => {
  const firstPassage = passages[0].passage;
  let strategyHighlightIndecies = [];
  const strategyMode = strategy.split("->")[0];
  const actualStrategy = strategy.split("->")[1];
  if (LETTER_BASED_STRATEGY_MODES.includes(strategyMode)) {
    const letterSpeedSuggestion = actualStrategy;
    const letterSpeedSuggestionIdxs = firstPassage.split('').map((char, index) => letterSpeedSuggestion == char ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = letterSpeedSuggestionIdxs;
  }
  else if (actualStrategy == "most_common") {
    const mostCommonLetterIdxs = firstPassage.split('').map((char, index) => LOGICAL_LETTER_GROUPINGS["most_common"].includes(char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = mostCommonLetterIdxs;
  }
  else if (actualStrategy in LOGICAL_LETTER_GROUPINGS) {
    const letters = LOGICAL_LETTER_GROUPINGS[actualStrategy];
    const letterIdxs = firstPassage.split('').map((char, index) => letters.includes(char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = letterIdxs;
  }
  else if (actualStrategy in LOGICAL_BIGRAM_GROUPINGS) {
    const bigrams = LOGICAL_BIGRAM_GROUPINGS[actualStrategy];
    const bigramIdxs = firstPassage.split('').map((char, index) => bigrams.includes(char + getOrPad(firstPassage, index + 1)) || bigrams.includes(getOrPad(firstPassage, index) + char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = bigramIdxs;
  }
  console.log("strategyHighlightIndecies", strategyHighlightIndecies, strategy);
  if (strategyHighlightIndecies.length > firstPassage.length * 0.25 && BETTER_ERROR_MODEL) {
    const errorModelHighlightIndecies = await compute_error_highlight_indecies(firstPassage, 0.25, unigramErrorLog, unigramSeenLog);
    const intersection = strategyHighlightIndecies.filter(index => errorModelHighlightIndecies.includes(index));
    strategyHighlightIndecies = intersection;
  }

  passages[0].highlightIndecies = strategyHighlightIndecies;

  // Not handling easy_mode I think this is dead?
  return passages;
}

const sourceChange = (source) => {
  currentSource = source;
  if (source_passages[currentSource]) {
    return;
  }
  fetch(source_paths[currentSource])
    .then(response => response.text())
    .then(text => source_passages[currentSource] = text.split("\n"));
  return;
}

let TOP_QUALITY_WORDS = null;
const fetch_top_quality_words = async () => {
  const response = await fetch(source_paths["words"]);
  const data = await response.json();
  return data;
}
const cachedGetWords = async (letter) => {
  if (!TOP_QUALITY_WORDS) {
    TOP_QUALITY_WORDS = await fetch_top_quality_words();
  }
  return TOP_QUALITY_WORDS[letter];
}

const create_passage_from_words = async (len_passage, letter, count_passages) => {
  const top_quality_words = await cachedGetWords(letter);
  let agg = "";
  // Sample without replacement
  // Make a shallow copy so we don't mutate the original list
  const passages = [];
  for (let i = 0; i < count_passages; i++) {
    let remaining_words = [...top_quality_words];
    while (agg.length < len_passage && remaining_words.length > 0) {
      // Recalculate total_weight for remaining words
      const current_total_weight = remaining_words.reduce((acc, word_weight) => acc + word_weight[1], 0);
      const random_word_weight = Math.random() * current_total_weight;
      let agg_weight = 0;
      for (let i = 0; i < remaining_words.length; i++) {
        const [word, weight] = remaining_words[i];
        agg_weight += weight;
        if (agg_weight >= random_word_weight) {
          agg += word + " ";
          remaining_words.splice(i, 1);
          break;
        }
      }
    }
    const passage = agg.trim();
    passages.push(passage);
  }
  return passages;
}

const randomlySelectExtraPassages = (max_new_passages, newUpcomingPassages, recentPassages) => {
  const passages = source_passages[currentSource];
  const initial_length = newUpcomingPassages.length;
  for (let i = 0, total_loops = 0; i + initial_length < max_new_passages && total_loops <= 2000; i++, total_loops++) {
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    if (!newUpcomingPassages.includes(randomPassage) && !recentPassages.includes(randomPassage)) {
      newUpcomingPassages.push(randomPassage);
    } else {
      i--;
    }
  }
  return newUpcomingPassages;
}

const orderPassages = async (passages, selectionStratedy, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog) => {
  const lgbm_scores = await call_lgbm(passages, user_intro_acc, user_intro_wpm);
  const { errorScores, passageToHighlightIndecies } = getErrorScores(passages, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct);

  const desire_for_passages = passages.map((passage, index) => getDesireForPassage(passage, quadgramFrequency, errorScores[index], lgbm_scores[index]));
  const result = passages.map((passage) => (
    {
      passage,
      source: currentSource,
      selectionStratedy: selectionStratedy,
      highlightIndecies: passageToHighlightIndecies[passage],
      desireForPassage: desire_for_passages[passage]
    })).sort((a, b) => - a.desireForPassage + b.desireForPassage);
  return result;
}

const handleGetNextPassagesErrorGroup = async (
  upcomingPassages,
  recentPassages,
  errorLog,
  seenLog,
  errorCount,
  user_intro_acc,
  user_intro_wpm,
  highlight_error_pct,
  selectionStratedy
) => {
  let correctSourceUpcomingPassages = [];
  if (upcomingPassages) {
    correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource && passage.selectionStratedy == selectionStratedy).map(passage => passage.passage);
  }

  // not yet initialised
  if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
    return;
  }

  let newUpcomingPassages = [...correctSourceUpcomingPassages];

  newUpcomingPassages = randomlySelectExtraPassages(500, newUpcomingPassages, recentPassages);
  newUpcomingPassages = topNBySelectionStrategy(newUpcomingPassages, selectionStratedy, 10);

  // hack in easy mode.
  if (selectionStratedy == "error-group->most_common") {
    newUpcomingPassages = newUpcomingPassages.map(makePassageEasy);
  }

  const result = await orderPassages(newUpcomingPassages, selectionStratedy, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog);

  let result_with_error_highlight_indecies = result.slice(0, 10);
  shortenPassageBasedOnStrategy(result_with_error_highlight_indecies, selectionStratedy);
  result_with_error_highlight_indecies = await add_error_highlight_from_strategy(result_with_error_highlight_indecies, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
  return result_with_error_highlight_indecies;
}

const handleGetNextPassagesWords = async (
  errorLog,
  seenLog,
  selectionStratedy
) => {
  const letter = selectionStratedy.split("->")[1];
  let passages = await create_passage_from_words(150, letter, 10);
  passages = passages.map(passage => ({
    passage,
    source: "words",
    selectionStratedy: selectionStratedy,
    highlightIndecies: [],
    desireForPassage: 0
  }));
  passages = await add_error_highlight_from_strategy(passages, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
  return passages;
}


const handleGetNextPassagesLetterFocused = async (
  upcomingPassages,
  recentPassages,
  errorLog,
  seenLog,
  errorCount,
  user_intro_acc,
  user_intro_wpm,
  highlight_error_pct,
  selectionStratedy
) => {
  let correctSourceUpcomingPassages = [];
  if (upcomingPassages) {
    console.log("upcomingPassages", upcomingPassages);
    correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource && passage.selectionStratedy == selectionStratedy).map(passage => passage.passage);
  }

  // not yet initialised
  if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
    return;
  }

  const letter = selectionStratedy.split("->")[1];
  let newUpcomingPassages = [...correctSourceUpcomingPassages];

  if (letter in HYPERPARAMS.HARDCODED_NUMBER_PASSAGES) {
    console.log("Using hardcoded number passages");
    newUpcomingPassages = samplePassages(newUpcomingPassages, HYPERPARAMS.HARDCODED_NUMBER_PASSAGES[letter], 10);
    let res = newUpcomingPassages.map(passage => ({
      passage,
      source: "hardcoded-letter",
      selectionStratedy: selectionStratedy,
      highlightIndecies: [],
      desireForPassage: 0
    }));
    res = await add_error_highlight_from_strategy(res, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
    return res;
  }

  newUpcomingPassages = randomlySelectExtraPassages(500, newUpcomingPassages, recentPassages);
  newUpcomingPassages = topNBySelectionStrategy(newUpcomingPassages, selectionStratedy, 10);

  const result = await orderPassages(newUpcomingPassages, selectionStratedy, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog);

  let result_with_error_highlight_indecies = result.slice(0, 10);
  shortenPassageBasedOnStrategy(result_with_error_highlight_indecies, selectionStratedy);
  result_with_error_highlight_indecies = await add_error_highlight_from_strategy(result_with_error_highlight_indecies, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
  console.log("result_with_error_highlight_indecies", result_with_error_highlight_indecies);
  return result_with_error_highlight_indecies;
}


const handleGetNextPassagesDefault = async (
  upcomingPassages,
  recentPassages,
  errorLog,
  seenLog,
  errorCount,
  user_intro_acc,
  user_intro_wpm,
  highlight_error_pct,
  finishedDefaultPassages,
  selectionStratedy
) => {
  let correctSourceUpcomingPassages = [];
  if (upcomingPassages) {
    console.log("upcomingPassages", upcomingPassages);
    correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource && passage.selectionStratedy == null).map(passage => passage.passage);
  }

  // not yet initialised
  if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
    return;
  }

  let newUpcomingPassages = [...correctSourceUpcomingPassages];
  if (!finishedDefaultPassages && currentSource == "wikipedia") {
    const potentialPassages = HYPERPARAMS.BEST_PASSAGES.filter(o => !upcomingPassages.includes(o.passage) && !recentPassages.includes(o.passage))
    const newPassages = samplePassages(newUpcomingPassages, potentialPassages, 10);
    newUpcomingPassages = newUpcomingPassages.concat(newPassages);
  }
  else {
    newUpcomingPassages = randomlySelectExtraPassages(100, newUpcomingPassages, recentPassages);
  }
  const result = await orderPassages(newUpcomingPassages, selectionStratedy, user_intro_acc, user_intro_wpm, errorCount, highlight_error_pct, seenLog, errorLog);


  let result_with_error_highlight_indecies = result.slice(0, 10);
  try {
    if (BETTER_ERROR_MODEL && HAS_SUCCEEDED_ONCE) {
      result_with_error_highlight_indecies = await add_error_highlight_indecies(result_with_error_highlight_indecies, highlight_error_pct, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
    }
  } catch (e) {
    console.error(e);
    BETTER_ERROR_MODEL = false;
  }
  HAS_SUCCEEDED_ONCE = true;
  return result_with_error_highlight_indecies;
}


self.onmessage = async function (e) {
  try {
    if (e.data.type === 'suggestStrategy') {
      console.log("suggestStrategy message received", e.data.strategyMode);
      if (e.data.strategyMode == "error-group") {
        const strategy = suggestErrorGroupStrategyFromInterstingErrors(e.data.interestingErrorLog, e.data.seenLog, e.data.previousRepSelectionStrategies)
        self.postMessage({ type: 'suggestStrategy', strategyMode: "error-group", strategy: strategy });
        return;
      }
      if (["words-speed", "many-rep-words-speed", "many-rep-letter-speed", "letter-speed"].includes(e.data.strategyMode)) {
        const [strategyChar, strategyLetter] = getLetterSpeedSuggestionFromSpeedLog(e.data.speedLog, e.data.previousRepSelectionStrategies, e.data.strategyMode);
        self.postMessage({ type: 'suggestStrategy', strategyMode: e.data.strategyMode, strategyChar: strategyChar, strategyLetter: strategyLetter });
        return;
      }
      if (["words-error", "many-rep-words-error", "many-rep-letter-error", "letter-error"].includes(e.data.strategyMode)) {
        const [strategyChar, strategyLetter] = getLetterErrorSuggestionFromErrorLog(e.data.interestingErrorLog["char"], e.data.seenLog["char"], e.data.previousRepSelectionStrategies, e.data.strategyMode);
        self.postMessage({ type: 'suggestStrategy', strategyMode: e.data.strategyMode, strategyChar: strategyChar, strategyLetter: strategyLetter });
        return;
      }
      return;
    }
    if (e.data.type === 'sourceChange') {
      sourceChange(e.data.source);
      return;
    }
    if (!is_initialised.value) {
      console.log("Not initialised");
      return;
    }
    if (e.data.type === 'get-next-passages') {
      if (e.data.selectionMode == "letter-speed") {
        const res = await handleGetNextPassagesLetterFocused(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
        self.postMessage({ res, type: 'get-next-passages', selectionMode: "letter-speed" });
        return;
      }
      if (e.data.selectionMode == "letter-error") {
        const res = await handleGetNextPassagesLetterFocused(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
        self.postMessage({ res, type: 'get-next-passages', selectionMode: "letter-error" });
        return;
      }

      if (e.data.selectionMode == "many-rep-letter-error") {
        const res = await handleGetNextPassagesLetterFocused(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
        self.postMessage({ res, type: 'get-next-passages', selectionMode: "many-rep-letter-error" });
        return;
      }

      if (e.data.selectionMode == "error-group") {
        const res = await handleGetNextPassagesErrorGroup(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
        self.postMessage({ res, type: 'get-next-passages', selectionMode: "error-group" });
        return;
      }

      if (["default", "default-with-speed-cursor-fast", "default-with-speed-cursor-slow"].includes(e.data.selectionMode)) {
        const res = await handleGetNextPassagesDefault(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.finishedDefaultPassages, e.data.selectionStratedy);
        self.postMessage({ res, type: 'get-next-passages', selectionMode: e.data.selectionMode });
        return;
      }

      if (["words-speed", "words-error", "many-rep-words-speed", "many-rep-words-error"].includes(e.data.selectionMode)) {
        const res = await handleGetNextPassagesWords(e.data.errorLog, e.data.seenLog, e.data.selectionStratedy);
        self.postMessage({ res, type: 'get-next-passages', selectionMode: "words" });
        return;
      }

      if (e.data.selectionMode == "many-rep-letter-speed") {
        const res = await handleGetNextPassagesLetterFocused(e.data.upcomingPassages, e.data.recentPassages, e.data.errorLog, e.data.seenLog, e.data.errorCount, e.data.user_intro_acc, e.data.user_intro_wpm, e.data.highlight_error_pct, e.data.selectionStratedy);
        self.postMessage({ res, type: 'get-next-passages', selectionMode: "many-rep-letter-speed" });
        return;
      }
    }

    console.error("No handler for type", e.data.type);
  }
  catch (err) {
    console.error(err);
    self.postMessage({ type: 'error', call_type: e.data.type, error: err });
  }
}; 