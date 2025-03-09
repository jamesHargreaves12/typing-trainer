let DEFAULT_PASSAGES = [
  "Your personal typing coach, typo dojo, identifies your performance gaps and delivers targeted drills to boost your typing skills.",
  "While other apps force you to type random sequences of words, typo dojo immerses you in the authentic flow of language using sentences from trusted sources like Wikipedia.",
  "In today's digital age, exceptional touch typing is a game-changer. Every minute spent training with typo dojo makes you faster and more accurate."
].map(passage => ({passage, source: 'default'}));
let finishedDefaultPassages = false;
let upcomingDefaultPassages = DEFAULT_PASSAGES;
let upcomingPassages = upcomingDefaultPassages;
let currentPassageErrors = [];

let errorLog = {
  'char': {},
  'bigram': {},
  'trigram': {},
  'quadgram': {}
};
let errorCount = 0;
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

function generateUserId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function persistTypingState() {
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '') {
    const to_save = JSON.stringify({
      userId: userId,
      passage: targetText, 
      source: currentPassageSource,
      errors: currentPassageErrors,
      timeTakenMs: (new Date() - startTime)
    });
    const response = await fetch("https://sfuwlmeqrd.execute-api.eu-west-2.amazonaws.com/default/typo-dojo-write-to-bucket", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid: userId })
    });
    const { uploadUrl } = await response.json();
    await fetch(uploadUrl, {
      method: 'PUT',
      body: to_save,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}

let charErrorCount = 0;
let charTotalCount = 0;
let prevInputText = "";
let bgFlashOnError = false;
let userId = "";
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
const MAX_RECENT_PASSAGES = 70;
let currentPassageSource = localStorage.getItem('passageSource') || 'wikipedia';
let passageWorker = new Worker('passageWorker.js');
passageWorker.postMessage({
  type: 'sourceChange',
  source: currentPassageSource
});


function getTopErrors() {
  const topErrorLetters = [];
  for (const ngram in errorLog) {
    const errorScores = Object.entries(errorLog[ngram])
      .filter(([char, errorCount]) => errorCount > 1 && seenLog[ngram][char] > 3 && char != undefined && char != null && char != 'undefined' )
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

function setUpcomingPassages() {
  const startTime = performance.now();
  passageWorker.postMessage({
    upcomingPassages,
    recentPassages,
    errorLog,
    seenLog,
    errorCount,
  });
  console.log(`Time taken to send message to worker: ${performance.now() - startTime}ms`);
  
  setTimeout(() => {
    setUpcomingPassages();
  }, 5000);
}

passageWorker.onmessage = function(e) {
  upcomingPassages = e.data;
  // refilter here because of race conditions
  upcomingPassages = upcomingPassages.filter(passage => !recentPassages.includes(passage.passage));
  localStorage.setItem('upcomingPassages', JSON.stringify(upcomingPassages));
};

let startTime = null;
let targetText = 'Your personal typing coach, typo dojo, identifies your performance gaps and delivers targeted drills to boost your typing skills.';
const textDisplay = document.getElementById('textDisplay');
renderText();

window.onload = function() {
  if (!localStorage.getItem('userId')) {
    localStorage.setItem('userId', generateUserId());
  }
  userId = localStorage.getItem('userId');

  errorLog = JSON.parse(localStorage.getItem('errorLog')) || {
    'char': {},
    'bigram': {},
    'trigram': {},
    'quadgram': {}
  };
  errorCount = Object.values(errorLog['char']).reduce((acc, curr) => acc + curr, 0);
  
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
  // backwards compatibility
  if (upcomingPassages.length > 0 && typeof upcomingPassages[0] === 'string') {
    upcomingPassages = upcomingPassages.map(passage => ({passage, source: 'unknown'}));
  }
  const p= getPassage();
  const {passage, source} = p;
  console.log(p);
  targetText = passage;
  currentPassageSource = source;
  renderText();
  colorText("");
  document.getElementById('topErrors').innerHTML = topErrorsToHtmlTable();

  runHistory = JSON.parse(localStorage.getItem('runHistory')) || [];
  updateHistoryDisplay();
  
  setTimeout(() => {
    setUpcomingPassages();
  }, 5000);
  
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

  // Passage source selector
  document.getElementById('passageSourceButton').addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.settings-dropdown:last-of-type').classList.toggle('active');
  });

  //  initial radio button state
  let cps = currentPassageSource;
  if (cps == "default" || !cps) {
    cps = "wikipedia";
  }
  document.querySelector(`input[name="passageSource"][value="${cps}"]`).checked = true;

  // Handle passage source changes
  document.querySelectorAll('input[name="passageSource"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentPassageSource = e.target.value;
      localStorage.setItem('passageSource', currentPassageSource);
      passageWorker.postMessage({
        type: 'sourceChange',
        source: currentPassageSource
      });
      upcomingPassages = [];

    });
  });
}

// DOM elements
const inputArea = document.getElementById('inputArea');
const progressBar = document.getElementById('progressBar');


function renderText() {
  let words = targetText.split(" ");
  let wordStartIndecies = [];
  
  for (let i = 0; i < words.length; i++) {
    wordStartIndecies.push(targetText.indexOf(words[i]) + i);
  }
  
  let html = '';
  
  for (let i = 0; i < targetText.length; i++) {
    let char = targetText[i];
    if (char === " ") {
      html += `<span id="char-${i}" class="letter space">&nbsp;</span></span><span class="word">`;
    } else {
      html += `<span id="char-${i}" class="letter">${char}</span>`;
    }
  }
  textDisplay.innerHTML = html;
}


function colorText(inputText)
{
  for (let i = 0; i < targetText.length; i++) {
    const targetLetter = targetText[i];
    const charSpan = document.getElementById(`char-${i}`);
    let currentClasses = charSpan.className.replace(' correct', '').replace(' error', '').replace(' cursor', '') || '';

    if (i >= inputText.length) {
      charSpan.className = currentClasses;
      continue;
    }
    const inputLetter = inputText[i];
    if (charSpan == null) {
      continue;
    }
    if (inputLetter == null) {
      charSpan.className = currentClasses.replace('letter', 'letter error');
    } else if (inputLetter === targetLetter) {
      charSpan.className = currentClasses.replace('letter', 'letter correct');
    } else {
      charSpan.className = currentClasses.replace('letter', 'letter error');
    }
  }
  const NextChar = document.getElementById(`char-${inputText.length}`);
  if (NextChar) {
    NextChar.className = NextChar.className.replace('letter', 'letter cursor');
  }
}

inputArea.addEventListener('input', handleInput);
document.addEventListener('keydown', (e) => {
  inputArea.focus();
  if (e.key === 'Tab') {
    e.preventDefault();
  }
});

function handleInput(e) {
  const inputArea = document.getElementById('inputArea');
  
  // Force cursor to end of input
  const end = inputArea.value.length;
  inputArea.setSelectionRange(end, end);
  
  if (e.data == ">") {
    resetSession();
    return;
  }
  const inputText = inputArea.value;
  colorText(inputText);

  if (e["inputType"] != "deleteContentBackward") {
    charTotalCount += 1;
  }
  // Start timer on first keystroke
  if (!startTime && inputText.length > 0) {
    startTime = new Date();
  }
  
  if (prevInputText.length == inputText.length - 1 && prevInputText == inputText.slice(0, -1) && inputText.length <= targetText.length) {
    let i = prevInputText.length
    unigram = targetText[i];
    bigram = targetText.slice(i-1, i+1);
    trigram = targetText.slice(i-2, i+1);
    quadgram = targetText.slice(i-3, i+1);

    // TODO we should add a suffix to start to capture first letter bigrams etc
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

    const typedChar = inputText[i];

    if (typedChar !== null && typedChar !== targetText[i]) {
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
      
      currentPassageErrors.push(i);
      
      errorLog['char'][unigram] = (errorLog['char'][unigram] || 0) + 1;
      errorCount += 1;
      if (bigram.length > 1) {
        errorLog['bigram'][bigram] = (errorLog['bigram'][bigram] || 0) + 1;
      }
      if (trigram.length > 2) {
        errorLog['trigram'][trigram] = (errorLog['trigram'][trigram] || 0) + 1;
      }
      if (quadgram.length > 3) {
        errorLog['quadgram'][quadgram] = (errorLog['quadgram'][quadgram] || 0) + 1;
      }
    }
  }

  prevInputText = inputText;
  // Update the progress bar width based on completion percentage
  let progress = Math.min((inputText.length / targetText.length) * 100, 100);
  progressBar.style.width = progress + "%";
  
  updateLiveMetrics();
  
  // When the user completes the passage
  if (inputText === targetText || (inputText.length >= targetText.length)) {
    persistTypingState();
    saveErrorData();
    setTimeout(resetSession, 500); // brief pause before resetting
    trackRepetitionCompletion();
  }


  document.getElementById('topErrors').innerHTML = topErrorsToHtmlTable();
}

// Add this event listener after the existing input listener
inputArea.addEventListener('keydown', function(e) {
  // Prevent left/right arrow keys and mouse clicks from moving cursor
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
  }
});

inputArea.addEventListener('mousedown', function(e) {
  // Prevent mouse clicks from moving cursor
  e.preventDefault();
  const end = this.value.length;
  this.setSelectionRange(end, end);
});

inputArea.addEventListener('select', function(e) {
  // Prevent text selection
  const end = this.value.length;
  this.setSelectionRange(end, end);
});

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
  if (startTime) { 
    const metrics = calculateMetrics();
    const wpm = metrics.wpm;
    const accuracy = metrics.accuracy;
    
    if (wpm > 0 && accuracy > 0 && wpm < 1000 && accuracy <= 100) {
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
  prevInputText = "";
  charErrorCount = 0;
  charTotalCount = 0;
  startTime = null;
  currentPassageErrors = [];
  // Add current passage to recent list
  if (targetText) {
    recentPassages.unshift(targetText);
    recentPassages = recentPassages.slice(0, MAX_RECENT_PASSAGES);
    localStorage.setItem('recentPassages', JSON.stringify(recentPassages));
  }
  
  const {passage, source} = getPassage();
  targetText = passage;
  currentPassageSource = source;
  renderText();
  colorText("");
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
  errorCount = 0;
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