let DEFAULT_PASSAGES = [
  "Your personal typing coach, typo dojo, identifies your performance gaps and delivers targeted drills to boost your typing skills.",
  "While other apps force you to type random sequences of words, typo dojo immerses you in the authentic flow of language using sentences from trusted sources like Wikipedia.",
  "In today's digital age, exceptional touch typing is a game-changer. Every minute spent training with typo dojo makes you faster and more accurate."
];
let finishedDefaultPassages = false;
let passages = DEFAULT_PASSAGES;
let upcomingDefaultPassages = DEFAULT_PASSAGES;
let upcomingPassages = passages;

let errorLog = {
  'char': {},
  'bigram': {},
  'trigram': {},
  'quadgram': {}
};

let seenLog = {
  'char': {},
  'bigram': {},
  'trigram': {},
  'quadgram': {}
};

function trackRepetitionCompletion() {
  let completedTasks = localStorage.getItem('repetition_count') || 0;
  completedTasks++;
  localStorage.setItem('repetition_count', completedTasks);
  gtag('set', {'repetition_count': completedTasks});
  gtag('event', 'repetition_completed', {
    'event_category': 'repetition',
    'event_label': 'Rep ' + completedTasks
  });
}

let unigramFrequency = {};
let bigramFrequency = {};
let trigramFrequency = {};
let quadgramFrequency = {};
let alphaChars = 0.95;
let alphaBigrams = 0.95;
let alphaTrigrams = 0.95;
let alphaQuadgrams = 0.95;
let charWeight = 0.3;
let bigramWeight = 0.45;
let trigramWeight = 0.15;
let quadgramWeight = 0.1;
let charErrorCount = 0;
let charTotalCount = 0;
let prevTargetText = "";
let bgFlashOnError = false;

let runHistory = [];
const MAX_HISTORY = 20;

const lengthToNgram = {
  1: 'char',
  2: 'bigram',
  3: 'trigram',
  4: 'quadgram'
};

let tooltip = null;

// Add after other global variables
let darkMode = localStorage.getItem('darkMode') === 'true';
let settingsOpen = false;
let soundOnError = false;
const errorSound = document.getElementById('errorSound');
let recentPassages = [];
const MAX_RECENT_PASSAGES = 30;

function getTopErrors() {
  const topErrorLetters = [];
  for (const ngram in errorLog) {
    const errorScores = Object.entries(errorLog[ngram])
      .filter(([char, errorCount]) => errorCount > 1)
      .map(([char,errorCount]) => [char, (errorCount+1)/(seenLog[ngram][char]+1*Object.keys(errorLog[ngram]).length)]);
    const sortedErrorScores = errorScores.sort((a, b) => b[1] - a[1]);
    const worstLetters = sortedErrorScores.slice(0, 5);
    topErrorLetters.push(...worstLetters.map(letter => letter[0]));
  }
  return topErrorLetters.slice(0, 5).map(letter => {
      const letterKey = letter[0];
      const ngramLength = lengthToNgram[letterKey.length];
      const errorCount = errorLog[ngramLength][letterKey];
      const seenCount = seenLog[ngramLength][letterKey];

      return {
          letter: letterKey,
          errorRate: errorCount / seenCount,
          seenCount: seenCount
      };
  });
}

function topErrorsToHtmlTable() {
  const topErrors = getTopErrors();
  if (topErrors.length == 0) {
    document.getElementById('topErrors').style.display = "none";
    return "";
  }
  document.getElementById('topErrors').style.display = "block";
  const errorListClass = 'error-list';
  const errorItemClass = 'error-item';
  const titleClass = "error-title";
  
  let html = `<div class="${errorListClass}">`;
  let title = "Most common typos";
  html += `<div class="${titleClass}">${title}</div>`;
  
  for (const error of topErrors) {
    const errorRate = (error.errorRate * 100).toFixed(0);
    if (errorRate == "NaN") {
      continue;
    }
    html += `<div class="${errorItemClass}">
      <span class="error-char">${error.letter}</span>
      <span>${errorRate}%</span>
      <span>/${error.seenCount}</span>
    </div>`;
  }
  
  html += '</div>';
  return html;
}

function updateHistoryDisplay() {
  if (runHistory.length == 0) {
    document.getElementById('history').style.display = "none";
    return;
  }
  document.getElementById('history').style.display = "block";

  const historyDiv = document.getElementById('history');
  const width = 250;
  const height = 112;
  const margin = { top: 20, right: 20, bottom: 20, left: 5 };
  const maxWPM = runHistory.reduce((max, run) => Math.max(max, run.wpm), 0);
  const maxAccuracy = runHistory.reduce((max, run) => Math.max(max, run.accuracy), 0);
  const minWPM = runHistory.reduce((min, run) => Math.min(min, run.wpm), 1000);
  const minAccuracy = runHistory.reduce((min, run) => Math.min(min, run.accuracy), 100);
  const maxYaxisWPM = maxWPM;
  const maxYaxisAccuracy = Math.min(maxAccuracy, 100);
  const minYaxisWPM = minWPM;
  const minYaxisAccuracy = Math.max(minAccuracy, 0);
  
  let content;
  if (runHistory.length < 5) {
    // Show table for less than 5 runs
    content = `
      <table class="history-table">
        <thead>
          <tr>
            <th>WPM</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          ${runHistory.map(run => `
            <tr>
              <td>${run.wpm}</td>
              <td>${run.accuracy}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    // Show two SVG graphs for 5+ runs
    content = `
      <div style="display: flex; gap: 20px;">
        <div>
          <div class="history-sub-title" style="text-align: center; margin-bottom: 5px;">WPM</div>
          <svg width="${width}" height="${height}">
            <g transform="translate(${margin.left},${margin.top})">
              <!-- Y axis -->
              <g class="y-axes">
                <line x1="15" y1="0" x2="15" y2="${height - margin.top - margin.bottom}" stroke="#666"/>
                <line x1="15" y1="${height - margin.top - margin.bottom}" x2="${width - margin.left - margin.right}" y2="${height - margin.top - margin.bottom}" stroke="#666"/>
                <text x="10" y="0" text-anchor="end" dominant-baseline="hanging" font-size="10" fill="#666">${Math.round(maxYaxisWPM)}</text>
                <text x="10" y="${height - margin.top - margin.bottom}" text-anchor="end" dominant-baseline="baseline" font-size="10" fill="#666">${Math.round(minYaxisWPM)}</text>
              </g>

              <!-- WPM data points -->
              ${[...runHistory].reverse().map((run, i) => {
                const x = (width - 15 - margin.left - margin.right) * (i / Math.max(runHistory.length - 1, 1));
                const yWPM = (height - margin.top - margin.bottom) * (1 - (run.wpm - minYaxisWPM)/(maxYaxisWPM - minYaxisWPM));
                return `
                  <circle cx="${x + 15}" cy="${yWPM}" r="3" fill="#666666" 
                    onmouseover="showTooltip(event, 'WPM: ${run.wpm}')"
                    onmouseout="hideTooltip()"
                  />
                `;
              }).join('')}
              }).join('')}
            </g>
          </svg>
        </div>
        <div style="width: 1px; background-color: var(--border-color); margin: 0 5px;"></div>

        <div>
          <div class="history-sub-title" style="text-align: center; margin-bottom: 5px;">Accuracy</div>
          <svg width="${width}" height="${height}">
            <g transform="translate(${margin.left},${margin.top})">
              <!-- Y axis -->
              <g class="y-axes">
                <line x1="15" y1="0" x2="15" y2="${height - margin.top - margin.bottom}" stroke="#666"/>
                <line x1="15" y1="${height - margin.top - margin.bottom}" x2="${width - margin.left - margin.right}" y2="${height - margin.top - margin.bottom}" stroke="#666"/>
                <text x="10" y="0" text-anchor="end" dominant-baseline="hanging" font-size="10" fill="#666">${Math.round(maxYaxisAccuracy)}</text>
                <text x="10" y="${height - margin.top - margin.bottom}" text-anchor="end" dominant-baseline="baseline" font-size="10" fill="#666">${Math.round(minYaxisAccuracy)}</text>
              </g>

              <!-- Accuracy data points -->
              ${[...runHistory].reverse().map((run, i) => {
                const x = (width - 15 - margin.left - margin.right) * (i / Math.max(runHistory.length - 1, 1));
                const yAcc = (height - margin.top - margin.bottom) * (1 - (run.accuracy - minYaxisAccuracy)/(maxYaxisAccuracy - minYaxisAccuracy));
                return `
                  <rect x="${x-3+15}" y="${yAcc-3}" width="6" height="6" fill="#666666"
                    onmouseover="showTooltip(event, 'Accuracy: ${run.accuracy}%')"
                    onmouseout="hideTooltip()"
                  />
                `;
              }).join('')}
            </g>
          </svg>
        </div>
      </div>`;
  }

  historyDiv.innerHTML = `
    <div class="history-title">Recent Runs</div>
    ${content}
  `;
}


function getPassage() {
  if (!finishedDefaultPassages) {
    const nextPassage = upcomingDefaultPassages.shift();
    if (nextPassage == null) {
      finishedDefaultPassages = true;
    }
    else {
      return nextPassage;
    }
  }
  
  const nextPassage = upcomingPassages.shift();
  return nextPassage;
  
}

function getDesireForPassage(passage) {
  // Calculate a desire score for a passage based on character and bigram frequencies
  // and error rates. Higher scores indicate passages that target characters and 
  // bigrams the user needs more practice with.
  //
  // The desire score is a weighted combination of:
  // 1. Character-level desire: For each character, considers both its error rate 
  //    and natural frequency
  // 2. Bigram-level desire: For each character pair, considers both its error rate
  //    and natural frequency
  //
  // Parameters:
  //   passage (string): The text passage to evaluate
  //
  // Returns:
  //   number: A desire score where higher values indicate more valuable practice passages
  const charMap = {};
  const bigramMap = {};
  const trigramMap = {};
  const quadgramMap = {};

  for (let char of passage) {
    charMap[char] = (charMap[char] || 0) + 1;
  }
  for (let i = 0; i < passage.length - 1; i++) {
    const bigram = passage.slice(i, i + 2);
    bigramMap[bigram] = (bigramMap[bigram] || 0) + 1;
  }
  
  let charDesireAccumulation = 0;
  let totalLength = 0;
  
  for (let char in charMap) {
    const errorScore = (errorLog['char'][char] || 0) / (seenLog['char'][char] || 1);
    const frequencyScore = unigramFrequency[char] || 0;
    charDesireAccumulation += charMap[char] * (alphaChars * errorScore + (1 - alphaChars) * frequencyScore);
    totalLength += charMap[char];
  }

  let bigramDesireAccumulation = 0;
  let bigramTotalLength = 0;
  for (let bigram in bigramMap) {
    const errorScore = (errorLog['bigram'][bigram] || 0) / (seenLog['bigram'][bigram] || 1);
    const frequencyScore = bigramFrequency[bigram] || 0;
    bigramDesireAccumulation += bigramMap[bigram] * (alphaBigrams * errorScore + (1 - alphaBigrams) * frequencyScore);
    bigramTotalLength += bigramMap[bigram];
  }

  let trigramDesireAccumulation = 0;
  let trigramTotalLength = 0;
  for (let trigram in trigramMap) {
    const errorScore = (errorLog['trigram'][trigram] || 0) / (seenLog['trigram'][trigram] || 1);
    const frequencyScore = trigramFrequency[trigram] || 0;
    trigramDesireAccumulation += trigramMap[trigram] * (alphaTrigrams * errorScore + (1 - alphaTrigrams) * frequencyScore);
    trigramTotalLength += trigramMap[trigram];
  }

  let quadgramDesireAccumulation = 0;
  let quadgramTotalLength = 0;
  for (let quadgram in quadgramMap) {
    const errorScore = (errorLog['quadgram'][quadgram] || 0) / (seenLog['quadgram'][quadgram] || 1);
    const frequencyScore = quadgramFrequency[quadgram] || 0;
    quadgramDesireAccumulation += quadgramMap[quadgram] * (alphaQuadgrams * errorScore + (1 - alphaQuadgrams) * frequencyScore);
    quadgramTotalLength += quadgramMap[quadgram];
  }

  const bigramDesire = bigramDesireAccumulation / (bigramTotalLength + 1);
  const charDesire = charDesireAccumulation / (totalLength + 1);
  const trigramDesire = trigramDesireAccumulation / (trigramTotalLength + 1);
  const quadgramDesire = quadgramDesireAccumulation / (quadgramTotalLength + 1);
  return charWeight * charDesire + bigramWeight * bigramDesire + trigramWeight * trigramDesire + quadgramWeight * quadgramDesire;
}

function setUpcomingPassages() {
  const newUpcomingPassages = [...upcomingPassages];
  
  for (let i = 0; i < 100; i++) {
    const randomPassage = passages[Math.floor(Math.random() * passages.length)];
    if (!newUpcomingPassages.includes(randomPassage) && !recentPassages.includes(randomPassage)) {
      newUpcomingPassages.push(randomPassage);
    } else {
      i--;
    }
  }
  
  newUpcomingPassages.sort((a, b) => getDesireForPassage(b) - getDesireForPassage(a));
  upcomingPassages = newUpcomingPassages.slice(0, 10);
  localStorage.setItem('upcomingPassages', JSON.stringify(upcomingPassages));
  console.log(upcomingPassages[0]);
  setTimeout(() => {
    setUpcomingPassages();
  }, 5000); 

}
let startTime = null;
let targetText = '';
window.onload = function() {
  errorLog = JSON.parse(localStorage.getItem('errorLog')) || {
    'char': {},
    'bigram': {},
    'trigram': {},
    'quadgram': {}
  };
  
  seenLog = JSON.parse(localStorage.getItem('seenLog')) || {
    'char': {},
    'bigram': {},
    'trigram': {},
    'quadgram': {}
  };
  if (localStorage.getItem('upcomingPassages') != null) {
    finishedDefaultPassages = true;
  }

  upcomingPassages = JSON.parse(localStorage.getItem('upcomingPassages')) || DEFAULT_PASSAGES;
  targetText = getPassage();
  renderText();
  document.getElementById('topErrors').innerHTML = topErrorsToHtmlTable();

  runHistory = JSON.parse(localStorage.getItem('runHistory')) || [];
  updateHistoryDisplay();

  fetch('https://jameshargreaves12.github.io/reference_data/cleaned_wikipedia_articles.txt')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(text => {
      passages = text.split("\n");
      const arrFreqAndFileName = [[unigramFrequency, 'unigrams'], [bigramFrequency, 'bigrams'], [trigramFrequency, 'trigrams'], [quadgramFrequency, 'quadgrams']];
      return Promise.all(arrFreqAndFileName.map(freqAndFileName => 
        fetch(`https://jameshargreaves12.github.io/reference_data/${freqAndFileName[1]}.json`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            // Set the appropriate frequency variable based on ngram type
            freqAndFileName[0] = data;
          })
      ));
    })
    .then(() => {
      // on timeout call setUpcomingPassages
      setTimeout(() => {
        setUpcomingPassages();
      }, 1000);
    });

  // Create tooltip element
  tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  document.body.appendChild(tooltip);

  // Initialize dark mode
  if (darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  
  // Add dark mode toggle handler
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
  });

  // Settings button click handler
  document.getElementById('settingsButton').addEventListener('click', (e) => {
    e.stopPropagation();
    settingsOpen = !settingsOpen;
    document.querySelector('.settings-dropdown').classList.toggle('active');
  });

  // Close settings when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.settings-dropdown')) {
      settingsOpen = false;
      document.querySelector('.settings-dropdown').classList.remove('active');
    }
  });

  // Background flash toggle
  const bgFlashToggle = document.getElementById('bgFlashToggle');
  bgFlashToggle.checked = localStorage.getItem('bgFlashOnError') === 'true';
  bgFlashOnError = bgFlashToggle.checked;

  bgFlashToggle.addEventListener('change', (e) => {
    bgFlashOnError = e.target.checked;
    localStorage.setItem('bgFlashOnError', bgFlashOnError);
  });

  // Preload and setup error sound
  errorSound.load();
  errorSound.volume = 0.3;
  
  // Sound toggle with localStorage
  const soundToggle = document.getElementById('soundToggle');
  soundToggle.checked = localStorage.getItem('soundOnError') === 'true';
  soundOnError = soundToggle.checked;

  soundToggle.addEventListener('change', (e) => {
    soundOnError = e.target.checked;
    localStorage.setItem('soundOnError', soundOnError);
    if (soundOnError) {
      errorSound.load();
    }
  });

  // Setup weight sliders
  const sliders = {
    char: document.getElementById('charWeightSlider'),
    bigram: document.getElementById('bigramWeightSlider'),
    trigram: document.getElementById('trigramWeightSlider'),
    quadgram: document.getElementById('quadgramWeightSlider')
  };

  // Load saved weights
  charWeight = parseFloat(localStorage.getItem('charWeight')) || 0.3;
  bigramWeight = parseFloat(localStorage.getItem('bigramWeight')) || 0.45;
  trigramWeight = parseFloat(localStorage.getItem('trigramWeight')) || 0.15;
  quadgramWeight = parseFloat(localStorage.getItem('quadgramWeight')) || 0.1;

  // Initialize slider values
  sliders.char.value = charWeight * 100;
  sliders.bigram.value = bigramWeight * 100;
  sliders.trigram.value = trigramWeight * 100;
  sliders.quadgram.value = quadgramWeight * 100;

  // Update labels
  function updateWeightLabels() {
    sliders.char.parentElement.querySelector('label').textContent = `Unigram (${(charWeight * 100).toFixed(0)}%)`;
    sliders.bigram.parentElement.querySelector('label').textContent = `Bigram (${(bigramWeight * 100).toFixed(0)}%)`;
    sliders.trigram.parentElement.querySelector('label').textContent = `Trigram (${(trigramWeight * 100).toFixed(0)}%)`;
    sliders.quadgram.parentElement.querySelector('label').textContent = `Quadgram (${(quadgramWeight * 100).toFixed(0)}%)`;
  }
  updateWeightLabels();

  // Handle slider changes
  function handleSliderChange(e) {
    const newValue = parseFloat(e.target.value) / 100;
    const type = Object.keys(sliders).find(key => sliders[key] === e.target);
    
    // Update the weight
    switch(type) {
      case 'char': charWeight = newValue; break;
      case 'bigram': bigramWeight = newValue; break;
      case 'trigram': trigramWeight = newValue; break;
      case 'quadgram': quadgramWeight = newValue; break;
    }

    // Normalize weights to sum to 1
    const total = charWeight + bigramWeight + trigramWeight + quadgramWeight;
    charWeight /= total;
    bigramWeight /= total;
    trigramWeight /= total;
    quadgramWeight /= total;

    // Update sliders and labels
    sliders.char.value = charWeight * 100;
    sliders.bigram.value = bigramWeight * 100;
    sliders.trigram.value = trigramWeight * 100;
    sliders.quadgram.value = quadgramWeight * 100;
    updateWeightLabels();

    // Save to localStorage
    localStorage.setItem('charWeight', charWeight);
    localStorage.setItem('bigramWeight', bigramWeight);
    localStorage.setItem('trigramWeight', trigramWeight);
    localStorage.setItem('quadgramWeight', quadgramWeight);

    // Trigger recalculation of upcoming passages
    setUpcomingPassages();
  }

  // Add event listeners to sliders
  Object.values(sliders).forEach(slider => {
    slider.addEventListener('input', handleSliderChange);
  });
}

// DOM elements
const textDisplay = document.getElementById('textDisplay');
const inputArea = document.getElementById('inputArea');
const progressBar = document.getElementById('progressBar');


// Render the target text: Wrap each character in a span for individual highlighting.
function renderText() {
  let words = targetText.split(" "); // Split by space
  let wordStartIndecies = [];
  
  for (let i = 0; i < words.length; i++) {
    wordStartIndecies.push(targetText.indexOf(words[i]) + i);
  }
  
  let html = '';
  for (let i = 0; i < targetText.length; i++) {
    let char = targetText[i];
    if (char === " ") {
      html += `</span><span id="char-${i}" class="letter space">&nbsp;</span><span class="word">`;
    } else {
      html += `<span id="char-${i}" class="letter">${char}</span>`;
    }
  }
  textDisplay.innerHTML = html;
}

// Listen for input events
inputArea.addEventListener('input', handleInput);

function handleInput(e) {
  const inputText = e.target.value;
  if (inputText == ">") {
    resetSession();
    return;
  }

  if (e["inputType"] != "deleteContentBackward") {
    charTotalCount += 1;
  }
  // TODO char Counter and error counter plus this needs to only include the latest letter not allt the text.
  // Start timer on first keystroke
  if (!startTime && inputText.length > 0) {
    startTime = new Date();
  }
  
  let correctCount = 0;
  if (prevTargetText.length == inputText.length - 1) {
    let i = prevTargetText.length
    unigram = targetText[i];
    bigram = targetText.slice(i-1, i+1);
    trigram = targetText.slice(i-2, i+1);
    quadgram = targetText.slice(i-3, i+1);

    seenLog['char'][unigram] = (seenLog['char'][unigram] || 0) + 1;
    if (bigram.length > 1) {
      seenLog['bigram'][bigram] = (seenLog['bigram'][bigram] || 0) + 1;
    }
    if (trigram.length > 2) {
      seenLog['trigram'][trigram] = (seenLog['trigram'][trigram] || 0) + 1;
    }
    if (quadgram.length > 3) {
      seenLog['quadgram'][quadgram] = (seenLog['quadgram'][quadgram] || 0) + 1;
    }
    
    const charSpan = document.getElementById(`char-${i}`);
    const typedChar = inputText[i];
    const currentClasses = charSpan.className.replace(' correct', '').replace(' error', '');
    
    if (typedChar == null) {
      charSpan.className = currentClasses;
    } else if (typedChar === targetText[i]) {
      charSpan.className = currentClasses.replace('letter', 'letter correct');
      correctCount++;
    } else {
      charErrorCount += 1;
      if (soundOnError) {
        errorSound.currentTime = 0; // Reset sound to start
        errorSound.play();
      }

      // Add flash effect to body
      if (bgFlashOnError) {
        document.body.classList.add('flash-error');
        setTimeout(() => document.body.classList.remove('flash-error'), 300);
      }
      
      
      console.log(errorLog);
      errorLog['char'][unigram] = (errorLog['char'][unigram] || 0) + 1;
      if (bigram.length > 1) {
        errorLog['bigram'][bigram] = (errorLog['bigram'][bigram] || 0) + 1;
      }
      if (trigram.length > 2) {
        errorLog['trigram'][trigram] = (errorLog['trigram'][trigram] || 0) + 1;
      }
      if (quadgram.length > 3) {
        errorLog['quadgram'][quadgram] = (errorLog['quadgram'][quadgram] || 0) + 1;
      }
      console.log("unigram: " + unigram, "bigram: " + bigram, "trigram: " + trigram, "quadgram: " + quadgram);
      charSpan.className = currentClasses.replace('letter', 'letter error');
    }
  }
  prevTargetText = inputText;
  // Update the progress bar width based on completion percentage
  let progress = Math.min((inputText.length / targetText.length) * 100, 100);
  progressBar.style.width = progress + "%";
  
  updateLiveMetrics();
  
  // When the user completes the passage
  if (inputText === targetText) {
    saveErrorData();
    setTimeout(resetSession, 500); // brief pause before resetting
    trackRepetitionCompletion();
  }


  document.getElementById('topErrors').innerHTML = topErrorsToHtmlTable();
}
function calculateMetrics() {
  const timeElapsed = (new Date() - startTime) / 60000; // minutes
  const charsPerWord = 4.7;
  let wpm = Math.round((charTotalCount / charsPerWord / timeElapsed));
  let accuracy = Math.round((charTotalCount - charErrorCount) / charTotalCount * 100);
  wpm = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
  accuracy = isNaN(accuracy) || !isFinite(accuracy) ? 100 : accuracy;
  return { wpm, accuracy };
}

function updateLiveMetrics() {
  const metrics = calculateMetrics();
  const wpm = metrics.wpm;
  const accuracy = metrics.accuracy;
  document.getElementById('wpm').textContent = `WPM: ${wpm}`;
  document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;
}

function saveErrorData() {
  localStorage.setItem('errorLog', JSON.stringify(errorLog));
  localStorage.setItem('seenLog', JSON.stringify(seenLog));
}

function resetSession() {
  if (startTime) {  // Only save if there was actually a run
    const metrics = calculateMetrics();
    const wpm = metrics.wpm;
    const accuracy = metrics.accuracy;
    
    if (wpm > 0 && accuracy > 0 && wpm < 1000 && accuracy < 100) {
      // Calculate averages from previous runs (up to 10)
      const prevRuns = runHistory.slice(0, 10);
      const avgWPM = prevRuns.length > 0 ? 
        prevRuns.reduce((sum, run) => sum + run.wpm, 0) / prevRuns.length : 0;
      const avgAccuracy = prevRuns.length > 0 ? 
        prevRuns.reduce((sum, run) => sum + run.accuracy, 0) / prevRuns.length : 0;
      
      // Flash WPM
      const wpmElement = document.getElementById('wpm');
      wpmElement.className = wpm > avgWPM ? 'flash-good' : 'flash-bad';
      // Reset animation by removing and re-adding the class
      setTimeout(() => wpmElement.className = '', 1000);
      
      // Flash Accuracy
      const accuracyElement = document.getElementById('accuracy');
      accuracyElement.className = accuracy > avgAccuracy ? 'flash-good' : 'flash-bad';
      setTimeout(() => accuracyElement.className = '', 1000);
      
      runHistory.unshift({ wpm, accuracy });
      runHistory = runHistory.slice(0, MAX_HISTORY);
      localStorage.setItem('runHistory', JSON.stringify(runHistory));
      updateHistoryDisplay();
    }
  }
  
  // Reset state for a new session
  prevTargetText = "";
  charErrorCount = 0;
  charTotalCount = 0;
  startTime = null;
  
  // Add current passage to recent list
  if (targetText) {
    recentPassages.unshift(targetText);
    recentPassages = recentPassages.slice(0, MAX_RECENT_PASSAGES);
    localStorage.setItem('recentPassages', JSON.stringify(recentPassages));
  }
  
  targetText = getPassage();
  renderText();
  inputArea.value = "";
  progressBar.style.width = "0%";
}

function showTooltip(event, text) {
  const rect = event.target.getBoundingClientRect();
  tooltip.textContent = text;
  tooltip.style.opacity = '1';
  tooltip.style.left = (rect.left + rect.width/2 - tooltip.offsetWidth/2) + 'px';
  tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
}

function hideTooltip() {
  tooltip.style.opacity = '0';
}

function resetStats() {
  // Reset error and seen logs
  errorLog = {
    'char': {},
    'bigram': {},
    'trigram': {},
    'quadgram': {}
  };
  seenLog = {
    'char': {},
    'bigram': {},
    'trigram': {},
    'quadgram': {}
  };
  
  // Reset run history
  runHistory = [];
  
  // Clear localStorage
  localStorage.removeItem('errorLog');
  localStorage.removeItem('seenLog');
  localStorage.removeItem('runHistory');
  localStorage.removeItem('repetition_count');
  
  // Update UI
  document.getElementById('topErrors').innerHTML = topErrorsToHtmlTable();
  updateHistoryDisplay();
  
  // Flash feedback
  document.getElementById('resetStats').classList.add('flash-good');
  setTimeout(() => document.getElementById('resetStats').classList.remove('flash-good'), 300);
}

// Add event listener after window load
window.addEventListener('load', () => {
  document.getElementById('resetStats').addEventListener('click', resetStats);
});