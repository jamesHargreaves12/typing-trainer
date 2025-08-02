// Lanczos approximation of log-gamma function
function logGamma(z) {
  const cof = [
    76.18009172947146,   -86.50532032941677,
    24.01409824083091,   -1.231739572450155,
    0.1208650973866179e-2, -0.5395239384953e-5
  ];
  let x = z;
  let y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < cof.length; j++) {
    y += 1;
    ser += cof[j] / y;
  }
  return Math.log(2.5066282746310005 * ser / x) - tmp;
}

// Lower regularized incomplete gamma function P(a, x)
function gammaP(a, x) {
  const EPS = 1e-8;
  const MAX_ITER = 100;

  if (x < 0 || a <= 0) return NaN;

  if (x === 0) return 0;

  if (x < a + 1) {
    // Series representation
    let ap = a;
    let sum = 1 / a;
    let delta = sum;
    for (let n = 1; n <= MAX_ITER; n++) {
      ap += 1;
      delta *= x / ap;
      sum += delta;
      if (Math.abs(delta) < Math.abs(sum) * EPS) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  } else {
    // Continued fraction representation
    let b = x + 1 - a;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let h = d;

    for (let i = 1; i <= MAX_ITER; i++) {
      let an = -i * (i - a);
      b += 2;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1 / d;
      const delta = d * c;
      h *= delta;
      if (Math.abs(delta - 1.0) < EPS) break;
    }

    return 1 - h * Math.exp(-x + a * Math.log(x) - logGamma(a));
  }
}

// Gamma CDF
function gammaCDF(x, shape, loc = 0, scale = 1) {
  if (x <= loc) return 0;
  return gammaP(shape, (x - loc) / scale);
}

function betacf(x, a, b) {
  const MAX_ITER = 100;
  const EPS = 1e-8;

  let qab = a + b;
  let qap = a + 1;
  let qam = a - 1;
  let c = 1;
  let d = 1 - qab * x / qap;
  if (Math.abs(d) < EPS) d = EPS;
  d = 1 / d;
  let h = d;

  for (let m = 1; m <= MAX_ITER; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < EPS) d = EPS;
    c = 1 + aa / c;
    if (Math.abs(c) < EPS) c = EPS;
    d = 1 / d;
    h *= d * c;

    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < EPS) d = EPS;
    c = 1 + aa / c;
    if (Math.abs(c) < EPS) c = EPS;
    d = 1 / d;
    const del = d * c;
    h *= del;

    if (Math.abs(del - 1.0) < EPS) break;
  }

  return h;
}

function betaCDF(x, a, b, loc = 0, scale = 1) {
  const z = (x - loc) / scale;
  if (z <= 0) return 0;
  if (z >= 1) return 1;

  const bt = Math.exp(
    a * Math.log(z) + b * Math.log(1 - z) - Math.logBeta(a, b)
  );

  if (z < (a + 1) / (a + b + 2)) {
    return bt * betacf(z, a, b) / a;
  } else {
    return 1 - bt * betacf(1 - z, b, a) / b;
  }
}

// Add logBeta approximation
Math.logBeta = function(a, b) {
  return Math.lgamma(a)[0] + Math.lgamma(b)[0] - Math.lgamma(a + b)[0];
}

// Add lgamma function (Lanczos approx)
Math.lgamma = function(z) {
  const cof = [
    76.18009172947146,   -86.50532032941677,
    24.01409824083091,   -1.231739572450155,
    0.1208650973866179e-2, -0.5395239384953e-5
  ];
  let x = z;
  let y = z;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;
  for (let j = 0; j < cof.length; j++) {
    y += 1;
    ser += cof[j] / y;
  }
  return [-tmp + Math.log(2.5066282746310005 * ser / x), 0];
}

function _suggestRepetitionStrategy(wpm, accuracy, wpm_percentile, accuracy_percentile){
  let header = `Over the last 5 reps, your words per minute have been ${Math.round(wpm)} (faster than ${Math.round(wpm_percentile*100)}% of users), and your accuracy has been ${Math.round(accuracy*100)}% (better than ${Math.round(accuracy_percentile*100)}% of users).`

  if (wpm > 70) {
    header =  `${header} Impressive speed!`
  }
  else if (accuracy > 0.95 && wpm_percentile <= accuracy_percentile) {
    header =  `${header} Impressive accuracy!`
  }

  if (wpm < 40 && accuracy < 0.95) {
    return `${header} Focus on slowing down and improving your accuracy.`
  }
  else if (wpm < 40) {
    return `${header} Focus on typing without looking at the keyboard and gradually increasing your speed. Don't worry about a few mistakes.`
  }
  else if (accuracy < 0.95) {
    return `${header} Focus on improving your accuracy, even if it slows you down slightly.`
  }
  else if (wpm_percentile <= accuracy_percentile) {
    return `${header} Focus on increasing your speed, even if it means making a few more mistakes.`
  }
  else {
    return `${header} Focus on refining your accuracy and maintaining consistency.`
  }
}

function suggestRepetitionStrategy(){
  prev_reps = runHistory.slice(session_rep_count - 5, session_rep_count);
  const wpm = prev_reps.reduce((sum, run) => sum + run.wpm, 0) / prev_reps.length;
  const accuracy = prev_reps.reduce((sum, run) => sum + run.accuracy, 0) / prev_reps.length / 100;
  const wpm_percentile = gammaCDF(wpm, WPM_DISTRIBUTION_PARAMS.a, WPM_DISTRIBUTION_PARAMS.loc, WPM_DISTRIBUTION_PARAMS.scale);
  const error_rate_percentile = betaCDF(1 - accuracy, ERROR_RATE_DISTRIBUTION_PARAMS.a, ERROR_RATE_DISTRIBUTION_PARAMS.b, ERROR_RATE_DISTRIBUTION_PARAMS.loc, ERROR_RATE_DISTRIBUTION_PARAMS.scale);
  const accuracy_percentile = 1 - error_rate_percentile;
  return _suggestRepetitionStrategy(wpm, accuracy, wpm_percentile, accuracy_percentile);
}

let DEFAULT_PASSAGES = [
  "Your personal typing coach, typo dojo, identifies your performance gaps and delivers targeted drills to boost your typing skills.",
  "While other apps force you to type random sequences of words, typo dojo immerses you in the authentic flow of language using sentences from trusted sources like Wikipedia.",
  "In today's digital age, exceptional touch typing is a game-changer. Every minute spent training with typo dojo makes you faster and more accurate."
].map(passage => ({passage, source: 'default'}));

let FALLBACK_PASSAGES = [
  'Tungsten is essential for some archaea. The following tungsten-utilizing enzymes are known:',
  'A dialdehyde is an organic chemical compound with two aldehyde groups. The nomenclature of dialdehydes have the ending -dial or sometimes -dialdehyde. Short aliphatic dialdehydes are sometimes named after the diacid from which they can be derived.',
  'The two-point form of the equation of a line can be expressed simply in terms of a determinant. There are two common ways for that.',
  'Alabama is 30th in size and borders four U.S. states: Mississippi, Tennessee, Georgia, and Florida. It also borders the Gulf of Mexico.',
  'The active end of a line used in making the knot. May also be called the "running end", "live end", or "tag end".',
  'Some aldehydes are substrates for aldehyde dehydrogenase enzymes which metabolize aldehydes in the body. There are toxicities associated with some aldehydes that are related to neurodegenerative disease, heart disease, and some types of cancer.',
  'Khan Tokhtamysh of the White Horde dethrones Mamai of the Blue Horde. The two hordes unite to form the Golden Horde.',
  'Disulfiram prevents the elimination of acetaldehyde by inhibiting the enzyme acetaldehyde dehydrogenase. Acetaldehyde is a chemical the body produces when breaking down ethanol. Acetaldehyde itself is the cause of many hangover symptoms from alcohol use.',
  "Barnett Jr., James F. Mississippi's American Indians. Jackson, MS: University Press of Mississippi, 2012.",
  'Aldehydes have properties that are diverse and that depend on the remainder of the molecule. Smaller aldehydes such as formaldehyde and acetaldehyde are soluble in water, and the volatile aldehydes have pungent odors.',
  'PROL An embeddable Prolog engine for Java. It includes a small IDE and a few libraries.',
  'A preordered class is a class equipped with a preorder. Every set is a class and so every preordered set is a preordered class.'
].map(passage => ({passage, source: 'fallback'}))
 
let finishedDefaultPassages = false;
let upcomingDefaultPassages = DEFAULT_PASSAGES;
let upcomingPassages = upcomingDefaultPassages;
let currentPassageErrors = [];
let currentPassageErrorActualChar = [];
let user_intro_acc = Math.random() * (0.1 - 0.05) + 0.05;
let user_intro_wpm = Math.floor(Math.random() * (70 - 29 + 1)) + 29;
let session_rep_count = 0;
let predictiveErrorHighlight = localStorage.getItem('predictiveErrorHighlight') !== 'false';
let showStatsEvery5thRepetition = localStorage.getItem('showStatsEvery5thRepetition') === 'true';
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

let charErrorCount = 0;
let charTotalCount = 0;
let prevInputText = "";
let bgFlashOnError = false;
let userId = "";
let runHistory = [];
const MAX_HISTORY = 20;
let stats_rep_shown = false;
const lengthToNgram = {
  1: 'char',
  2: 'bigram',
  3: 'trigram',
  4: 'quadgram'
};
const ERROR_RATE_DISTRIBUTION_PARAMS = {
  a: 1.7202,
  b: 14.9972,
  loc: 0.0000,
  scale: 1.0000
}
const WPM_DISTRIBUTION_PARAMS = {
  a: 8.1095,
  loc: -9.3006,
  scale: 5.3861
}
let toHighlight = [];
let tooltip = null;

// Add after other global variables
let darkMode = localStorage.getItem('darkMode') !== 'false';
let settingsOpen = false;
let soundOnError = false;
const errorSound = document.getElementById('errorSound');
let recentPassages = JSON.parse(localStorage.getItem('recentPassages')) || [];
const MAX_RECENT_PASSAGES = 70;
let currentPassageSource = localStorage.getItem('passageSource') || 'wikipedia';
let passageWorker = new Worker('passageWorker.js');
passageWorker.postMessage({
  type: 'sourceChange',
  source: currentPassageSource
});
let settingTargetTextRef={value: false};

let startTime = null;
let targetText = 'Your personal typing coach, typo dojo, identifies your performance gaps and delivers targeted drills to boost your typing skills.';
const textDisplay = document.getElementById('textDisplay');
const inputArea = document.getElementById('inputArea');
const progressBar = document.getElementById('progressBar');

function recordUserLeaveText() {
  const data = { 
    uid: userId,
    passage: targetText,
    errors: currentPassageErrors,
    errorChars: currentPassageErrorActualChar,
    source: currentPassageSource,
    timeTakenMs: (new Date() - startTime)
  }
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '') {
    navigator.sendBeacon('https://7awaj14h9h.execute-api.eu-west-2.amazonaws.com/default/record-user-leave-text', JSON.stringify(data));
  }
}
  
window.addEventListener('beforeunload', recordUserLeaveText);


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
  const data = {
    userId: userId,
    passage: targetText, 
    source: currentPassageSource,
    errors: currentPassageErrors,
    errorChars: currentPassageErrorActualChar,
    timeTakenMs: (new Date() - startTime)
  }
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '') {
    const to_save = JSON.stringify(data);
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

function recordUserIntro() {
  if (runHistory.length != 3) {
    console.error("runHistory.length != 3 (", runHistory.length, ")");
    return;
  }
  
  const prevRuns = runHistory.slice(0, 3);
  const avgWPM = prevRuns.length > 0 ? 
    prevRuns.reduce((sum, run) => sum + run.wpm, 0) / prevRuns.length : 0;
  const avgAccuracy = prevRuns.length > 0 ? 
    prevRuns.reduce((sum, run) => sum + run.accuracy, 0) / prevRuns.length : 0;
  if (avgAccuracy > 30 && avgAccuracy <= 100 && avgWPM > 5 && avgWPM <= 150) {
    user_intro_acc = avgAccuracy / 100;
    user_intro_wpm = avgWPM;
    localStorage.setItem('user_intro_acc', user_intro_acc);
    localStorage.setItem('user_intro_wpm', user_intro_wpm);
  }
}


function getPassage() {
  if (!finishedDefaultPassages) {
    const nextPassage = upcomingDefaultPassages.shift();
    if (!nextPassage) {
      finishedDefaultPassages = true;
      recordUserIntro();
      document.getElementById('settings-speech-bubble').classList.add('visible');
      setTimeout(() => {
        document.getElementById('settings-speech-bubble').classList.remove('visible');
      }, 30000);
    }
    else {
      return nextPassage;
    }
  }
  if (session_rep_count == 5 && stats_rep_shown == false || (showStatsEvery5thRepetition && session_rep_count % 5 == 0 && session_rep_count != 0)) {
    stats_rep_shown = true;
    return {
      passage: suggestRepetitionStrategy(),
      source: "stats_rep"
    };
  }
  
  let nextPassage = upcomingPassages.shift();
  // Fall back in the ccase where upcomingPassagest is empty. Need to work out why.
  if (!nextPassage) {
    nextPassage = FALLBACK_PASSAGES[Math.floor(Math.random() * FALLBACK_PASSAGES.length)];
  }
  while (recentPassages.includes(nextPassage.passage)) {
    nextPassage = upcomingPassages.shift();
    if (!nextPassage) {
      nextPassage = FALLBACK_PASSAGES[Math.floor(Math.random() * FALLBACK_PASSAGES.length)];
      return nextPassage;
    }
    if (upcomingPassages.length == 0) {
      return nextPassage;
    }
  }
  console.log("get passage", "---", nextPassage.passage, "---", targetText);
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
    user_intro_acc,
    user_intro_wpm,
    highlight_error_pct: 0.1,
    userId: userId
  });
  console.log(`Time taken to send message to worker: ${performance.now() - startTime}ms`);
  
  setTimeout(() => {
    setUpcomingPassages();
  }, 7_000);
}

passageWorker.onmessage = function(e) {
  try {
    if (e.data.type == 'error') {
      console.error(e.data.error);
      return;
    }
    upcomingPassages = e.data;
    // refilter here because of race conditions
    upcomingPassages = upcomingPassages.filter(passage => !recentPassages.includes(passage.passage));
    localStorage.setItem('upcomingPassages', JSON.stringify(upcomingPassages));
  } catch (error) {
    console.error('Error handling worker message:', error);
    // The console.error override will handle logging to S3
  }
};

// Add error handler for worker errors
passageWorker.onerror = function(error) {
  console.error('Worker error:', JSON.stringify(error));
  // The console.error override will handle logging to S3
};


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

  user_intro_acc = localStorage.getItem('user_intro_acc') ? parseFloat(localStorage.getItem('user_intro_acc')) : user_intro_acc;
  user_intro_wpm = localStorage.getItem('user_intro_wpm') ? parseFloat(localStorage.getItem('user_intro_wpm')) : user_intro_wpm;
  
  upcomingPassages = JSON.parse(localStorage.getItem('upcomingPassages')) || DEFAULT_PASSAGES;
  // backwards compatibility
  if (upcomingPassages.length > 0 && typeof upcomingPassages[0] === 'string') {
    upcomingPassages = upcomingPassages.map(passage => ({passage, source: 'unknown'}));
  }
  const p = getPassage();
  const {passage, source, highlightIndecies} = p;
  console.log(p);
  targetText = passage;
  currentPassageSource = source;
  toHighlight = highlightIndecies;
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
  else {
    document.documentElement.setAttribute('data-theme', 'light');
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
    document.querySelector('#settingsDropdown').classList.toggle('active');
    if (document.getElementById('settings-speech-bubble').classList.contains('visible')) {
      document.getElementById('settings-speech-bubble').classList.remove('visible');
    }
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

  const predictiveErrorHighlightToggle = document.getElementById('predictiveErrorHighlightToggle');
  predictiveErrorHighlightToggle.checked = localStorage.getItem('predictiveErrorHighlight') !== 'false';
  predictiveErrorHighlight = predictiveErrorHighlightToggle.checked;

  predictiveErrorHighlightToggle.addEventListener('change', (e) => {
    predictiveErrorHighlight = e.target.checked;
    localStorage.setItem('predictiveErrorHighlight', predictiveErrorHighlight);
  });

  const showStatsEvery5thRepetitionToggle = document.getElementById('showStatsEvery5thRepetition');
  showStatsEvery5thRepetitionToggle.checked = localStorage.getItem('showStatsEvery5thRepetition') === 'true';
  showStatsEvery5thRepetition = showStatsEvery5thRepetitionToggle.checked;

  showStatsEvery5thRepetitionToggle.addEventListener('change', (e) => {
    showStatsEvery5thRepetition = e.target.checked;
    localStorage.setItem('showStatsEvery5thRepetition', showStatsEvery5thRepetition);
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
  if (cps == "default" || !cps || cps == "unknown") {
    cps = "wikipedia";
  }
  if (document.querySelector(`input[name="passageSource"][value="${cps}"]`)) {
    document.querySelector(`input[name="passageSource"][value="${cps}"]`).checked = true;
  }

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


function renderText() {
  let words = targetText.split(" ");
  let wordStartIndecies = [];
  
  for (let i = 0; i < words.length; i++) {
    wordStartIndecies.push(targetText.indexOf(words[i]) + i);
  }
  
  let html = '';
  
  for (let i = 0; i < targetText.length; i++) {
    let char = targetText[i];
    let highlight = toHighlight?.includes(i) && predictiveErrorHighlight;
    if (char === " ") {
      html += `<span id="char-${i}" class="letter space">&nbsp;</span></span><span class="word">`;
    } else {
      html += `<span id="char-${i}" class="letter ${highlight ? 'highlight' : ''}">${char}</span>`;
    }
  }
  textDisplay.innerHTML = html;
}

renderText();

function colorText(inputText)
{
  
  for (let i = 0; i < targetText.length; i++) {
    
    const targetLetter = targetText[i];
    const charSpan = document.getElementById(`char-${i}`);
    let currentClasses = charSpan.className.replace(' correct', '').replace(' error', '').replace(' cursor', '') || '';
    if (!predictiveErrorHighlight) {
      currentClasses = currentClasses.replace('highlight', '');
      charSpan.className = currentClasses;
    }

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
      if (!currentClasses.includes('highlight')) {
        currentClasses = currentClasses;
      }
      charSpan.className = currentClasses.replace('highlight', '').replace('letter', 'letter correct');

    } else {
      charSpan.className = currentClasses.replace('letter', 'letter error');
    }
  }
  const NextChar = document.getElementById(`char-${inputText.length}`);
  if (NextChar) {
    NextChar.className = NextChar.className.replace('letter', 'letter cursor');
  }
}

document.addEventListener('keydown', (e) => {
  inputArea.focus();
  if (e.key === 'Tab') {
    e.preventDefault();
  }
});

function handleInput(e) {
  if (settingTargetTextRef.value) {
    return;
  }
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
      currentPassageErrorActualChar.push(typedChar);
      
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
    settingTargetTextRef.value = true;
    setTimeout(() => {
      settingTargetTextRef.value = false;
      session_rep_count++;
      updateLiveMetrics();
      resetSession();
    }, 500); // brief pause before resetting
    trackRepetitionCompletion();
  }


  document.getElementById('topErrors').innerHTML = topErrorsToHtmlTable();
}
inputArea.addEventListener('input', handleInput);

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
  const timeElapsedMins = (new Date() - startTime) / 60000; // minutes
  const charsPerWord = 4.7;
  let rawWpm = charTotalCount / charsPerWord / timeElapsedMins;
  let wpm = Math.round(rawWpm);
  const rawErrRate = charErrorCount / charTotalCount;
  const errRate_percentile = betaCDF(rawErrRate, ERROR_RATE_DISTRIBUTION_PARAMS.a, ERROR_RATE_DISTRIBUTION_PARAMS.b, ERROR_RATE_DISTRIBUTION_PARAMS.loc, ERROR_RATE_DISTRIBUTION_PARAMS.scale);
  const wpm_percentile = gammaCDF(rawWpm, WPM_DISTRIBUTION_PARAMS.a, WPM_DISTRIBUTION_PARAMS.loc, WPM_DISTRIBUTION_PARAMS.scale);
  let accuracy = Math.round((1-rawErrRate) * 100);
  wpm = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
  accuracy = isNaN(accuracy) || !isFinite(accuracy) ? 100 : accuracy;
  return { wpm, accuracy, errRate_percentile, wpm_percentile };
}

function updateLiveMetrics() {
  const metrics = calculateMetrics();
  const wpm = metrics.wpm;
  const accuracy = metrics.accuracy;
  document.getElementById('wpm').textContent = `WPM: ${wpm}`;
  document.getElementById('accuracy').textContent = `Accuracy: ${accuracy}%`;
  if (session_rep_count > 0) {
    document.getElementById('session_rep_count').textContent = `Reps: ${session_rep_count}`;
    document.getElementById('session_rep_count').style.display = 'block';
  }
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
  currentPassageErrorActualChar = [];
  // Add current passage to recent list
  if (targetText) {
    recentPassages.unshift(targetText);
    recentPassages = recentPassages.slice(0, MAX_RECENT_PASSAGES);
    localStorage.setItem('recentPassages', JSON.stringify(recentPassages));
  }
  
  const {passage, source, highlightIndecies} = getPassage();
  targetText = passage;
  currentPassageSource = source;
  toHighlight = highlightIndecies;
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
// Store original console.error to avoid infinite loops
const originalConsoleError = console.error;

// Centralized error logging function
function logErrorToS3(error, source = 'main_app') {
  try {
    if (window.location.hostname === 'localhost' || window.location.hostname === '') {
      originalConsoleError('Error would be sent to S3:', error);
      return;
    }

    const errorData = {
      uid: userId,
      timestamp: new Date().toISOString(),
      error: {
        message: error.message,
        stack: error.stack,
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
        type: error.type || 'unknown_error'
      },
      userAgent: navigator.userAgent,
      url: window.location.href,
      source: source
    };

    navigator.sendBeacon('https://214nbnmwmc.execute-api.eu-west-2.amazonaws.com/default/error-log', JSON.stringify(errorData));
  } catch (sendError) {
    originalConsoleError('Failed to send error to S3:', sendError);
  }
}

// Override console.error to automatically log all errors
console.error = function(...args) {
  // Call original console.error first
  originalConsoleError.apply(console, args);
  
  try {
    // Only log to S3 if it looks like an actual Error object or error message
    const firstArg = args[0];
    if (firstArg instanceof Error) {
      logErrorToS3({
        message: firstArg.message,
        stack: firstArg.stack,
        filename: 'unknown',
        lineno: 0,
        colno: 0,
        type: 'console_error_object'
      });
    } else if (typeof firstArg === 'string' && (
      firstArg.toLowerCase().includes('error') || 
      firstArg.toLowerCase().includes('failed') ||
      firstArg.toLowerCase().includes('exception')
    )) {
      logErrorToS3({
        message: args.join(' '),
        stack: new Error().stack,
        filename: 'unknown',
        lineno: 0,
        colno: 0,
        type: 'console_error_string'
      });
    }
  } catch (interceptError) {
    originalConsoleError('Error in console.error interceptor:', interceptError);
  }
};

// Global error handler for the main app
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // The console.error override will handle logging to S3
});

// Global unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // The console.error override will handle logging to S3
});

window.addEventListener('load', () => {
  document.getElementById('resetStats').addEventListener('click', resetStats);
});