let passages = [];
let quadgramFrequency = {};
let defaultQuadgramErrorModel = {};

fetch('https://jameshargreaves12.github.io/reference_data/cleaned_wikipedia_articles.txt')
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.text();
})
.then(text => {
  passages = text.split("\n");
  const arrFreqAndFileName = [[quadgramFrequency, 'quadgrams_2'], [defaultQuadgramErrorModel, 'quadgram_error_model']];
  return Promise.all(arrFreqAndFileName.map(([freq, fileName]) => 
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
  ));
})
.then(() => {
  console.log("Initialised passage worker");
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



function getErrorScore(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount) {
    let defualtModelScore = 0;
    let personaModalScore = 0;
    let charWeight = Object.keys(seenLog['char']).length ** 2  / 75;
    let bigramWeight = Object.keys(seenLog['bigram']).length ** 2 / (75*75);
    let trigramWeight = Object.keys(seenLog['trigram']).length ** 2 / (75*75*75);
    let quadgramWeight = Object.keys(seenLog['quadgram']).length ** 2 / (75*75*75*75);
    let totalWeight = charWeight + bigramWeight + trigramWeight + quadgramWeight;
    charWeight /= totalWeight;
    bigramWeight /= totalWeight;
    trigramWeight /= totalWeight;
    quadgramWeight /= totalWeight;

    for(let i = 0; i < passage.length; i++) {
      const char = getOrPad(passage, i);
      const bigram = getOrPad(passage, i+1) + char;
      const trigram = getOrPad(passage, i+2) + bigram;
      const quadgram = getOrPad(passage, i+3) + trigram;

      defualtModelScore += (defaultQuadgramErrorModel["seen_preds"][quadgram] || defaultQuadgramErrorModel["default"]);
      const personalCharScore = (errorLog['char'][char] || 0) / (seenLog['char'][char] || 1);
      const personalBigramScore = (errorLog['bigram'][bigram] || 0) / (seenLog['bigram'][bigram] || 1);
      const personalTrigramScore = (errorLog['trigram'][trigram] || 0) / (seenLog['trigram'][trigram] || 1);
      const personalQuadgramScore = (errorLog['quadgram'][quadgram] || 0) / (seenLog['quadgram'][quadgram] || 1);

      personaModalScore += charWeight * personalCharScore + bigramWeight * personalBigramScore + trigramWeight * personalTrigramScore + quadgramWeight * personalQuadgramScore;
    }
    const persoalErrorWeight = Math.min(1, errorCount / 500);
    return (1 - persoalErrorWeight) * defualtModelScore / passage.length + persoalErrorWeight * personaModalScore / passage.length;
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

function getDesireForPassage(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, quadgramFrequency) {
    const expectedErrorScore = 0.1;
    const expectedNaturalnessScore = 0.00002;
    const errorScore = getErrorScore(passage, seenLog, errorLog, defaultQuadgramErrorModel, errorCount);
    const naturalnessScore = getNaturalnessScore(passage, quadgramFrequency);
    return (errorScore / expectedErrorScore) + 0.02 * (naturalnessScore / expectedNaturalnessScore);
  }


self.onmessage = function(e) {
  const { 
    upcomingPassages, 
    recentPassages, 
    errorLog, 
    seenLog, 
    errorCount,
  } = e.data;

  // not yet initialised
  if (passages.length == 0 || quadgramFrequency.length == 0 || defaultQuadgramErrorModel.length == 0) {
    return;
  }

  const newUpcomingPassages = [...upcomingPassages];
  
  for (let i = 0; i < 100; i++) {
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    if (!newUpcomingPassages.includes(randomPassage) && !recentPassages.includes(randomPassage)) {
      newUpcomingPassages.push(randomPassage);
    } else {
      i--;
    }
  }
  
  newUpcomingPassages.sort((a, b) => getDesireForPassage(b, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, quadgramFrequency) - getDesireForPassage(a, seenLog, errorLog, defaultQuadgramErrorModel, errorCount, quadgramFrequency));
  const result = newUpcomingPassages.slice(0, 10);
  console.log(result);
  self.postMessage(result);
}; 