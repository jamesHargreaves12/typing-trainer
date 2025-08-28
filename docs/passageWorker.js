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
  'sherlock': 'https://jameshargreaves12.github.io/reference_data/sherlock_holmes.txt'
}

async function setup_pyodide() {
  pyodide = await loadPyodide();
  // Pyodide is now ready to use...

  await pyodide.loadPackage('micropip');
  const micropip = pyodide.pyimport("micropip");
  const [x, lgbm_response, error_model_response] = await Promise.all([
    micropip.install(['lightgbm', 'numpy']),
    fetch('https://jameshargreaves12.github.io/reference_data/lgbm_model_2.txt'),
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
  } else {
    // features["word_many_to_end_max"] = undefined;
    // features["word_many_to_end_min"] = undefined;
    features["word_zero_to_end_mean"] = undefined;
    features["word_one_to_end_mean"] = undefined;
    features["word_many_to_end_mean"] = undefined;
    // features["word_many_to_end_count_positive"] = undefined;
    // features["word_many_to_end_count_negative"] = undefined;
  }
  // const utcNow = new Date();
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

const cartesianProduct = (a, b) => {
  return [].concat(...a.map(x => b.map(y => [x, y])));
}


const UNIGRAM_STD = {
  'm': 0.035250909191469115,
  'f': 0.03695542239285691,
  '?': 0.0936364685537428,
  'L': 0.07772211558675739,
  ')': 0.10977908932471044,
  'C': 0.07377953466245117,
  'l': 0.03021346633635183,
  'B': 0.06640424235737112,
  ';': 0.20817240351506988,
  'u': 0.038937114367984554,
  'Y': 0.16595312797438103,
  'n': 0.030484792139803818,
  '3': 0.06884811761995714,
  'E': 0.07729793358206127,
  'p': 0.03842193678749636,
  '9': 0.06462195791539867,
  'M': 0.063368768821528,
  'z': 0.0964913325198731,
  '4': 0.0805880804677427,
  'o': 0.03434061090166928,
  'O': 0.07723182439532356,
  'v': 0.058299615501815706,
  'b': 0.042218762041903606,
  '7': 0.08912325313725529,
  'a': 0.02702475055506549,
  '1': 0.04150421558012398,
  'D': 0.0699996699233979,
  '.': 0.09815703580521853,
  'e': 0.028127670146057153,
  'y': 0.0493668759421138,
  '"': 0.13915426821811414,
  'G': 0.0821046817438331,
  'W': 0.13702040110284322,
  'K': 0.08773764653996162,
  'X': 0.07203267889076902,
  '-': 0.12501072683212905,
  '2': 0.052224500876861424,
  'r': 0.034731680713281664,
  'N': 0.06871926110003576,
  'F': 0.07379872463607537,
  "'": 0.17001506148419257,
  'Q': 0.08579187525673862,
  'd': 0.03948711024960669,
  '5': 0.07175866045059018,
  'R': 0.08427430182569198,
  'H': 0.06435035895869423,
  's': 0.031318665799798806,
  'T': 0.0644400469326798,
  '0': 0.05847984327960287,
  'q': 0.06708271250979798,
  'x': 0.08876097515696056,
  'g': 0.04089215210121809,
  'j': 0.09662766774549124,
  '(': 0.08230213031788058,
  'I': 0.06537827525363547,
  'k': 0.05171203746242511,
  'i': 0.03278154954078478,
  'c': 0.03641026236032212,
  'P': 0.07768482941035788,
  ',': 0.12739553771065584,
  ' ': 0.02123139512120665,
  'h': 0.030405706780887293,
  'V': 0.09692033026314154,
  '6': 0.1043364311329082,
  'w': 0.040539342694805074,
  'U': 0.06468621228143943,
  't': 0.030104127538495326,
  'A': 0.06268830214753172,
  'Z': 0.09212544383812245,
  ':': 0.15782421497473512,
  '!': 0.20698825363136056,
  '%': 0.08984992257545195,
  'S': 0.07299977706942225,
  '8': 0.07942753154417806,
  'J': 0.09051758104455739
}

const UNIGRAM_MEAN_ERROR_RATE = {
  ' ': 0.04494756056197226,
  '0': 0.06949357711973116,
  'e': 0.07121088290787903,
  'a': 0.07240791486176659,
  'h': 0.07250551909598359,
  '1': 0.07251969869666484,
  'l': 0.07610229636211416,
  't': 0.0764293706619892,
  'n': 0.07662865081890807,
  's': 0.08128601074074474,
  'm': 0.08154831691285441,
  '9': 0.08201504298323402,
  '2': 0.08227111987983293,
  'o': 0.08310732154609433,
  'f': 0.08390191857095694,
  'r': 0.08431221265661083,
  'i': 0.08458058869682056,
  'p': 0.0858016881822663,
  'w': 0.08882508276787156,
  'c': 0.0914569706287151,
  'b': 0.09192249691673522,
  '7': 0.09252556686849553,
  'u': 0.09283717236612894,
  'd': 0.09318718800765248,
  '5': 0.09605206513206209,
  'g': 0.09753288630724552,
  '4': 0.09895124315258705,
  'k': 0.10059635653086178,
  '8': 0.10178416013925153,
  '3': 0.10332686413625614,
  '6': 0.10434379859066398,
  'y': 0.1044824949769741,
  'q': 0.1103108800766673,
  'H': 0.11701539865952387,
  'v': 0.1198491610847135,
  'U': 0.1204879523676621,
  'N': 0.12067344536354514,
  'M': 0.12312228655675034,
  'F': 0.12397431436434378,
  'A': 0.12437056446290508,
  'B': 0.12523831163065222,
  'D': 0.12688199203663944,
  '(': 0.12841006243685069,
  'C': 0.12872282364645007,
  'I': 0.1290493611155294,
  '%': 0.12988333038713099,
  'R': 0.1303762741351494,
  'T': 0.13062808856883526,
  'G': 0.13857991959947716,
  'X': 0.13969120191667775,
  'P': 0.14006869095259705,
  'O': 0.14050050237166156,
  'L': 0.1406750717581659,
  'E': 0.14087242146708892,
  'S': 0.1415333394440617,
  'Q': 0.14227272727272727,
  'j': 0.14889501250068435,
  'x': 0.14932922200765367,
  'V': 0.14954651316910608,
  'K': 0.15156585474198564,
  '!': 0.1575880415505447,
  'Z': 0.15959913864502237,
  '?': 0.1610873960907661,
  'J': 0.16177686184366968,
  'z': 0.17351851338489543,
  ')': 0.1845214166223594,
  '.': 0.20406353413867082,
  '"': 0.2269214895710975,
  'W': 0.241879435892709,
  ',': 0.2594410613134759,
  '-': 0.26148812587309755,
  'Y': 0.2768391198569835,
  ':': 0.2976530921988082,
  "'": 0.30947778643803586,
  ';': 0.3569477154969383,
  '_': 0.3695652173913043
};

const LETTER_SPEED_STD = {
  "h": 0.08527910052546951,
  "e": 0.09341712766378299,
  "n": 0.1005098583243086,
  "a": 0.10113049620128993,
  " ": 0.10179156532873941,
  "l": 0.10257678569991069,
  "s": 0.107387680553308,
  "o": 0.10853041234318929,
  "r": 0.10943969813584854,
  "i": 0.11195010893323416,
  "k": 0.1153050021105183,
  "d": 0.11818166955884758,
  "B": 0.11882183647359865,
  "u": 0.12009248106637008,
  "m": 0.12064728029136529,
  "y": 0.12336068498563145,
  "0": 0.12826696859391173,
  "f": 0.13034132671432883,
  "g": 0.13272920920662315,
  "5": 0.13393690053870044,
  "t": 0.13429044369935214,
  "P": 0.1363679700007288,
  "x": 0.14224431134265747,
  "v": 0.14299703324992194,
  "c": 0.143060220536856,
  "M": 0.1444421048825252,
  "9": 0.14453224541137455,
  "p": 0.1493027745756534,
  "I": 0.1551280498184238,
  "w": 0.15719668693184688,
  "H": 0.1578966286403463,
  "W": 0.16433684837835733,
  "1": 0.17065633842332703,
  "b": 0.17076630617286606,
  "%": 0.17849981315216754,
  "'": 0.1815263255355476,
  '"': 0.18332252315609673,
  ")": 0.18528758300952888,
  "F": 0.19006271371835046,
  "T": 0.19083854298213374,
  "-": 0.1931523409343729,
  "A": 0.1931904142110019,
  ",": 0.196862083857489,
  ".": 0.20046723233648747,
  "2": 0.20138000938311118,
  "(": 0.20333070054177463,
  "S": 0.22465418827791378,
  "C": 0.22762325373937833,
  "j": 0.12264072603579045,
  "4": 0.155754492470085,
  "D": 0.17303295919297804,
  "z": 0.12264072603579045,
  "E": 0.17303295919297804,
  "q": 0.12264072603579045,
  ";": 0.1903060753154331,
  "6": 0.155754492470085,
  "L": 0.17303295919297804,
  "R": 0.17303295919297804,
  "V": 0.17303295919297804,
  "G": 0.17303295919297804,
  "Y": 0.17303295919297804,
  "8": 0.155754492470085,
  "J": 0.17303295919297804,
  "N": 0.17303295919297804,
  "O": 0.17303295919297804,
  "7": 0.155754492470085,
  "3": 0.155754492470085,
  "U": 0.17303295919297804,
  "K": 0.17303295919297804,
  ":": 0.1903060753154331,
  "Q": 0.17303295919297804,
  "Z": 0.17303295919297804,
  "?": 0.1903060753154331,
  "X": 0.17303295919297804,
  "!": 0.1903060753154331,
}

const LETTER_SPEED_MEAN = {
  "e": 0.2511311646984058,
  "h": 0.25939754671160303,
  "n": 0.2691648401564615,
  "a": 0.2786946399749476,
  " ": 0.27985219578414333,
  "o": 0.28486122932431457,
  "r": 0.2924755282090619,
  "i": 0.29851610915203824,
  "l": 0.3039834515914638,
  "s": 0.30885313751853116,
  "u": 0.3178507222215826,
  "k": 0.32126980995592386,
  "0": 0.3220502633421425,
  "m": 0.33036058760485904,
  "d": 0.33726824468863814,
  "t": 0.34041939372123814,
  "g": 0.35548836789223437,
  "y": 0.3602838520615609,
  "f": 0.3646398947657114,
  "c": 0.381477849205429,
  "v": 0.3879135052710464,
  "p": 0.3901701129428811,
  "w": 0.4054751287244022,
  "j": 0.4418349878305432,
  "b": 0.44520980409843963,
  "x": 0.44825493512483783,
  "9": 0.522965520255203,
  "z": 0.5283738271298044,
  "q": 0.5373574078768408,
  "7": 0.561667857475688,
  "8": 0.5635226537216692,
  ",": 0.5648866505840043,
  "P": 0.568031105358122,
  "M": 0.5710681860008521,
  "1": 0.5777886164194658,
  "2": 0.5793671111744868,
  "N": 0.5888517546861324,
  "L": 0.5901164386101535,
  "O": 0.5916425742574241,
  "I": 0.593990937430794,
  ".": 0.5991289477999734,
  "A": 0.6099093368428643,
  "5": 0.622882510277865,
  "S": 0.6245810770477099,
  "U": 0.6256289876648216,
  "4": 0.6305142499403701,
  "K": 0.6307633587786262,
  "3": 0.6413713734206828,
  "6": 0.6438038557725649,
  "H": 0.6439057239057242,
  "T": 0.6443014923335902,
  "C": 0.644380148650229,
  "-": 0.6500483305294895,
  "B": 0.6507231328730325,
  "R": 0.6527978519098087,
  "D": 0.6539747195658596,
  "J": 0.6596191110883272,
  "E": 0.6629458874973244,
  "Y": 0.6708200258955554,
  "F": 0.6724143670138454,
  "V": 0.6835295197869788,
  "—": 0.6839999999999999,
  "G": 0.6922065745520801,
  "'": 0.699440891023178,
  "W": 0.714028908794785,
  "X": 0.7323891371605381,
  "_": 0.7583561643835611,
  "?": 0.7776311844077965,
  "!": 0.7856172653184423,
  "Q": 0.790721558211598,
  "Z": 0.7954545454545463,
  ")": 0.8142289128935858,
  "(": 0.8170971355123008,
  ":": 0.818851181102361,
  ";": 0.8345761245674757,
  '"': 0.8377289103073918,
  "%": 0.8674524714828853,
}
const LETTER_CHANGABILITY_PER_OCCURENCE_M = {
  "a": 14.187655656326152,
  "_": 12.896929499116526,
  "h": 11.294291474951597,
  "k": 11.070603703578605,
  "i": 10.282764308231432,
  "y": 8.73580026798989,
  "r": 8.51327843090219,
  "d": 8.132273264436389,
  "c": 8.026167568307926,
  "g": 8.008112807394049,
  "m": 7.672499090271686,
  "u": 7.563671367357598,
  "p": 7.523416260847157,
  "e": 7.427616718359616,
  "n": 6.114238758868869,
  "0": 6.037148912826794,
  "s": 5.670450981676915,
  "I": 5.590108274038296,
  "t": 5.473873231279184,
  "x": 4.374710674767829,
  "N": 4.353742955811747,
  "l": 4.086146421496499,
  "b": 4.047483266151356,
  "1": 3.9818381258255457,
  "P": 3.586031142426755,
  ".": 3.440055833743398,
  "o": 3.1066183351815257,
  "5": 2.9581210154513924,
  "q": 2.7560315737639116,
  "w": 2.6220690313311468,
  "f": 2.6106604391310406,
  "M": 2.5791374183101907,
  "7": 2.5312021347269384,
  "v": 2.487126313248461,
  "-": 2.217285306528848,
  "9": 2.1110024387885424,
  " ": 0.948298037039152,
  "'": 0.948298037039152,
  ")": 0.948298037039152,
  "(": 0.948298037039152,
  "W": 0.948298037039152,
  "G": 0.948298037039152,
  '"': 0.948298037039152,
  ":": 0.948298037039152,
  "K": 0.948298037039152,
  "V": 0.948298037039152,
  "Y": 0.948298037039152,
  ";": 0.948298037039152,
  "Z": 0.948298037039152,
  "Q": 0.948298037039152,
  "?": 0.948298037039152,
  "X": 0.948298037039152,
  "!": 0.948298037039152,
  "R": 0.874554746523508,
  "2": 0.5947661651227405,
  "O": 0.08579012959424064,
  ",": 0,
  "T": 0,
  "S": 0,
  "C": 0,
  "A": 0,
  "B": 0,
  "H": 0,
  "D": 0,
  "F": 0,
  "L": 0,
  "8": 0,
  "U": 0,
  "3": 0,
  "E": 0,
  "J": 0,
  "6": 0,
  "4": 0,
  "z": 0,
  "j": 0,
}

const LETTER_CHANGABILITY_PER_OCCURENCE_C = {
  "6": -6.981085309964023,
  "O": -7.2517694732155595,
  "J": -7.541887398673,
  "4": -7.574360153005463,
  "L": -7.687053972904508,
  "8": -7.695565975684325,
  "F": -7.709638135693311,
  "R": -7.80331651968226,
  "2": -7.809103964625912,
  "j": -7.814548737844509,
  "D": -7.829295924419092,
  "E": -7.878338365542895,
  "B": -7.901553199507989,
  "z": -7.983958911193294,
  "U": -8.110350046433952,
  "H": -8.130365027833145,
  "7": -8.257597237279871,
  "3": -8.286423570189656,
  "A": -8.421090155136227,
  " ": -8.543062640397748,
  "'": -8.543062640397748,
  ")": -8.543062640397748,
  "(": -8.543062640397748,
  "W": -8.543062640397748,
  "G": -8.543062640397748,
  '"': -8.543062640397748,
  ":": -8.543062640397748,
  "K": -8.543062640397748,
  "V": -8.543062640397748,
  "Y": -8.543062640397748,
  ";": -8.543062640397748,
  "Z": -8.543062640397748,
  "Q": -8.543062640397748,
  "?": -8.543062640397748,
  "X": -8.543062640397748,
  "!": -8.543062640397748,
  "C": -8.590210143402503,
  "-": -8.63963521379376,
  "S": -8.758116825564938,
  "9": -9.154132328261422,
  "5": -9.211166565669885,
  "q": -9.226678109366174,
  "M": -9.408886550739473,
  "P": -9.418229352993976,
  "T": -9.454370429016015,
  "1": -9.602946051903455,
  "x": -10.146774161448343,
  "N": -10.314598878749198,
  ",": -10.447946371919187,
  "0": -10.953793214722593,
  "v": -11.247338515712523,
  ".": -11.527262548208508,
  "I": -11.566057127651442,
  "b": -11.798981606736888,
  "w": -12.009448816585966,
  "f": -12.124063410382329,
  "k": -13.068970020909534,
  "l": -13.28796528364296,
  "p": -13.446397984814311,
  "u": -13.571311850164117,
  "y": -13.585920518209932,
  "m": -13.63731249546063,
  "g": -13.705078650085795,
  "t": -14.089627100908753,
  "d": -14.130204415720145,
  "s": -14.198541987403235,
  "o": -14.21881925391331,
  "h": -14.333290450213328,
  "n": -14.48669659369837,
  "c": -14.505990436215606,
  "i": -14.982290383316432,
  "r": -15.03945828923975,
  "e": -15.340101052305787,
  "_": -16.148018304213107,
  "a": -16.460183896956682,
}

const LETTER_FREQUENCY = {
  "A": 0.003153352805124311,
  "n": 0.055725109439303484,
  "a": 0.06574879237610978,
  "r": 0.04895343918863251,
  "c": 0.02368663480872584,
  "h": 0.03440809510193862,
  "i": 0.05736555569780318,
  "s": 0.05098628684359351,
  "t": 0.06283249477699976,
  " ": 0.16126223748404583,
  "v": 0.00792397035237102,
  "e": 0.09536583341888472,
  "f": 0.015292696431959359,
  "d": 0.030829563440896025,
  "u": 0.020792086046599403,
  "g": 0.013797676968572934,
  "o": 0.0567961830999978,
  "l": 0.03205162970570526,
  "y": 0.01153414941517434,
  ".": 0.010558070614780313,
  "2": 0.0032394917857312498,
  "0": 0.003898399323498048,
  "m": 0.017988761235399744,
  "k": 0.005075728496221641,
  "w": 0.011476864805862281,
  "p": 0.015483219067633279,
  "b": 0.01152292290241313,
  ",": 0.00878202900526206,
  "T": 0.004579806176913074,
  "j": 0.0007302944339057933,
  "9": 0.0022726125692146813,
  "4": 0.0009719173180840281,
  "D": 0.0015318912844709844,
  "z": 0.0007556475358099878,
  "W": 0.0013337568162347675,
  "E": 0.001062871629027983,
  "I": 0.002681382154161148,
  "x": 0.0012442623801334335,
  "S": 0.003723010665829977,
  "H": 0.0018290195012505923,
  "C": 0.0033144800536579863,
  "(": 0.0017254667539418384,
  ")": 0.001725539082263411,
  "q": 0.0009409735262355593,
  ";": 0.00013218839775919848,
  "-": 0.0016721602023162718,
  "6": 0.0009902592018082627,
  "M": 0.0022375125026953655,
  "5": 0.0010397612837191113,
  "1": 0.004230895510900077,
  "L": 0.0012864755031094834,
  "R": 0.0014376283867850131,
  "F": 0.0013433822692696467,
  "V": 0.000527198242809697,
  "G": 0.0011281308697633483,
  "B": 0.001900767460370877,
  "Y": 0.00029471823710480933,
  '"': 0.0010622791154176604,
  "'": 0.0017780592803768405,
  "8": 0.0012323368864725459,
  "J": 0.0010586430260355636,
  "N": 0.0013529180351857762,
  "O": 0.0010358590261136272,
  "7": 0.000974268856474996,
  "3": 0.0010637262604756847,
  "U": 0.0011245786812342758,
  "P": 0.0021464748695249588,
  "K": 0.0007279492604071239,
  ":": 0.0008468361905158379,
  "Q": 0.00010038303094415696,
  "Z": 0.00012192356236161744,
  "?": 9.530037513060838e-05,
  "X": 8.027517892040621e-05,
  "!": 2.290377562246053e-05,
}

const LOGICAL_GROUP_MEAN_RATE = {
  // 'letter': 0.04710802768380675,
  'most_common': 0.041260398079809635,
  'punc': 0.18711053231320202,
  'caps': 0.12161804263744862,
  'rare_letters': 0.08231099677630574,
  'home_row': 0.04576929812980636,
  'top_row': 0.044401965838177605,
  'bottom_row': 0.04979522680487063,
  'pinky': 0.04140048798184624,
  'ring_pinky': 0.04523392537996314,
  'left_hand': 0.04445073592632017,
  'right_hand': 0.04647772721288048,
  'numbers': 0.05386455286782549,
  'difficult_to_reach_letters': 0.04875121193663178,
  'repeat_bigrams': 0.035775673887106986,
  'left_hand_only_bigrams': 0.0418817932429474,
  'right_hand_only_bigrams': 0.04383438368975369,
  'alternate_hand_bigrams': 0.04448195838451243,
  'same_finger_bigrams': 0.04623873648631485,
}

const LOGICAL_GROUP_STD = {
  'most_common': 0.01639303445611817,
  'punc': 0.08841770875084964,
  'caps': 0.09519842977687655,
  'rare_letters': 0.06217410797883992,
  'home_row': 0.020966102046362713,
  'top_row': 0.019219644905343614,
  'bottom_row': 0.029682578382485014,
  'pinky': 0.01902749693676818,
  'ring_pinky': 0.018667357320133776,
  'left_hand': 0.019154535514629794,
  'right_hand': 0.02125073258228291,
  'numbers': 0.07048656739530676,
  'difficult_to_reach_letters': 0.02334849840266474,
  'repeat_bigrams': 0.041210852946057,
  'left_hand_only_bigrams': 0.048671588269197506,
  'right_hand_only_bigrams': 0.04564314158407204,
  'alternate_hand_bigrams': 0.05088463529526922,
  'same_finger_bigrams': 0.0464073391172582,
}

const LOGICAL_GROUP_FREQUENCY = {
  'most_common': 0.49377369484,
  'punc': 0.02689224985046569,
  'caps': 0.031072374604802187,
  // 'lower':                      0.7750833119712894,
  'rare_letters': 0.01589677860377681,
  'home_row': 0.20841835426813637,
  'top_row': 0.3909493292318209,
  'bottom_row': 0.12504486029223277,
  'pinky': 0.08613517901392806,
  'ring_pinky': 0.24499017345979662,
  'left_hand': 0.44476459027599763,
  'right_hand': 0.31931299666752117,
  'numbers': 0.010400751943945998,
  'difficult_to_reach_letters': 0.09004870546013842,
  'repeat_bigrams': 0.014840092600531596,
  'left_hand_only_bigrams': 0.1825327960216068,
  'right_hand_only_bigrams': 0.10707365171911172,
  'alternate_hand_bigrams': 0.31248906799279774,
  'same_finger_bigrams': 0.045806396295978734
}

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
    const priorStd = LETTER_SPEED_STD[letter];
    const priorMean = LETTER_SPEED_MEAN[letter];
    const priorVar = priorStd ** 2;
  
    const speeds = speedLog["char"][letter] || [];
    const N = speeds.length;
    if (N == 0) {
      timeToTypeLetter[letter] = priorMean;
    }
    else{
      const sampleMeanTimesN = speeds.reduce((a, b) => a + b, 0);
      const posteriorVar = 1 / (1 / priorVar + N / priorVar);
      const posteriorMean = posteriorVar * (priorMean / priorVar + sampleMeanTimesN / priorVar);
      timeToTypeLetter[letter] = posteriorMean;
    }
  }
  return timeToTypeLetter;
}

const computerSpeedChangePerRepEstimate = (timeToTypeLetter) => {
  const typeSpeedChangePerRep = {}
  for (let letter in timeToTypeLetter) {
    const tttLetter = timeToTypeLetter[letter];
    const changabilityPerOccurence = -Math.exp((LETTER_CHANGABILITY_PER_OCCURENCE_M[letter] * tttLetter + LETTER_CHANGABILITY_PER_OCCURENCE_C[letter]));
    typeSpeedChangePerRep[letter] = changabilityPerOccurence;
  }
  return typeSpeedChangePerRep;
}

const computerValuePerRepEstimate = (speedLog) => {
  const timeToTypeLetter = getBestGuessTimeToTypeLetter(speedLog);
  const typeSpeedChangePerRep = computerSpeedChangePerRepEstimate(timeToTypeLetter);

  const valuePerRep = {}
  for (let letter in typeSpeedChangePerRep) {
    const tscpr = typeSpeedChangePerRep[letter];
    const freq = LETTER_FREQUENCY[letter];
    const timePerLetter = timeToTypeLetter[letter];
    const val = - (timePerLetter * tscpr * freq);  // negative so that the values is positive (tspcr is reduction in time)
    valuePerRep[letter] = Math.min(val, 0.0000005);
  }
  return valuePerRep;
}

const isStringNumber = (str) => {
  return !isNaN(parseInt(str));
}
const getLetterSpeedSuggestionFromSpeedLog = (speedLog, previousSpeedSelectionStrategies) => {
  const valuePerRep = computerValuePerRepEstimate(speedLog);
  const wasLastNumber = previousSpeedSelectionStrategies.length == 0 ? false : isStringNumber(previousSpeedSelectionStrategies[previousSpeedSelectionStrategies.length - 1]);
  const top12 = Object.entries(valuePerRep).filter(([letter, value]) => !previousSpeedSelectionStrategies.includes(letter) && !(wasLastNumber && isStringNumber(letter)) && letter != " ").sort((a, b) => b[1] - a[1]).slice(0, 12);
  console.log("top12", top12);
  const totalValue = top12.reduce((a, b) => a + b[1], 0);
  const loc = Math.random() * totalValue;
  let cumSum = 0;
  for (let [letter, value] of top12) {
    cumSum += value;
    if (cumSum > loc) {
      return letter;
    }
  }
  return 'e';
}
const suggestStrategyFromSpeedLog = (speedLog, previousSpeedSelectionStrategies) => {
  const letterSpeedSuggestion = getLetterSpeedSuggestionFromSpeedLog(speedLog, previousSpeedSelectionStrategies);
  console.log("letterSpeedSuggestion", letterSpeedSuggestion);
  return letterSpeedSuggestion;
}

const suggestStrategyFromInterstingErrors = (interestingErrorLog, seenLog, previousSelectionStrategies,speedLog) => {
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
  let previousSelectedStrategy = previousSelectionStrategies[previousSelectionStrategies.length - 1];
  let tmp = []
  for (let group in groupErrorCount) {
    const errorCount = groupErrorCount[group] || 0;
    const seenCount = groupSeenCount[group] || 0;
    const meanRate = LOGICAL_GROUP_MEAN_RATE[group];
    const std = LOGICAL_GROUP_STD[group];
    const errorRate = findMAP(meanRate, std, errorCount, seenCount);
    const cost = errorRate * LOGICAL_GROUP_FREQUENCY[group];
    tmp.push([cost, group, LOGICAL_GROUP_FREQUENCY[group], errorRate]);
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
  return maxCostGroup;
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
    // Newton step on –(prior+lik)
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
      UNIGRAM_MEAN_ERROR_RATE[letter],
      UNIGRAM_STD[letter],
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

const [CNN_WEIGHT, UNIGRAM_WEIGHT, BIAS] = [0.6850118774971654 * 3, 0.645296487587596, -0.014092068726190543 * 0] // * are basic fudge factors from me. TODO come up with a better method e.g.  it should be waited by reps complete

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
    const d_score = (defaultQuadgramErrorModel["seen_preds"][quadgram] || defaultQuadgramErrorModel["default"])

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

  if (selectionStratedy.startsWith("speed")) {
    const letterSpeedSuggestion = selectionStratedy.split("->")[1]
    return passage.split('').map((char, index) =>  letterSpeedSuggestion == char ? index : null).filter(index => index !== null).length / passage.length;
  }

  if (selectionStratedy == "most_common") {
    return (passage.split('').filter(char => LOGICAL_LETTER_GROUPINGS["most_common"].includes(char)).length - passage.split('').filter(char => LOGICAL_LETTER_GROUPINGS["punc"].includes(char)).length) / passage.length;
  }

  if (selectionStratedy in LOGICAL_LETTER_GROUPINGS) {
    const letters = LOGICAL_LETTER_GROUPINGS[selectionStratedy];
    return passage.split('').filter(char => letters.includes(char)).length / passage.length;
  }
  if (selectionStratedy in LOGICAL_BIGRAM_GROUPINGS) {
    const bigrams = LOGICAL_BIGRAM_GROUPINGS[selectionStratedy];
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

// Example
console.log(simplifySentence("Let's meet on August 14, 2025 at NASA HQ. Bring 1,234 documents."));


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
  if (!strategy || !strategy.startsWith("speed")) {
    return;
  }
  console.log("shortenPassageBasedOnStrategy", strategy, passages[0].passage);
  for (let i = 0; i < 1; i++) {
    const passage = passages[i].passage;
    let sentences = passage.split(".").map(sentence => sentence);
    const skip_indexs = [];
    for (let j = 0; j < sentences.length; j++) {
      const sentence = sentences[j];
      if (strategy.startsWith("speed")) {
        const letterSpeedSuggestion = strategy.split("->")[1]
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
  if (strategy.startsWith("speed")) {
    const letterSpeedSuggestion = strategy.split("->")[1]
    const letterSpeedSuggestionIdxs = firstPassage.split('').map((char, index) =>  letterSpeedSuggestion == char ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = letterSpeedSuggestionIdxs;
  }
  else if (strategy == "most_common") {
    const mostCommonLetterIdxs = firstPassage.split('').map((char, index) =>  LOGICAL_LETTER_GROUPINGS["most_common"].includes(char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = mostCommonLetterIdxs;
  }
  else if (strategy in LOGICAL_LETTER_GROUPINGS) {
    const letters = LOGICAL_LETTER_GROUPINGS[strategy];
    const letterIdxs = firstPassage.split('').map((char, index) =>  letters.includes(char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = letterIdxs;
  }
  else if (strategy in LOGICAL_BIGRAM_GROUPINGS) {
    const bigrams = LOGICAL_BIGRAM_GROUPINGS[strategy];
    const bigramIdxs = firstPassage.split('').map((char, index) =>  bigrams.includes(char + getOrPad(firstPassage, index + 1)) || bigrams.includes(getOrPad(firstPassage, index) + char) ? index : null).filter(index => index !== null);
    strategyHighlightIndecies = bigramIdxs; 
  }
  console.log("strategyHighlightIndecies", strategyHighlightIndecies, strategy);
  if (strategyHighlightIndecies.length > firstPassage.length*0.25 && HAS_SUCCEEDED_ONCE && BETTER_ERROR_MODEL) {
    const errorModelHighlightIndecies = await compute_error_highlight_indecies(firstPassage, 0.25, unigramErrorLog, unigramSeenLog);
    const intersection = strategyHighlightIndecies.filter(index => errorModelHighlightIndecies.includes(index));
    strategyHighlightIndecies = intersection;
  }

  passages[0].highlightIndecies = strategyHighlightIndecies;

  // Not handling easy_mode I think this is dead?
  return passages;
}

self.onmessage = async function (e) {
  try {
    if (e.data.type === 'suggestStrategyFromInterstingErrors') {
      const strategy = suggestStrategyFromInterstingErrors(e.data.interestingErrorLog, e.data.seenLog, e.data.previousSelectionStrategies, e.data.speedLog);
      self.postMessage({ type: 'suggestStrategyFromInterstingErrors', strategy: strategy });
      return;
    }
    if (e.data.type === 'suggestStrategyFromSpeedLog') {
      const strategy = suggestStrategyFromSpeedLog(e.data.speedLog, e.data.previousSpeedSelectionStrategies);
      self.postMessage({ type: 'suggestStrategyFromSpeedLog', strategy: strategy });
      return;
    }
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
      highlight_error_pct,
      selectionStratedy
    } = e.data;
    let correctSourceUpcomingPassages = [];
    if (upcomingPassages) {
      correctSourceUpcomingPassages = upcomingPassages.filter(passage => passage.source == currentSource && passage.selectionStratedy == selectionStratedy).map(passage => passage.passage);
    }

    // not yet initialised
    if (!source_passages[currentSource] || source_passages[currentSource].length == 0 || Object.keys(quadgramFrequency).length == 0 || Object.keys(defaultQuadgramErrorModel).length == 0) {
      return;
    }

    const passages = source_passages[currentSource];

    let newUpcomingPassages = [...correctSourceUpcomingPassages];

    const max_new_passages = selectionStratedy ? 500 : 100;
    for (let i = 0; i < max_new_passages; i++) {
      const randomPassage = passages[Math.floor(Math.random() * passages.length)];
      if (!newUpcomingPassages.includes(randomPassage) && !recentPassages.includes(randomPassage)) {
        newUpcomingPassages.push(randomPassage);
      } else {
        i--;
      }
    }

    newUpcomingPassages = topNBySelectionStrategy(newUpcomingPassages, selectionStratedy, 10);
    // hack in easy mode.
    if (selectionStratedy == "most_common") {
      newUpcomingPassages = newUpcomingPassages.map(makePassageEasy);
    }

    const lgbm_scores = await call_lgbm(newUpcomingPassages, user_intro_acc, user_intro_wpm);
    const { errorScores, passageToHighlightIndecies } = getErrorScores(newUpcomingPassages, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, highlight_error_pct);

    const desire_for_passages = newUpcomingPassages.map((passage, index) => getDesireForPassage(passage, quadgramFrequency, errorScores[index], lgbm_scores[index]));
    const result = newUpcomingPassages.map((passage) => (
      {
        passage,
        source: currentSource,
        selectionStratedy: selectionStratedy,
        highlightIndecies: passageToHighlightIndecies[passage],
        desireForPassage: desire_for_passages[passage]
      })).sort((a, b) => - a.desireForPassage + b.desireForPassage).slice(0, 10);

    let result_with_error_highlight_indecies = result;
    try {
      if (selectionStratedy)
      {
        shortenPassageBasedOnStrategy(result, selectionStratedy);
        result_with_error_highlight_indecies = await add_error_highlight_from_strategy(result, selectionStratedy, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
      }
      else if (BETTER_ERROR_MODEL && HAS_SUCCEEDED_ONCE) {
        result_with_error_highlight_indecies = await add_error_highlight_indecies(result, highlight_error_pct, unigramErrorLog = errorLog["char"], unigramSeenLog = seenLog["char"]);
      }
    } catch (e) {
      console.error(e);
      BETTER_ERROR_MODEL = false;
    }
    HAS_SUCCEEDED_ONCE = true;
    self.postMessage(result_with_error_highlight_indecies);
  } catch (e) {
    console.error(e);
    self.postMessage({ type: 'error', error: e });
  }
}; 