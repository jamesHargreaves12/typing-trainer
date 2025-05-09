importScripts("https://cdn.jsdelivr.net/pyodide/v0.27.4/full/pyodide.js");
let pyodide = undefined;

let currentSource = 'wikipedia';
let quadgramFrequency = {};
let defaultQuadgramErrorModel = {};
const source_passages = {}
// let passage_feats = {};
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
  await micropip.install('lightgbm');
  console.log("Pyodide and LightGBM loaded successfully");
  const lgbm_response = await fetch('https://jameshargreaves12.github.io/reference_data/lgbm_model.txt');
  const lgbm_model = await lgbm_response.text();
  await pyodide.FS.writeFile('model.txt', lgbm_model);
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
  console.log(data);
  // Save the model text to the Pyodide file system
  pyodide.FS.writeFile('input.json', JSON.stringify(data));
  
  // Load the model from the file system
  const res = await pyodide.runPythonAsync(`
    import lightgbm as lgb
    import json

    model = lgb.Booster(model_file='model.txt')
    inputs = json.load(open('input.json'))
    model_input = [[x.get(col,None) for col in model.feature_name()] for x in inputs]
    
    res = model.predict(model_input)
    res_list = [x[2]/(x[1]+x[0]) for x in res]
    res_list
  `);
  const result = res.toJs();
  return result;
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
  if (e.data.type === 'sourceChange') {
    currentSource = e.data.source;
    if (source_passages[currentSource]) {
      return;
    }
    fetch(source_paths[currentSource]).then(response => response.text()).then(text => source_passages[currentSource] = text.split("\n"))
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
  console.log(result);
  self.postMessage(result);
}; 