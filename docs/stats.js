
// Add lgamma function (Lanczos approx)
Math.lgamma = function (z) {
  const cof = [
    76.18009172947146, -86.50532032941677,
    24.01409824083091, -1.231739572450155,
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

// Add logBeta approximation
Math.logBeta = function (a, b) {
  return Math.lgamma(a)[0] + Math.lgamma(b)[0] - Math.lgamma(a + b)[0];
}
// Lanczos approximation of log-gamma function
function logGamma(z) {
  const cof = [
    76.18009172947146, -86.50532032941677,
    24.01409824083091, -1.231739572450155,
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
const getBestGuessTimeToTypeLetter = (speedLog) => {
  const timeToTypeLetter = {}
  for (let letter in speedLog['char']) {
    const priorStd = HYPERPARAMS["LETTER_SPEED_STD"][letter];
    const priorMean = HYPERPARAMS["LETTER_SPEED_MEAN"][letter];
    const priorVar = priorStd ** 2;

    const speeds = (speedLog["char"][letter] || []).filter(x => x > 0);
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


function generateStatsData() {  
  // Calculate summary data
  // Try getting runHistory from localStorage. The property for each session might be 'timestamp' or 'startTime'.
  let runHistory = JSON.parse(localStorage.getItem('runHistory')) || [];

  runHistory = runHistory.sort((a, b) => Date.parse(a.startTime) - Date.parse(b.startTime));

  const summaryData = calculateSummaryData(runHistory);
  
  // Calculate time series data
  const wpmOverTime = calculateWPMOverTime(runHistory);
  const accuracyOverTime = calculateAccuracyOverTime(runHistory);
  
  // Calculate per-letter statistics
  const speedPerLetter = calculateSpeedPerLetter();
  const accuracyPerLetter = calculateAccuracyPerLetter();
  const predictedCPMChar = calculatePredictedCPMChar();
  
  // Calculate bigram errors
  const bigramErrors = calculateBigramErrors();
  
  return {
    summaryData,
    bigramErrors,
    statsData: {
      wpmOverTime,
      accuracyOverTime,
      speedPerLetter,
      accuracyPerLetter,
      predictedCPMChar: predictedCPMChar
    }
  };
}

function calculateSummaryData(runHistory) {
  const totalSessions = runHistory.length;
  
  // Calculate total time (assuming each session has duration in seconds)
  const totalMilliseconds = runHistory.reduce((sum, session) => sum + (session.duration || 0), 0);
  const totalSeconds = totalMilliseconds / 1000;
  const totalHours = (totalSeconds / 3600).toFixed(1);
  const totalTime = `${totalHours}h`;
  
  // Calculate current streak (consecutive days with at least one session)
  const currentStreak = calculateStreak(runHistory);
  
  return {
    totalSessions,
    totalTime,
    currentStreak
  };
}

function calculateStreak(sessions) {
  if (sessions.length === 0) return 0;
  
  // Sort sessions by timestamp (most recent first)
  const sortedSessions = [...sessions].sort((a, b) => b.timestamp - a.timestamp);
  
  // Get unique days
  const days = new Set();
  sortedSessions.forEach(session => {
    const date = new Date(session.timestamp);
    const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    days.add(dayKey);
  });
  
  const sortedDays = Array.from(days).sort().reverse();
  
  // Count consecutive days from today
  let streak = 0;
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  
  for (let i = 0; i < sortedDays.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    const expectedKey = `${expectedDate.getFullYear()}-${expectedDate.getMonth()}-${expectedDate.getDate()}`;
    
    if (sortedDays[i] === expectedKey) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateWPMOverTime(runHistory) {
  const measured = [];
  const estimate = [];
  
  for (let i = 0; i < runHistory.length; i += 1) {
    const session = runHistory[i];
    if (session.wpm) {
      const wpm_percentile = gammaCDF(session.wpm, HYPERPARAMS.WPM_DISTRIBUTION_PARAMS.a, HYPERPARAMS.WPM_DISTRIBUTION_PARAMS.loc, HYPERPARAMS.WPM_DISTRIBUTION_PARAMS.scale);
      measured.push({
        session: i + 1,
        value: Math.round(session.wpm),
        percentile: Math.round(wpm_percentile*100)
      });
      
      // Estimate is slightly smoothed
      // estimate.push({
      //   session: i + 1,
      //   value: Math.round((session.wpmEstimate || session.wpm) * 0.98)
      // });
    }
  }
  
  return { measured, estimate };
}

function calculateAccuracyOverTime(runHistory) {
  
  const measured = [];
  const estimate = [];
  
  const sampleInterval = 1; //Math.max(1, Math.floor(runHistory.length / 50));
  
  for (let i = 0; i < runHistory.length; i += sampleInterval) {
    const session = runHistory[i];
    if (session.accuracy !== undefined) {
      const errRate_percentile = betaCDF(1-session.accuracy/100, HYPERPARAMS.ERROR_RATE_DISTRIBUTION_PARAMS.a, HYPERPARAMS.ERROR_RATE_DISTRIBUTION_PARAMS.b, HYPERPARAMS.ERROR_RATE_DISTRIBUTION_PARAMS.loc, HYPERPARAMS.ERROR_RATE_DISTRIBUTION_PARAMS.scale);
      console.log(errRate_percentile, session.accuracy);
      measured.push({
        session: i + 1,
        value: Math.round(session.accuracy * 100) / 100,
        percentile: Math.round((1-errRate_percentile)*100)
      });
      
      estimate.push({
        session: i + 1,
        value: Math.round((session.accuracyEstimate || session.accuracy) * 100) / 100
      });
    }
  }
  
  return { measured, estimate };
}

function calculateSpeedPerLetter() {
  const speedPerLetter = {};
  // Aggregate character-level speed data
  const speedLog = JSON.parse(localStorage.getItem('speedLog')) || {"char":{}};
  const timeToTypeLetter = getBestGuessTimeToTypeLetter(speedLog);
  for (const [char, ttt] of Object.entries(timeToTypeLetter)) { 
    if(isNaN(ttt)) {
      continue;
    }           
    speedPerLetter[char] = {
      user: Math.round(60 / ttt),
      expected: 0,//Math.round(expectedSpeed)
    };
  }
  return speedPerLetter;
}

function calculateAccuracyPerLetter() {
  const errorLog = JSON.parse(localStorage.getItem('errorLog')) || {"char":{}};
  const seenLog = JSON.parse(localStorage.getItem('seenLog')) || {"char":{}};
  const charSeen = seenLog.char || {};
  const charError = errorLog.char || {};
  const accuracyPerLetter = {};
  
  for (const [char, errorCount] of Object.entries(charError)) {
    const seenCount = charSeen[char] || 0;
    if (seenCount > 0) {
      const errorRate = findMAP(
        HYPERPARAMS["LETTER_MEAN_RATE"][char],
        HYPERPARAMS["LETTER_STD"][char],
        errorCount,
        seenCount,
        1e-10,
        30,
        false // verbose
      )
      if (isNaN(errorRate)) {
        continue;
      }
      accuracyPerLetter[char] = {
        user: ((1-errorRate)*100).toFixed(1),
        expected: 0//Math.round(expectedAccuracy)
      };
    }
  }
  return accuracyPerLetter;
}

function calculateBigramErrors() {
  const errorLog = JSON.parse(localStorage.getItem('errorLog')) || {"bigram":{}};
  const seenLog = JSON.parse(localStorage.getItem('seenLog')) || {"bigram":{}};
  const bigramError = errorLog.bigram || {};
  const bigramSeen = seenLog.bigram || {};
  
  // Convert to array and sort by error count
  const errors = Object.entries(bigramError)
    .map(([bigram, errorCount]) => ({
      bigram,
      errorCount,
      errorRate: errorCount / (bigramSeen[bigram] || 1),
      errorCost: (errorCount / (bigramSeen[bigram] || 1))^2 * errorCount
    }))
    .sort((a, b) => b.errorCost - a.errorCost)
    .slice(0, 8); // Top 8
  
  return errors;
}

// Helper function to initialize demo data for testing
function initializeDemoData() {
  const demoData = {
    sessions: [],
    letterStats: {},
    bigramErrors: {}
  };
  
  // Create 30 demo sessions
  const now = Date.now();
  for (let i = 0; i < 30; i++) {
    const dayOffset = Math.floor(i / 4.3); // ~4 sessions per day
    const timestamp = now - (dayOffset * 24 * 60 * 60 * 1000);
    
    demoData.sessions.push({
      timestamp,
      wpm: 42 + (i * 0.87), // Gradual improvement
      accuracy: 88 + (i * 0.3),
      duration: 120 + Math.random() * 180,
      wpmEstimate: 40 + (i * 0.85),
      accuracyEstimate: 87 + (i * 0.29),
      wpmPercentile: 55 + Math.floor(i * 0.7),
      accuracyPercentile: 65 + Math.floor(i * 0.65)
    });
  }
  
  // Create letter stats
  const letters = 'abcdefghijklmnopqrstuvwxyz0123456789 ';
  letters.split('').forEach(char => {
    const baseSpeed = 50 + Math.random() * 30;
    const baseAccuracy = 85 + Math.random() * 12;
    
    demoData.letterStats[char] = {
      count: Math.floor(100 + Math.random() * 200),
      correct: 0, // Will calculate
      totalSpeed: 0,
      expectedSpeed: baseSpeed * 0.92,
      expectedAccuracy: baseAccuracy * 0.97
    };
    
    const stats = demoData.letterStats[char];
    stats.correct = Math.floor(stats.count * (baseAccuracy / 100));
    stats.totalSpeed = stats.count * baseSpeed;
  });
  
  // Create bigram errors
  const commonBigrams = ['th', 'he', 'in', 'er', 'an', 'on', 'at', 'en', 'ed', 'nd'];
  commonBigrams.forEach((bigram, i) => {
    demoData.bigramErrors[bigram] = {
      errors: 23 - (i * 1.5),
      errorRate: 8.2 - (i * 0.5)
    };
  });
  
  localStorage.setItem('typingStats', JSON.stringify(demoData));
  console.log('Demo data initialized in localStorage');
}

function estimatedWPM() {
  const runHistory = JSON.parse(localStorage.getItem('runHistory')) || [];
  let ewm_wpm = null;
  const com = 5;
  const alpha = 1 / (1 + com);

  for (let i = 0; i < runHistory.length; i++) {
    if (ewm_wpm === null) {
      ewm_wpm = runHistory[i].wpm;
    }
    else {
      ewm_wpm = alpha * runHistory[i].wpm + (1 - alpha) * ewm_wpm;
    }
  }
  console.log("ewm_wpm", ewm_wpm)
  return ewm_wpm;
}
function wpm_to_letter_time_model(wpm, a, b, c, k) {
  return a / ((wpm + c) ** k) + b
}

function calculatePredictedCPMChar() {
  const ewpm = estimatedWPM();
  const letterFrequency = HYPERPARAMS.LETTER_FREQUENCY;
  const timeToType = {};
  let total_timeToType = 0;
  for (const char in letterFrequency) {
    const modelParams = HYPERPARAMS.WPM_TO_TYPE_TIME[char];
    timeToType[char] = wpm_to_letter_time_model(ewpm, modelParams.a, modelParams.b, modelParams.c, modelParams.k);
    total_timeToType += letterFrequency[char] * timeToType[char];
  }
  const wpm_pred = 60 / total_timeToType / 5;
  // For extreme outliers this prior can be a bit off and so we just adjust it to make it more accurate.
  const adjustment = ewpm / wpm_pred;

  const predictedCPMChar = {};  
  for (const char in letterFrequency) {
    predictedCPMChar[char] = 60 / (timeToType[char] * adjustment);
  }
  return predictedCPMChar;
}

// Character frequency order (most to least common in actual typing data)
const letterFrequencyOrder = [' ', 'e', 'a', 't', 'i', 'o', 'n', 's', 'r', 'h', 'l', 'd', 'c', 'u', 'm', 'p', 'f', 'g', 'y', 'b', 'w', '.', ',', 'v', 'k', 'T', '1', '0', 'S', 'C', '2', 'A', 'I', '9', 'M', 'P', 'B', 'H', "'", ')', '(', '-', 'D', 'R', 'N', 'F', 'W', 'L', 'x', '8', 'G', 'U', '3', 'E', '"', 'J', '5', 'O', '6', '7', '4', 'q', ':', 'z', 'j', 'K', 'V', 'Y', ';', 'Z', 'Q', '?', 'X', '!']

// Function to create line chart
function createLineChart(svgId, data, yLabel, yMin, yMax) {
  if (data.measured.length === 0) {
    return;
  }
  const svg = document.getElementById(svgId);
  const container = svg.parentElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  const padding = { top: 30, right: 30, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Clear existing content
  svg.innerHTML = '';
  
  // Create grid lines
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padding.left);
    line.setAttribute('y1', y);
    line.setAttribute('x2', padding.left + chartWidth);
    line.setAttribute('y2', y);
    line.setAttribute('class', 'grid-line');
    gridGroup.appendChild(line);
    
    // Y-axis labels
    const value = yMax - ((yMax - yMin) / 5) * i;
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', padding.left - 10);
    label.setAttribute('y', y + 4);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('class', 'axis-label');
    label.textContent = Math.round(value);
    gridGroup.appendChild(label);
  }
  svg.appendChild(gridGroup);
  
  // Function to convert data to SVG coordinates
  function toX(session) {
    const maxSession = Math.max(...data.measured.map(d => d.session));
    return padding.left + (session / maxSession) * chartWidth;
  }
  
  function toY(value) {
    return padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
  }
  
  // Draw estimate line
  const estimatePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const estimatePathData = data.estimate.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${toX(d.session)} ${toY(d.value)}`
  ).join(' ');
  estimatePath.setAttribute('d', estimatePathData);
  estimatePath.setAttribute('class', 'chart-line-estimate');
  svg.appendChild(estimatePath);
  
  // Draw measured line
  const measuredPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const measuredPathData = data.measured.map((d, i) => 
    `${i === 0 ? 'M' : 'L'} ${toX(d.session)} ${toY(d.value)}`
  ).join(' ');
  measuredPath.setAttribute('d', measuredPathData);
  measuredPath.setAttribute('class', 'chart-line-measured');
  svg.appendChild(measuredPath);
  
  // Draw points with tooltips
  const tooltip = document.getElementById(svgId.replace('chart', 'tooltip'));
  
  data.measured.forEach(d => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', toX(d.session));
    circle.setAttribute('cy', toY(d.value));
    circle.setAttribute('r', 5);
    circle.setAttribute('fill', '#4a9eff');
    circle.setAttribute('class', 'chart-point');
    
    circle.addEventListener('mouseenter', (e) => {
      tooltip.textContent = `Session ${d.session}: ${d.value} ${yLabel} (${d.percentile}th percentile)`;
      tooltip.classList.add('visible');
    });
    
    circle.addEventListener('mousemove', (e) => {
      // Get the bounding rect of the container (chart-container)
      const container = svg.parentElement;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate position relative to the container
      let left = e.clientX - containerRect.left;
      let top = e.clientY - containerRect.top - 30;
      
      // Get tooltip dimensions to prevent it from going off-screen
      const tooltipRect = tooltip.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // Adjust horizontal position if tooltip would go off right edge
      if (left + tooltipRect.width > containerWidth) {
        left = e.clientX - containerRect.left - tooltipRect.width - 10;
      }
      
      // Adjust vertical position if tooltip would go off top edge
      if (top < 0) {
        top = e.clientY - containerRect.top + 10;
      }
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
    
    circle.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
    
    svg.appendChild(circle);
  });
}

// Function to create bar chart for letters
function createLetterBarChart(svgId, data, expected, unit, yMin, yMax, shouldShowExpectedLine) {
  const svg = document.getElementById(svgId);
  const container = svg.parentElement;
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  
  const padding = { top: 30, right: 30, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  // Clear existing content
  svg.innerHTML = '';
  
  // Sort letters by frequency and limit to top 50 most common
  let sortedLetters;
  if (expected && Object.keys(expected).length > 30){
    sortedLetters = Object.keys(expected).filter(letter => data[letter] && letter !== ' ').sort((a, b) => expected[b] - expected[a]).slice(0, 30);
  } else {
    sortedLetters = letterFrequencyOrder.filter(letter => data[letter] && letter !== ' ').slice(0, 30);
  }

  const barWidth = chartWidth / sortedLetters.length;
  const barPadding = barWidth * 0.2;
  const effectiveBarWidth = barWidth - barPadding;
  
  // Create grid lines
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  for (let i = 0; i <= 5; i++) {
    const y = padding.top + (chartHeight / 5) * i;
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padding.left);
    line.setAttribute('y1', y);
    line.setAttribute('x2', padding.left + chartWidth);
    line.setAttribute('y2', y);
    line.setAttribute('class', 'grid-line');
    gridGroup.appendChild(line);
    
    // Y-axis labels
    const value = yMax - ((yMax - yMin) / 5) * i;
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', padding.left - 10);
    label.setAttribute('y', y + 4);
    label.setAttribute('text-anchor', 'end');
    label.setAttribute('class', 'axis-label');
    label.textContent = Math.round(value);
    gridGroup.appendChild(label);
  }
  svg.appendChild(gridGroup);
  
  // Function to convert value to Y coordinate
  function toY(value) {
    return padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight;
  }
  
  const tooltip = document.getElementById(svgId.replace('chart', 'tooltip'));
  
  // Store label elements for magnification effect
  const labelElements = [];
  const labelPositions = [];
  
  // Draw bars for user data
  sortedLetters.forEach((letter, i) => {
    const x = padding.left + i * barWidth + barPadding / 2;
    const letterData = data[letter];
    // User bar
    const userHeight = (letterData.user / yMax) * chartHeight;
    const userBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    userBar.setAttribute('x', x);
    userBar.setAttribute('y', toY(letterData.user));
    userBar.setAttribute('width', effectiveBarWidth);
    userBar.setAttribute('height', userHeight);
    userBar.setAttribute('class', 'letter-bar letter-bar-user');
    userBar.setAttribute('rx', '3');
    
    // Add tooltip to user bar
    userBar.addEventListener('mouseenter', (e) => {
      const expectedValue = expected && expected[letter];
      const displayChar = letter === ' ' ? 'SPACE' : letter;
      if (shouldShowExpectedLine && expectedValue !== undefined) {
        tooltip.textContent = `${displayChar}: ${letterData.user}${unit} (expected: ${Math.round(expectedValue)}${unit})`;
      } else {
        tooltip.textContent = `${displayChar}: ${letterData.user}${unit}`;
      }
      tooltip.classList.add('visible');
    });
    
    userBar.addEventListener('mousemove', (e) => {
      // Get the bounding rect of the container (chart-container or letter-chart-container)
      const container = svg.parentElement;
      const containerRect = container.getBoundingClientRect();
      
      // Calculate position relative to the container
      let left = e.clientX - containerRect.left;
      let top = e.clientY - containerRect.top - 30;
      
      // Get tooltip dimensions to prevent it from going off-screen
      const tooltipRect = tooltip.getBoundingClientRect();
      const containerWidth = containerRect.width;
      
      // Adjust horizontal position if tooltip would go off right edge
      if (left + tooltipRect.width > containerWidth) {
        left = e.clientX - containerRect.left - tooltipRect.width - 10;
      }
      
      // Adjust vertical position if tooltip would go off top edge
      if (top < 0) {
        top = e.clientY - containerRect.top + 10;
      }
      
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
    });
    
    userBar.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
    
    svg.appendChild(userBar);
    
    // X-axis label (letter)
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const labelX = x + effectiveBarWidth / 2;
    const labelY = height - padding.bottom + 15;
    label.setAttribute('x', labelX);
    label.setAttribute('y', labelY);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'x-axis-label');
    label.setAttribute('data-index', i);
    label.setAttribute('data-base-x', labelX);
    // Display special characters with readable names
    const displayChar = letter === ' ' ? 'SPC' : letter;
    label.textContent = displayChar;
    svg.appendChild(label);
    
    labelElements.push(label);
    labelPositions.push({ baseX: labelX, currentX: labelX });
  });
  
  // Add magnification effect on bar hover
  function updateLabelMagnification(hoverIndex) {
    sortedLetters.forEach((letter, i) => {
      const label = labelElements[i];
      const distance = Math.abs(i - hoverIndex);
      
      // Calculate magnification based on distance
      let scale = 1;
      if (distance === 0) {
        scale = 2.5; // Hovered label
      } else if (distance === 1) {
        scale = 1.8; // Adjacent labels
      } else if (distance === 2) {
        scale = 1.4; // Two steps away
      } else if (distance === 3) {
        scale = 1.2; // Three steps away
      }
      
      // Apply font size
      const baseFontSize = 8;
      label.style.fontSize = `${baseFontSize * scale}px`;
      
      // Highlight hovered label
      if (distance === 0) {
        label.style.fill = 'var(--text-color)';
        label.style.fontWeight = '600';
      } else {
        label.style.fill = 'var(--text-muted)';
        label.style.fontWeight = '400';
      }
    });
    
    // Recalculate positions to prevent overlap
    redistributeLabels(hoverIndex);
  }
  
  function redistributeLabels(hoverIndex) {
    const positions = labelPositions.map(p => ({ ...p }));
    
    // Calculate new positions based on magnification
    for (let i = 0; i < sortedLetters.length; i++) {
      const distance = Math.abs(i - hoverIndex);
      let scale = 1;
      if (distance === 0) scale = 2.5;
      else if (distance === 1) scale = 1.8;
      else if (distance === 2) scale = 1.4;
      else if (distance === 3) scale = 1.2;
      
      // Adjust position based on scale
      const offset = (scale - 1) * 10;
      if (i < hoverIndex) {
        positions[i].currentX = positions[i].baseX - offset;
      } else if (i > hoverIndex) {
        positions[i].currentX = positions[i].baseX + offset;
      } else {
        positions[i].currentX = positions[i].baseX;
      }
    }
    
    // Apply positions
    labelElements.forEach((label, i) => {
      label.setAttribute('x', positions[i].currentX);
    });
  }
  
  function resetLabels() {
    labelElements.forEach((label, i) => {
      label.style.fontSize = '8px';
      label.style.fill = 'var(--text-muted)';
      label.style.fontWeight = '400';
      label.setAttribute('x', labelPositions[i].baseX);
    });
  }
  
  // Add hover listeners to bars
  const bars = svg.querySelectorAll('.letter-bar-user');
  bars.forEach((bar, i) => {
    bar.addEventListener('mouseenter', () => {
      updateLabelMagnification(i);
    });
  });
  
  // Reset on mouse leave from chart
  svg.addEventListener('mouseleave', () => {
    resetLabels();
  });
  // Draw expected line
  if (shouldShowExpectedLine && expected) {
    const linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathSegments = [];
    let isFirstPoint = true;
    
    sortedLetters.forEach((letter, i) => {
      const expectedValue = expected[letter];
      if (expectedValue !== undefined) {
        const x = padding.left + i * barWidth + barPadding / 2 + effectiveBarWidth / 2;
        const y = toY(expectedValue);
        pathSegments.push(`${isFirstPoint ? 'M' : 'L'} ${x} ${y}`);
        isFirstPoint = false;
      }
    });
    
    if (pathSegments.length > 0) {
      linePath.setAttribute('d', pathSegments.join(' '));
      linePath.setAttribute('class', 'expected-line');
      svg.appendChild(linePath);
    }
  
    // Draw expected points
    sortedLetters.forEach((letter, i) => {
      const expectedValue = expected && expected[letter];
      if (expectedValue === undefined) return;
      
      const x = padding.left + i * barWidth + barPadding / 2 + effectiveBarWidth / 2;
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', toY(expectedValue));
      circle.setAttribute('r', 4);
      circle.setAttribute('class', 'expected-point');
      
      // Add tooltip to expected point
      circle.addEventListener('mouseenter', (e) => {
        const displayChar = letter === ' ' ? 'SPACE' : letter;
        tooltip.textContent = `${displayChar}: Expected ${expectedValue}${unit}`;
        tooltip.classList.add('visible');
      });
      
      circle.addEventListener('mousemove', (e) => {
        // Get the bounding rect of the container (chart-container or letter-chart-container)
        const container = svg.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Calculate position relative to the container
        let left = e.clientX - containerRect.left;
        let top = e.clientY - containerRect.top - 30;
        
        // Get tooltip dimensions to prevent it from going off-screen
        const tooltipRect = tooltip.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Adjust horizontal position if tooltip would go off right edge
        if (left + tooltipRect.width > containerWidth) {
          left = e.clientX - containerRect.left - tooltipRect.width - 10;
        }
        
        // Adjust vertical position if tooltip would go off top edge
        if (top < 0) {
          top = e.clientY - containerRect.top + 10;
        }
        
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
      });
      
      circle.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
      
      svg.appendChild(circle);
    });
}

}

// Create keyboard layout
function createKeyboard(containerId, data, type = 'accuracy') {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  // Calculate max and min values once for all keys
  let maxValue = 0;
  let minValue = 100000;
  Object.values(data).forEach(letter => {
    if (letter.user > maxValue) {
      maxValue = letter.user;
    }
    if (letter.user < minValue) {
      minValue = letter.user;
    }
  });
  
  const keyboardLayout = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];
  
  keyboardLayout.forEach(row => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'keyboard-row';
    
    row.forEach(key => {
      const keyDiv = document.createElement('div');
      keyDiv.className = 'keyboard-key';
      
      const label = document.createElement('div');
      label.className = 'key-label';
      label.textContent = key;
      keyDiv.appendChild(label);
      
      if (data[key]) {
        const value = data[key].user;
        
        if (type === 'accuracy') {
          // Color based on accuracy (clipped at 80% for red)
          // 80% or below = red (0), 100% = green (120)
          const hue = Math.max(0, ((value - minValue) / (maxValue - minValue)) * 120);
          keyDiv.style.backgroundColor = `hsla(${hue}, 70%, 65%, 0.3)`;
          
          const valueLabel = document.createElement('div');
          valueLabel.className = 'key-accuracy';
          valueLabel.textContent = `${value}%`;
          valueLabel.style.color = `hsl(${hue}, 70%, 35%)`;
          
          keyDiv.appendChild(valueLabel);
          
          // Add tooltip
          keyDiv.title = `${key.toUpperCase()}: ${value}% (avg: ${data[key].expected}%)`;
        } else if (type === 'speed') {
          // Color based on speed - assume range of 0-150 CPM
          // 0-50 = red (0), 100+ = green (120)
          const hue = Math.min(120, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 120));
          keyDiv.style.backgroundColor = `hsla(${hue}, 70%, 65%, 0.3)`;
          
          const valueLabel = document.createElement('div');
          valueLabel.className = 'key-accuracy';
          valueLabel.textContent = `${value}`;
          valueLabel.style.color = `hsl(${hue}, 70%, 35%)`;
          valueLabel.style.fontSize = '0.65rem';
          
          keyDiv.appendChild(valueLabel);
          
          // Add tooltip
          keyDiv.title = `${key.toUpperCase()}: ${value} CPM`;
        }
      } else {
        // Key is missing from data - show with grey background
        keyDiv.style.backgroundColor = `hsla(0, 0%, 50%, 0.2)`;
        keyDiv.style.opacity = '0.5';
        keyDiv.title = `${key.toUpperCase()}: No data`;
      }
      
      rowDiv.appendChild(keyDiv);
    });
    
    container.appendChild(rowDiv);
  });
  
  // Add spacebar
  const spaceRow = document.createElement('div');
  spaceRow.className = 'keyboard-row';
  
  const spaceKey = document.createElement('div');
  spaceKey.className = 'keyboard-key keyboard-key-spacebar';
  
  const label = document.createElement('div');
  label.className = 'key-label';
  label.textContent = 'SPACE';
  spaceKey.appendChild(label);
  
  if (data[' ']) {
    const value = data[' '].user;
    
    if (type === 'accuracy') {
      const hue = Math.max(0, ((value - minValue) / (maxValue - minValue)) * 120);
      spaceKey.style.backgroundColor = `hsla(${hue}, 70%, 65%, 0.3)`;
      
      const valueLabel = document.createElement('div');
      valueLabel.className = 'key-accuracy';
      valueLabel.textContent = `${value}%`;
      valueLabel.style.color = `hsl(${hue}, 70%, 35%)`;
      
      spaceKey.appendChild(valueLabel);
      spaceKey.title = `SPACE: ${value}% (avg: ${data[' '].expected}%)`;
    } else if (type === 'speed') {
      const hue = Math.min(120, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 120));
      spaceKey.style.backgroundColor = `hsla(${hue}, 70%, 65%, 0.3)`;
      
      const valueLabel = document.createElement('div');
      valueLabel.className = 'key-accuracy';
      valueLabel.textContent = `${value}`;
      valueLabel.style.color = `hsl(${hue}, 70%, 35%)`;
      valueLabel.style.fontSize = '0.65rem';
      
      spaceKey.appendChild(valueLabel);
      spaceKey.title = `SPACE: ${value} CPM`;
    }
  } else {
    // Spacebar is missing from data - show with grey background
    spaceKey.style.backgroundColor = `hsla(0, 0%, 50%, 0.2)`;
    spaceKey.style.opacity = '0.5';
    spaceKey.title = 'SPACE: No data';
  }
  
  spaceRow.appendChild(spaceKey);
  container.appendChild(spaceRow);
}

// Populate bigram errors
function populateBigramErrors(bigramErrors) {
  const grid = document.getElementById('bigram-grid');
  grid.innerHTML = '';
  bigramErrors.forEach(item => {
    const div = document.createElement('div');
    div.className = 'bigram-item';
    
    const text = document.createElement('div');
    text.className = 'bigram-text';
    text.textContent = `-${item.bigram}-`;
    
    const errors = document.createElement('div');
    errors.className = 'bigram-errors';
    errors.textContent = `${(item.errorRate*100).toFixed(1)}% error rate`;
    
    const count = document.createElement('div');
    count.className = 'bigram-count';
    count.textContent = `${item.errorCount} errors`;
    
    div.appendChild(text);
    div.appendChild(errors);
    div.appendChild(count);
    grid.appendChild(div);
  });
}

// Main initialization function
function initializeStatsPage() {
  let summaryData, bigramErrors, statsData;
  
  // Try to load from localStorage
  try {
    const generated = generateStatsData();
    summaryData = generated.summaryData;
    bigramErrors = generated.bigramErrors;
    statsData = generated.statsData;

    // If no data exists, use demo data
  } catch (e) {
    console.error('Error loading stats:', e);
  }
  
  // Initialize charts and grids
  function init() {
    createLineChart('wpm-chart', statsData.wpmOverTime, 'WPM', 30, 80);
    const overtimeWpmEstimateLegend = document.getElementById('overtime-wpm-estimate-legend');
    overtimeWpmEstimateLegend.style.display = 'none';
    createLineChart('accuracy-chart', statsData.accuracyOverTime, '%', 80, 100);
    const overtimeAccuracyEstimateLegend = document.getElementById('overtime-accuracy-estimate-legend');
    overtimeAccuracyEstimateLegend.style.display = 'none';
    // Calculate dynamic max for letter charts (keep min at 0)
    const speedValues = Object.values(statsData.speedPerLetter).map(d => d.user);
    const maxSpeed = Math.max(...speedValues);
    const speedYMax = maxSpeed + 10;
    const shouldShowSpeedExpected = true;
    createLetterBarChart(
      'speed-bar-chart',
      statsData.speedPerLetter,
      statsData.predictedCPMChar,
      ' CPM',
      0,
      speedYMax,
      shouldShowSpeedExpected, // shouldShowExpectedLine
    );
    const expectedLegendSpeed = document.getElementById('expected-average-speed-legend');
    expectedLegendSpeed.style.display = shouldShowSpeedExpected ? 'flex' : 'none';
    
    const shouldShowAccuracyExpected = false;
    createLetterBarChart(
      'accuracy-bar-chart',
      statsData.accuracyPerLetter,
      {},
      '%',
      0,
      100,
      shouldShowAccuracyExpected // shouldShowExpectedLine
    );
    const expectedLegendAccuracy = document.getElementById('expected-average-accuracy-legend');
    expectedLegendAccuracy.style.display = shouldShowAccuracyExpected ? 'flex' : 'none';

    // Create keyboard layouts
    createKeyboard('accuracy-keyboard-view', statsData.accuracyPerLetter, 'accuracy');
    createKeyboard('speed-keyboard-view', statsData.speedPerLetter, 'speed');
    
    // Populate bigram errors
    populateBigramErrors(
      bigramErrors,
      statsData.accuracyPerLetter
    );
    
    // Update summary data
    document.getElementById('total-sessions').textContent = summaryData.totalSessions;
    document.getElementById('total-time').textContent = summaryData.totalTime;
    document.getElementById('current-streak').textContent = `${summaryData.currentStreak} days`;
    
    // Update : badges with latest values
    const latestWpm = statsData.wpmOverTime.measured[statsData.wpmOverTime.measured.length - 1];
    const latestAccuracy = statsData.accuracyOverTime.measured[statsData.accuracyOverTime.measured.length - 1];
    if (latestWpm && latestWpm.percentile) {
      document.getElementById('wpm-percentile').textContent = `${latestWpm.percentile}th Percentile`;
    }
    if (latestAccuracy && latestAccuracy.percentile) {
      document.getElementById('accuracy-percentile').textContent = `${latestAccuracy.percentile}th Percentile`;
    }
  }

  // Dark mode handling
  let darkMode = localStorage.getItem('darkMode') !== 'false';
  if (darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  document.getElementById('darkModeToggle').addEventListener('click', () => {
    darkMode = !darkMode;
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('darkMode', darkMode);
    // Redraw charts with new theme
    init();
  });

  // Toggle between chart and keyboard view for accuracy
  document.getElementById('toggle-accuracy-view').addEventListener('click', function() {
    const chartView = document.getElementById('accuracy-chart-view');
    const keyboardView = document.getElementById('accuracy-keyboard-view');
    const button = this;
    
    // Find the legend that comes after the chart/keyboard views
    const accuracySection = chartView.closest('.letter-graph-section');
    const legend = accuracySection.querySelector('.bar-chart-legend');
    
    if (chartView.classList.contains('active')) {
      chartView.classList.remove('active');
      chartView.style.display = 'none';
      keyboardView.classList.add('active');
      button.textContent = 'Show Chart';
      // Hide legend when showing keyboard
      if (legend) legend.style.display = 'none';
    } else {
      keyboardView.classList.remove('active');
      chartView.style.display = 'block';
      chartView.classList.add('active');
      button.textContent = 'Show Keyboard';
      // Show legend when showing chart
      if (legend) legend.style.display = 'flex';
    }
  });

  // Toggle between chart and keyboard view for speed
  document.getElementById('toggle-speed-view').addEventListener('click', function() {
    const chartView = document.getElementById('speed-chart-view');
    const keyboardView = document.getElementById('speed-keyboard-view');
    const button = this;
    
    // Find the legend that comes after the chart/keyboard views
    const speedSection = chartView.closest('.letter-graph-section');
    const legend = speedSection.querySelector('.bar-chart-legend');
    
    if (chartView.classList.contains('active')) {
      chartView.classList.remove('active');
      chartView.style.display = 'none';
      keyboardView.classList.add('active');
      button.textContent = 'Show Chart';
      // Hide legend when showing keyboard
      if (legend) legend.style.display = 'none';
    } else {
      keyboardView.classList.remove('active');
      chartView.style.display = 'block';
      chartView.classList.add('active');
      button.textContent = 'Show Keyboard';
      // Show legend when showing chart
      if (legend) legend.style.display = 'flex';
    }
  });

  // Initialize on load
  window.addEventListener('load', init);
  window.addEventListener('resize', init);
}

// Export for use in stats.html
if (typeof window !== 'undefined') {
  window.generateStatsData = generateStatsData;
  window.initializeDemoData = initializeDemoData;
  window.initializeStatsPage = initializeStatsPage;
}
