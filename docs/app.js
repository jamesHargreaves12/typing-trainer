
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

function getPassageVariants(firstRep, count = 2) {
  const seenGroups = [firstRep.group];
  const passageWeights = [];
  const INITIAL_SENTENCE_VARIANTS = HYPERPARAMS.INITIAL_SEQUENCES;
  for (let i = 0; i < INITIAL_SENTENCE_VARIANTS.length; i++) { // Ignore the first group since we will always show this for now.
    for (let j = 0; j < INITIAL_SENTENCE_VARIANTS[i].length; j++) {
      const passage = INITIAL_SENTENCE_VARIANTS[i][j]["passage"];
      const alpha = INITIAL_SENTENCE_VARIANTS[i][j]["alpha"];
      const beta = INITIAL_SENTENCE_VARIANTS[i][j]["beta"];
      const p = betaSample(alpha, beta);
      passageWeights.push({ passage, weight: p, group: i });
    }
  }
  const weightedPassages = passageWeights.sort((a, b) => b.weight - a.weight);
  const retPassages = [];
  for (let i = 0; i < weightedPassages.length; i++) {
    if (seenGroups.includes(weightedPassages[i].group)) {
      continue;
    }
    seenGroups.push(weightedPassages[i].group);
    retPassages.push(weightedPassages[i].passage);
    if (retPassages.length >= count) {
      break;
    }
  }
  return retPassages;
}

const LETTER_FREQUENCIES = {
  'A': 0.003153352805124311,
  'n': 0.055725109439303484,
  'a': 0.06574879237610978,
  'r': 0.04895343918863251,
  'c': 0.02368663480872584,
  'h': 0.03440809510193862,
  'i': 0.05736555569780318,
  's': 0.05098628684359351,
  't': 0.06283249477699976,
  ' ': 0.16126223748404583,
  'v': 0.00792397035237102,
  'e': 0.09536583341888472,
  'f': 0.015292696431959359,
  'd': 0.030829563440896025,
  'u': 0.020792086046599403,
  'g': 0.013797676968572934,
  'o': 0.0567961830999978,
  'l': 0.03205162970570526,
  'y': 0.01153414941517434,
  '.': 0.010558070614780313,
  '2': 0.0032394917857312498,
  '0': 0.003898399323498048,
  'm': 0.017988761235399744,
  'k': 0.005075728496221641,
  'w': 0.011476864805862281,
  'p': 0.015483219067633279,
  'b': 0.01152292290241313,
  ',': 0.00878202900526206,
  'T': 0.004579806176913074,
  'j': 0.0007302944339057933,
  '9': 0.0022726125692146813,
  '4': 0.0009719173180840281,
  'D': 0.0015318912844709844,
  'z': 0.0007556475358099878,
  'W': 0.0013337568162347675,
  'E': 0.001062871629027983,
  'I': 0.002681382154161148,
  'x': 0.0012442623801334335,
  'S': 0.003723010665829977,
  'H': 0.0018290195012505923,
  'C': 0.0033144800536579863,
  '(': 0.0017254667539418384,
  ')': 0.001725539082263411,
  'q': 0.0009409735262355593,
  ';': 0.00013218839775919848,
  '-': 0.0016721602023162718,
  '6': 0.0009902592018082627,
  'M': 0.0022375125026953655,
  '5': 0.0010397612837191113,
  '1': 0.004230895510900077,
  'L': 0.0012864755031094834,
  'R': 0.0014376283867850131,
  'F': 0.0013433822692696467,
  'V': 0.000527198242809697,
  'G': 0.0011281308697633483,
  'B': 0.001900767460370877,
  'Y': 0.00029471823710480933,
  '"': 0.0010622791154176604,
  "'": 0.0017780592803768405,
  '8': 0.0012323368864725459,
  'J': 0.0010586430260355636,
  'N': 0.0013529180351857762,
  'O': 0.0010358590261136272,
  '7': 0.000974268856474996,
  '3': 0.0010637262604756847,
  'U': 0.0011245786812342758,
  'P': 0.0021464748695249588,
  'K': 0.0007279492604071239,
  ':': 0.0008468361905158379,
  'Q': 0.00010038303094415696,
  'Z': 0.00012192356236161744,
  '?': 9.530037513060838e-05,
  'X': 8.027517892040621e-05,
  '!': 2.290377562246053e-05
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

// Add logBeta approximation
Math.logBeta = function (a, b) {
  return Math.lgamma(a)[0] + Math.lgamma(b)[0] - Math.lgamma(a + b)[0];
}

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

const STRATEGY_DESCRIPTIONS = {
  'most_common': 'most common letters (etaoinsr)',
  'punc': 'punctuation characters',
  'caps': 'capital letters',
  'lower': 'lowercase letters',
  'rare_letters': 'rare letters (z, x, q, k, v)',
  'home_row': 'letters on the home row of the keyboard',
  'top_row': 'letters on the top row of the keyboard',
  'bottom_row': 'letters on the bottom row of the keyboard',
  'pinky': 'letters typed by the pinky finger',
  'ring_pinky': 'letters typed by the ring or pinky finger',
  'left_hand': 'letters typed by the left hand',
  'right_hand': 'letters typed by the right hand',
  'numbers': 'numbers',
  'difficult_to_reach_letters': 'letters that are difficult to reach on the keyboard (y, t, b, z)',
  'repeat_bigrams': 'repeated letters',
  'left_hand_only_bigrams': 'pairs of letters that are typed repeatedly by the left hand (e.g. sd)',
  'right_hand_only_bigrams': 'pairs of letters that are typed repeatedly by the right hand (e.g. kl)',
  'alternate_hand_bigrams': 'pairs of letters that are typed alternately by the left and right hand (e.g. sk)',
  'same_finger_bigrams': 'pairs of letters that are typed with the same finger (e.g. ws)',
}

const STRATEGY_DESCRIPTIONS_SHORT = {
  'punc': 'punctuation',
  'caps': 'capital letters',
  'lower': 'lowercase',
  'rare_letters': 'rare letters',
  'home_row': 'home row letters',
  'top_row': 'top row letters',
  'bottom_row': 'bottom row letters',
  'pinky': 'letters typed by the pinky finger',
  'ring_pinky': 'letters typed by the ring or pinky finger',
  'left_hand': 'letters typed by the left hand',
  'right_hand': 'letters typed by the right hand',
  'numbers': 'numbers',
  'difficult_to_reach_letters': 'difficult to reach letters',
  'repeat_bigrams': 'repeated letters',
  'left_hand_only_bigrams': 'pair of letters for the left hand',
  'right_hand_only_bigrams': 'pair of letters for the right hand',
  'alternate_hand_bigrams': 'pair of letters for alternating hands',
  'same_finger_bigrams': 'pair of letters for the same finger',
}

const STRATEGY_DESCRIPTIONS_SHORTEST = {
  'most_common': 'most common',
  'punc': 'punctuation',
  'caps': 'capital',
  'lower': 'lowercase',
  'rare_letters': 'rare',
  'home_row': 'home row',
  'top_row': 'top row',
  'bottom_row': 'bottom row',
  'pinky': 'pinky',
  'ring_pinky': 'ring or pinky',
  'left_hand': 'left hand',
  'right_hand': 'right hand',
  'numbers': 'numbers',
  'difficult_to_reach_letters': 'difficult to reach',
  'repeat_bigrams': 'repeated',
  'left_hand_only_bigrams': 'left hand',
  'right_hand_only_bigrams': 'right hand',
  'alternate_hand_bigrams': 'alternating hands',
  'same_finger_bigrams': 'same finger',
}

class ErrorGroupSelectionStrategy {
  constructor(strategy) {
    this.strategy = strategy;
  }
  getStatsRepFooter() {
    if (this.strategy == 'most_common') {
      return `Most of your errors come from the most common letters "etaoinsr". For the next ${REPETION_STRATEGY_HISTORY_LENGTH_STR} reps, we will simplify the passages so that you can focus on just these letters.`;
    }
    return `Typo dojo's analysis identifies ${STRATEGY_DESCRIPTIONS[this.strategy]} as a focus area for you. For the next ${REPETION_STRATEGY_HISTORY_LENGTH_STR} reps, passages that contain more ${STRATEGY_DESCRIPTIONS_SHORT[this.strategy]} will be prioritised.`;
  }
  sendGetNextPassagesMessage() {
    passageWorker.postMessage({
      type: 'get-next-passages:error-group',
      upcomingPassages,
      recentPassages,
      errorLog,
      seenLog,
      errorCount,
      user_intro_acc,
      user_intro_wpm,
      highlight_error_pct: 0.1,
      userId: userId,
      selectionStratedy: this.strategy
    });
  }

}

class LetterErrorSelectionStrategy {
  constructor(strategy) {
    this.strategy = strategy;
  }
  getStatsRepFooter() {
    return `For the next ${REPETION_STRATEGY_HISTORY_LENGTH_STR} reps, typo dojo will focus on the letters that will lead to the biggest improvement in your accuracy.`;
  }
  sendGetNextPassagesMessage() {
    passageWorker.postMessage({
      type: 'get-next-passages:letter-error',
      upcomingPassages,
      recentPassages,
      errorLog,
      seenLog,
      errorCount,
      user_intro_acc,
      user_intro_wpm,
      highlight_error_pct: 0.1,
      userId: userId,
      selectionStratedy: `letter-error->${this.strategy}`
    });
  }
}

class SpeedSelectionStrategy {
  constructor(strategy) {
    this.strategy = strategy;
  }
  getStatsRepFooter() {
    return `For the next ${REPETION_STRATEGY_HISTORY_LENGTH_STR} reps, typo dojo will focus on the letters that will lead to the biggest improvement in your speed.`;
  }

  sendGetNextPassagesMessage() {
    passageWorker.postMessage({
      type: 'get-next-passages:letter-speed',
      upcomingPassages,
      recentPassages,
      errorLog,
      seenLog,
      errorCount,
      user_intro_acc,
      user_intro_wpm,
      highlight_error_pct: 0.1,
      userId: userId,
      selectionStratedy: `letter-speed->${this.strategy}`
    });
  }
}
class DefaultSelectionStrategy {
  constructor() {
  }
  getStatsRepFooter() {
    return "";
  }

  sendGetNextPassagesMessage() {
    passageWorker.postMessage({
      type: 'get-next-passages:default',
      upcomingPassages,
      recentPassages,
      errorLog,
      seenLog,
      errorCount,
      user_intro_acc,
      user_intro_wpm,
      highlight_error_pct: 0.1,
      userId: userId,
      selectionStratedy: null,
      has_finished_defaults: finishedDefaultPassages == 0,
    });
  }
}

const strategyModeLookup = {
  "letter-error": new LetterErrorSelectionStrategy("w"),
  "letter-speed": new SpeedSelectionStrategy("1"),
  "error-group": new ErrorGroupSelectionStrategy("most_common"),
  "default": new DefaultSelectionStrategy(),
}

function getFocusText(passageStrategy) {
  if (!passageStrategy) {
    return null;
  }
  if (STRATEGY_DESCRIPTIONS_SHORTEST[passageStrategy]) {
    return `Focus: ${STRATEGY_DESCRIPTIONS_SHORTEST[passageStrategy]}`;
  }
  if (passageStrategy.includes("->")) {
    return `Focus: ${passageStrategy.split("->")[1]}`;
  }
  return null;
}

function setFocusText(strategy) {
  const focusText = getFocusText(strategy);

  const focusTextElement = document.getElementById('rep_focus');
  if (focusText) {
    focusTextElement.style.display = "block";
    focusTextElement.innerHTML = focusText;
  }
  else {
    focusTextElement.style.display = "none";
    focusTextElement.innerHTML = `Focus: N.A.`;
  }
}


function _suggestRepetitionStrategy(wpm, accuracy, wpm_percentile, accuracy_percentile, strategy) {
  let header = "";
  key = `${Math.round(wpm)},${Math.round(accuracy * 100)}`
  console.log(key, stats_rep_common_strings[key]);
  if (stats_rep_common_strings[key]) {
    header = stats_rep_common_strings[key];
  }
  else {
    header = `Over the last ${REPETION_STRATEGY_HISTORY_LENGTH_STR} reps, your words per minute have been ${Math.round(wpm)} (faster than ${Math.round(wpm_percentile * 100)}% of users), and your accuracy has been ${Math.round(accuracy * 100)}% (better than ${Math.round(accuracy_percentile * 100)}% of users).`
  }

  if (strategy) {
    const footer = strategy.getStatsRepFooter();
    header = `${header} ${footer}`.trim();
  }

  return header;
}
function sampleOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function suggestErrorRepetitionStrategy(strategy) {
  prev_reps = runHistory.slice(0, REPETION_STRATEGY_HISTORY_LENGTH);
  const wpm = prev_reps.reduce((sum, run) => sum + run.wpm, 0) / prev_reps.length;
  const accuracy = prev_reps.reduce((sum, run) => sum + run.accuracy, 0) / prev_reps.length / 100;
  const wpm_percentile = gammaCDF(wpm, WPM_DISTRIBUTION_PARAMS.a, WPM_DISTRIBUTION_PARAMS.loc, WPM_DISTRIBUTION_PARAMS.scale);
  const error_rate_percentile = betaCDF(1 - accuracy, ERROR_RATE_DISTRIBUTION_PARAMS.a, ERROR_RATE_DISTRIBUTION_PARAMS.b, ERROR_RATE_DISTRIBUTION_PARAMS.loc, ERROR_RATE_DISTRIBUTION_PARAMS.scale);
  const accuracy_percentile = 1 - error_rate_percentile;
  return _suggestRepetitionStrategy(wpm, accuracy, wpm_percentile, accuracy_percentile, strategy);
}
const SECOND_PASSAGE_INDEX = Math.floor(Math.random() * 5) + 1;
let THIRD_PASSAGE_INDEX = Math.floor(Math.random() * 5) + 1;
while (SECOND_PASSAGE_INDEX === THIRD_PASSAGE_INDEX) {
  THIRD_PASSAGE_INDEX = Math.floor(Math.random() * 5) + 1;
}

let DEFAULT_PASSAGES = [
  "Stop repeating the same typos. Typo Dojo identifies patterns in your errors and builds drills to break them for good.",
  "While other apps force you to type random sequences of words, typo dojo immerses you in the authentic flow of language using sentences from trusted sources like Wikipedia.",
  "In today's digital age, exceptional touch typing is a game-changer. Every minute spent training with typo dojo makes you faster and more accurate."
].map(passage => ({ passage, source: 'default', group: 2 }));

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
].map(passage => ({ passage, source: 'fallback' }))

let finishedDefaultPassages = false;
let upcomingDefaultPassages = ([
  DEFAULT_PASSAGES[0].passage, ...getPassageVariants(DEFAULT_PASSAGES[0].passage, 2)
]).map(passage => ({ passage, source: 'default' }));
let upcomingPassages = upcomingDefaultPassages;
let currentPassageErrors = [];
let currentPassageErrorActualChar = [];
let currentPassageLetterTimesSec = [];
let user_intro_acc = Math.random() * (0.1 - 0.05) + 0.05;
let user_intro_wpm = Math.floor(Math.random() * (70 - 29 + 1)) + 29;
const REPETION_STRATEGY_HISTORY_LENGTH = 5;
const REPETION_STRATEGY_HISTORY_LENGTH_STR = "five";
let session_rep_count = 0;
let predictiveErrorHighlight = localStorage.getItem('predictiveErrorHighlight') !== 'false';
let showStatsEvery5thRepetition = localStorage.getItem('showStatsEvery5thRepetition') !== 'false';
let onlyShowCursorAfterDelay = localStorage.getItem('onlyShowCursorAfterDelay') === 'true';
let hasSeenRepetitionStrategyUpdate = false;
const previousSelectionStrategies = [];
let errorLog = {
  'char': {},
  'bigram': {},
  'trigram': {},
  'quadgram': {}
};
let interestingErrorLog = {
  'char': {},
  'bigram': {},
  'trigram': {},
  'quadgram': {}
}
let errorCount = 0;
let seenLog = {
  'char': {},
  'bigram': {},
  'trigram': {},
  'quadgram': {}
};
let speedLog = {
  'char': {},
  'bigram': {},
  'trigram': {},
  'quadgram': {}
}
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
const errorTooltipClass = "error-tooltip";
let errorBoxIncludeFrequencyInCost = false;
// Add after other global variables
let darkMode = localStorage.getItem('darkMode') !== 'false';
let settingsOpen = false;
let soundOnError = false;
const errorSound = document.getElementById('errorSound');
let recentPassages = JSON.parse(localStorage.getItem('recentPassages')) || [];
const MAX_RECENT_PASSAGES = 70;
let currentPassageSource = localStorage.getItem('passageSource') || 'wikipedia';
let currentPassageSelectionStrategy = localStorage.getItem('selectionStratedy') || null;
let passageWorker = new Worker('passageWorker.js');
passageWorker.postMessage({
  type: 'sourceChange',
  source: currentPassageSource
});
let settingTargetTextRef = { value: false };

let startTime = null;
let prevCharTime = null;
let cursorTimeoutId = null;
let targetText = 'Stop repeating the same typos. Typo Dojo identifies patterns in your errors and builds drills to break them for good.';
const textDisplay = document.getElementById('textDisplay');
const inputArea = document.getElementById('inputArea');
const progressBar = document.getElementById('progressBar');
let currentSelectionStrategyMode = "default";
let previousRepSelectionStrategies = [];
let stats_rep_common_strings = {};

function calculateSocialProof() {
  // September 6th as the reference date
  const referenceDate = new Date('2025-09-06');
  const currentDate = new Date();

  // Calculate days since September 6th
  const timeDiff = currentDate.getTime() - referenceDate.getTime();
  const daysSince = Math.floor(timeDiff / (1000 * 3600 * 24));

  // Calculate social proof number: 237,548 + 11,000 * days since September 6th (seeing 15k per day but don't want to overstate)
  const socialProofNumber = 237548 + (11000 * daysSince);

  return socialProofNumber.toLocaleString();
}

function updateSocialProof() {
  const socialProofElement = document.getElementById('socialProof');
  if (socialProofElement) {
    const socialProofString = calculateSocialProof();
    const socialProofNumber = parseInt(socialProofString.replace(/,/g, ''));
    let displayNumber;

    if (socialProofNumber >= 10000000) {
      // Tens of millions
      const tensOfMillions = (socialProofNumber / 10000000).toFixed(1);
      displayNumber = `${tensOfMillions}0 million`;
    } else if (socialProofNumber >= 1000000) {
      // Millions
      const millions = (socialProofNumber / 1000000).toFixed(1);
      displayNumber = `${millions} million`;
    } else if (socialProofNumber >= 10000) {
      // Tens of thousands
      const tensOfThousands = Math.floor(socialProofNumber / 10000);
      displayNumber = `${tensOfThousands}0,000+`;
    } else {
      // Fallback for smaller numbers
      displayNumber = socialProofNumber.toLocaleString();
    }

    socialProofElement.innerHTML = `Join <span class="social-proof-number">${displayNumber}</span> people improving their typing: just <span class="cta-text">start typing</span>...`;
  }
}

function recordUserLeaveText() {
  const data = {
    uid: userId,
    passage: targetText,
    errors: currentPassageErrors,
    errorChars: currentPassageErrorActualChar,
    letterTimesSec: currentPassageLetterTimesSec,
    source: currentPassageSource,
    timeTakenMs: (new Date() - startTime),
    selectionStratedy: currentPassageSelectionStrategy
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
  gtag('set', { 'repetition_count': completedTasks });
  gtag('event', 'repetition_completed', {
    'event_category': 'repetition',
    'event_label': 'Rep ' + completedTasks
  });
}

function generateUserId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function persistTypingState() {
  const timeTakenMs = (new Date() - startTime);
  const data = {
    userId: userId,
    passage: targetText,
    source: currentPassageSource,
    errors: currentPassageErrors,
    letterTimesSec: currentPassageLetterTimesSec,
    errorChars: currentPassageErrorActualChar,
    timeTakenMs: timeTakenMs,
    selectionStratedy: currentPassageSelectionStrategy
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

function getTopErrors(includeFrequencyInCost) {
  let topErrorLetters = [];
  for (const ngram in errorLog) {
    if (ngram != 'char') {
      continue;
    }
    const countCostFunction = (char, errorCount) => (errorCount + 1) / (seenLog[ngram][char] + 1 * Object.keys(errorLog[ngram]).length);
    const frequencyCostFunction = (char, errorCount) => ((errorCount + 1) / (seenLog[ngram][char] + 1 * Object.keys(errorLog[ngram]).length)) * LETTER_FREQUENCIES[char];
    const errorScores = Object.entries(errorLog[ngram])
      .filter(([char, errorCount]) => errorCount > 1 && seenLog[ngram][char] > 3 && char != undefined && char != null && char != 'undefined')
      .map(([char, errorCount]) => [char, includeFrequencyInCost ? frequencyCostFunction(char, errorCount) : countCostFunction(char, errorCount)]);
    const sortedErrorScores = errorScores.sort((a, b) => b[1] - a[1]);
    const worstLetters = sortedErrorScores.slice(0, 5);

    topErrorLetters.push(...worstLetters);
  }
  topErrorLetters = topErrorLetters.sort((a, b) => b[1] - a[1]);
  return topErrorLetters.slice(0, 5).map(([letterKey, _]) => {
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

function topErrorsToHtmlTable(includeFrequencyInCost) {
  const topErrors = getTopErrors(includeFrequencyInCost);
  if (topErrors.length == 0) {
    document.getElementById('topErrors').style.display = "none";
    return "";
  }
  document.getElementById('topErrors').style.display = "block";
  const errorListClass = 'error-list';
  const errorItemClass = 'error-item';
  const titleClass = "error-title";
  const tooltipText = (
    includeFrequencyInCost
      ? "Ordered also takes into account letter frequency."
      : "Ordered by error rate with correction factor for characters that haven't been seen much."
  );
  let html = `<div class="${errorListClass}" style="position: relative;">
  <div class="${errorTooltipClass}" style="position: absolute; display: none; visibility: hidden; opacity: 0; z-index: 1000;">
    ${tooltipText}
  </div>`;
  let title = includeFrequencyInCost ? "Most costly typos" : "Most common typos";
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
      const yWPM = (height - margin.top - margin.bottom) * (1 - (run.wpm - minYaxisWPM) / (maxYaxisWPM - minYaxisWPM));
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
      const yAcc = (height - margin.top - margin.bottom) * (1 - (run.accuracy - minYaxisAccuracy) / (maxYaxisAccuracy - minYaxisAccuracy));
      return `
                  <rect x="${x - 3 + 15}" y="${yAcc - 3}" width="6" height="6" fill="#666666"
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


function choseNextSelectionMode() {
  const selectionModeOrder = [
    "letter-error",
    "letter-speed",
    "error-group"
  ];

  const index = parseInt(session_rep_count / REPETION_STRATEGY_HISTORY_LENGTH);
  if (index % 2 == 0) {
    return "default";
  }
  else {
    return selectionModeOrder[parseInt((index - 1) / 2) % selectionModeOrder.length];
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
  if (session_rep_count == REPETION_STRATEGY_HISTORY_LENGTH && stats_rep_shown == false || (showStatsEvery5thRepetition && session_rep_count % REPETION_STRATEGY_HISTORY_LENGTH == 0 && session_rep_count != 0)) {
    stats_rep_shown = true;
    currentSelectionStrategyMode = choseNextSelectionMode();
    return {
      passage: suggestErrorRepetitionStrategy(strategyModeLookup[currentSelectionStrategyMode]),
      source: "stats_rep"
    };
  }

  let nextPassage = upcomingPassages.shift();
  // Fall back in the case where upcomingPassagest is empty. Need to work out why.
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
  strategyModeLookup[currentSelectionStrategyMode].sendGetNextPassagesMessage();

  console.log(`Time taken to send message to worker: ${performance.now() - startTime}ms`);

  setTimeout(() => {
    setUpcomingPassages();
  }, 7_000);
}

passageWorker.onmessage = function (e) {
  try {
    if (e.data.type == 'error') {
      console.error(e.data.error);
      return;
    }
    if (e.data.type == 'suggestStrategyFromSpeedLog') {
      strategyModeLookup['letter-speed'] = new SpeedSelectionStrategy(e.data.strategy);

      passageWorker.postMessage({
        type: 'suggestErrorLetterStrategyFromInterestingErrors',
        interestingErrorLog: interestingErrorLog,
        seenLog: seenLog,
        previousRepSelectionStrategies: previousRepSelectionStrategies
      });

      return;
    }
    else if (e.data.type == 'suggestErrorLetterStrategyFromInterestingErrors') {
      strategyModeLookup['letter-error'] = new LetterErrorSelectionStrategy(e.data.strategy);
      // For this one we do the full set of reps on a single stratedgy. - you want to use over all selectino startegy soon.
      if (!currentPassageSelectionStrategy?.startsWith("error-group")) {
        passageWorker.postMessage({
          type: 'suggestErrorGroupStrategyFromInterstingErrors',
          interestingErrorLog: interestingErrorLog,
          seenLog: seenLog,
          previousRepSelectionStrategies: previousRepSelectionStrategies
        });
      }

      return;
    }
    else if (e.data.type == 'suggestErrorGroupStrategyFromInterstingErrors') {
      strategyModeLookup['error-group'] = new ErrorGroupSelectionStrategy(e.data.strategy);
      return;
    }

    if (!e.data) {
      console.error("e.data is null");
      return;
    }
    if (e.data.type == 'get-next-passages:default' || e.data.type == 'get-next-passages:letter-error' || e.data.type == 'get-next-passages:letter-speed' || e.data.type == 'get-next-passages:error-group') {
      upcomingPassages = e.data.res;
      // refilter here because of race conditions
      upcomingPassages = upcomingPassages.filter(passage => !recentPassages.includes(passage.passage));
      localStorage.setItem('upcomingPassages', JSON.stringify(upcomingPassages));
    }

  } catch (error) {
    console.error('Error handling worker message:', error);
    // The console.error override will handle logging to S3
  }
};

// Add error handler for worker errors
passageWorker.onerror = function (error) {
  console.error('Worker error:', JSON.stringify(error));
  // The console.error override will handle logging to S3
};

function setupTopErrorsBox() {
  const topErrorsBox = document.getElementById('topErrors');
  topErrorsBox.innerHTML = topErrorsToHtmlTable(errorBoxIncludeFrequencyInCost);
  topErrorsBox.onclick = function () {
    errorBoxIncludeFrequencyInCost = !errorBoxIncludeFrequencyInCost;
    setupTopErrorsBox();
  };
}

async function loadStatsRepCommonStrings() {
  fetch(`https://jameshargreaves12.github.io/reference_data/stats_rep_common_strings.json`)
    .then(response => {
      if (!response.ok) {
        console.error('Network response was not ok', response);
      }
      return response.json();
    }).then(data => {
      stats_rep_common_strings = data;
    })
}

window.onload = function () {
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
  interestingErrorLog = JSON.parse(localStorage.getItem('interestingErrorLog')) || {
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
  speedLog = JSON.parse(localStorage.getItem('speedLog')) || {
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
    upcomingPassages = upcomingPassages.map(passage => ({ passage, source: 'unknown' }));
  }
  const p = getPassage();
  const { passage, source, highlightIndecies, selectionStratedy: currentPassageSelectionStratedy } = p;
  previousRepSelectionStrategies.unshift(currentPassageSelectionStratedy);
  setFocusText(currentPassageSelectionStratedy);
  targetText = passage;
  currentPassageSource = source;
  currentPassageSelectionStrategy = currentPassageSelectionStratedy;
  toHighlight = highlightIndecies;
  renderText();
  colorText("");
  setupTopErrorsBox();

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
  showStatsEvery5thRepetitionToggle.checked = localStorage.getItem('showStatsEvery5thRepetition') !== 'false';
  showStatsEvery5thRepetition = showStatsEvery5thRepetitionToggle.checked;

  showStatsEvery5thRepetitionToggle.addEventListener('change', (e) => {
    showStatsEvery5thRepetition = e.target.checked;
    localStorage.setItem('showStatsEvery5thRepetition', showStatsEvery5thRepetition);
  });

  const onlyShowCursorAfterDelayToggle = document.getElementById('onlyShowCursorAfterDelay');
  onlyShowCursorAfterDelayToggle.checked = localStorage.getItem('onlyShowCursorAfterDelay') === 'true';
  onlyShowCursorAfterDelay = onlyShowCursorAfterDelayToggle.checked;

  onlyShowCursorAfterDelayToggle.addEventListener('change', (e) => {
    onlyShowCursorAfterDelay = e.target.checked;
    localStorage.setItem('onlyShowCursorAfterDelay', onlyShowCursorAfterDelay);
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
  loadStatsRepCommonStrings();

  // Update social proof on page load
  if (runHistory.length == 0) {
    updateSocialProof();
  } else {
    document.getElementById('socialProof').style.display = 'none';
  }

  const topErrorsBox = document.getElementById('topErrors');

  topErrorsBox.onmouseenter = function () {
    topErrorsBox.querySelector(`.${errorTooltipClass}`).style.display = 'block';
    topErrorsBox.querySelector(`.${errorTooltipClass}`).style.visibility = 'visible';
    topErrorsBox.querySelector(`.${errorTooltipClass}`).style.opacity = '1';
  };
  topErrorsBox.onmouseleave = function () {
    topErrorsBox.querySelector(`.${errorTooltipClass}`).style.display = 'none';
    topErrorsBox.querySelector(`.${errorTooltipClass}`).style.visibility = 'hidden';
    topErrorsBox.querySelector(`.${errorTooltipClass}`).style.opacity = '0';
  };

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

function colorText(inputText) {

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
    if (!onlyShowCursorAfterDelay || inputText.length == 0 || (new Date() - prevCharTime) > 1000) {
      NextChar.className = NextChar.className.replace('letter', 'letter cursor');
    } else {
      if (cursorTimeoutId) {
        clearTimeout(cursorTimeoutId);
      }
      cursorTimeoutId = setTimeout(() => {
        if (new Date() - prevCharTime > 1000) {
          NextChar.className = NextChar.className.replace('letter', 'letter cursor');
        }
      }, 1000);
    }
  }
}

function annotateEdits(typed, target) {
  const m = typed.length, n = target.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = typed[i - 1] === target[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }

  let i = m, j = n, out = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && typed[i - 1] === target[j - 1] && dp[i][j] === dp[i - 1][j - 1]) {
      out.push(target[j - 1]); i--; j--;
    } else if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
      out.push("^"); i--; j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
      out.push("$");
      j--;
    } else {
      out.push("#"); i--;
    }
  }

  return out.reverse().join("");
}

document.addEventListener('keydown', (e) => {
  if (e.target.id == "feedbackMessage") {
    return;
  }
  inputArea.focus();
  if (e.key === 'Tab') {
    e.preventDefault();
  }
});

function countCharErrors(inputText, targetText) {
  let errorCount = 0;
  for (let i = 0; i < inputText.length; i++) {
    if (inputText[i] !== targetText[i]) {
      errorCount += 1;
    }
  }
  return errorCount;
}

function handleInput(e) {
  if (settingTargetTextRef.value) {
    return;
  }

  // Force cursor to end of input
  let inputText = inputArea.value;
  let i = inputText.length - 1;
  const end = inputArea.value.length;
  inputArea.setSelectionRange(end, end);

  // Handle empty input
  if (inputText.length === 0) {
    colorText(inputText);
    prevInputText = inputText;
    return;
  }

  if (e.data == ">" && targetText[i] != ".") {
    resetSession();
    return;
  }

  if (e["inputType"] != "deleteContentBackward") {
    charTotalCount += 1;
  }
  // Start timer on first keystroke
  if (!startTime && inputText.length > 0) {
    startTime = new Date();
    prevCharTime = new Date();
  }
  // Update timing for new characters
  const dt = new Date();
  for (let charIndex = currentPassageLetterTimesSec.length; charIndex < inputText.length && charIndex < targetText.length; charIndex++) {
    const letterTimeSec = charIndex === 0 ? 0 : (dt - prevCharTime) / 1000;
    currentPassageLetterTimesSec.push(Math.round(letterTimeSec * 1000) / 1000); // seconds, rounded to 3 decimals

    const unigram = targetText[charIndex];
    if (speedLog['char'][unigram]) {
      speedLog['char'][unigram].unshift(letterTimeSec);
      speedLog['char'][unigram] = speedLog['char'][unigram].slice(0, 1000);
    }
    else {
      speedLog['char'][unigram] = [letterTimeSec];
    }
  }
  if (inputText.length > 0) {
    prevCharTime = dt;
  }
  const typedChar = inputText[i];

  // Process all characters that are new since last input (handles rapid typing, paste, etc.)
  const startIndex = Math.max(0, prevInputText.length);
  const endIndex = Math.min(inputText.length, targetText.length);

  for (let charIndex = startIndex; charIndex < endIndex; charIndex++) {
    const currentTypedChar = inputText[charIndex];
    const currentTargetChar = targetText[charIndex];

    // Update n-gram tracking
    const currentUnigram = targetText[charIndex];
    const currentBigram = targetText.slice(charIndex - 1, charIndex + 1);
    const currentTrigram = targetText.slice(charIndex - 2, charIndex + 1);
    const currentQuadgram = targetText.slice(charIndex - 3, charIndex + 1);

    seenLog['char'][currentUnigram] = (seenLog['char'][currentUnigram] || 0) + 1;
    if (currentBigram.length > 1) {
      seenLog['bigram'][currentBigram] = (seenLog['bigram'][currentBigram] || 0) + 1;
    }
    if (currentTrigram.length > 2) {
      seenLog['trigram'][currentTrigram] = (seenLog['trigram'][currentTrigram] || 0) + 1;
    }
    if (currentQuadgram.length > 3) {
      seenLog['quadgram'][currentQuadgram] = (seenLog['quadgram'][currentQuadgram] || 0) + 1;
    }

    // Check for errors
    if (currentTypedChar !== null && currentTypedChar !== currentTargetChar) {
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

      // Only interesting if not a repeated error and not preceeded by an error.
      const isNonInterestingError = currentPassageErrors.includes(charIndex) || currentPassageErrors.includes(charIndex - 1);

      currentPassageErrors.push(charIndex);
      currentPassageErrorActualChar.push(currentTypedChar);

      errorLog['char'][currentUnigram] = (errorLog['char'][currentUnigram] || 0) + 1;
      errorCount += 1;
      if (currentBigram.length > 1) {
        errorLog['bigram'][currentBigram] = (errorLog['bigram'][currentBigram] || 0) + 1;
      }
      if (currentTrigram.length > 2) {
        errorLog['trigram'][currentTrigram] = (errorLog['trigram'][currentTrigram] || 0) + 1;
      }
      if (currentQuadgram.length > 3) {
        errorLog['quadgram'][currentQuadgram] = (errorLog['quadgram'][currentQuadgram] || 0) + 1;
      }

      if (!isNonInterestingError) {
        interestingErrorLog['char'][currentUnigram] = (interestingErrorLog['char'][currentUnigram] || 0) + 1;
        if (currentBigram.length > 1) {
          interestingErrorLog['bigram'][currentBigram] = (interestingErrorLog['bigram'][currentBigram] || 0) + 1;
        }
      }
    }
  }
  if (typedChar == " ") {
    if (i < targetText.length && targetText[i + 1] == " ") {
      let targetPreviousWordStart = i - 1;
      while (targetPreviousWordStart > 0 && targetText[targetPreviousWordStart] != " ") {
        targetPreviousWordStart--;
      }
      let inputPreviousWordStart = i - 1;
      while (inputPreviousWordStart > 0 && inputText[inputPreviousWordStart] != " ") {
        inputPreviousWordStart--;
      }
      const currentWordTyped = inputText.slice(inputPreviousWordStart, i);
      const currentWordTarget = targetText.slice(targetPreviousWordStart, i + 1);
      if (!currentWordTyped.includes("$") && !currentWordTarget.includes("#")) {
        const edit_string = annotateEdits(currentWordTyped, currentWordTarget) + " ";
        if (edit_string.split('#').length + edit_string.split('$').length === 3 && edit_string.indexOf('^') === -1) {
          const beforeErrorCount = countCharErrors(inputText, targetText);
          inputText = inputText.slice(0, inputPreviousWordStart) + edit_string.replace(/#(.)/g, '#');
          const afterErrorCount = countCharErrors(inputText, targetText);
          if (afterErrorCount > beforeErrorCount) {
            console.error("1: afterErrorCount > beforeErrorCount");
          }
          charErrorCount += afterErrorCount - beforeErrorCount;
          inputArea.value = inputText;
          if (edit_string.split('$').length === 2) {
            // then we have added a char so need to makes the per letter timings the same.
            const lastDollarIndex = inputText.lastIndexOf('$');
            currentPassageLetterTimesSec.splice(lastDollarIndex, 0, -1);
          }
          else {
            const lastHashIndex = edit_string.lastIndexOf('#');
            if (lastHashIndex == -1) {
              console.error("lastHashIndex == -1");
            }
            currentPassageLetterTimesSec.splice(inputPreviousWordStart + lastHashIndex + 1, 1);
          }
        }
      }
    }
    if (i > 0 && targetText[i - 1] == " ") {
      let targetPreviousWordStart = i - 2;
      while (targetPreviousWordStart > 0 && targetText[targetPreviousWordStart] != " ") {
        targetPreviousWordStart--;
      }
      let inputPreviousWordStart = i - 1;
      while (inputPreviousWordStart > 0 && inputText[inputPreviousWordStart] != " ") {
        inputPreviousWordStart--;
      }
      const currentWordTyped = inputText.slice(inputPreviousWordStart, i);
      const currentWordTarget = targetText.slice(targetPreviousWordStart, i - 1);
      if (!currentWordTyped.includes("$") && !currentWordTarget.includes("#")) {
        const edit_string = annotateEdits(currentWordTyped, currentWordTarget) + " ";
        if (edit_string.split('#').length + edit_string.split('$').length === 3 && edit_string.indexOf('^') === -1) {
          const beforeErrorCount = countCharErrors(inputText, targetText);
          inputText = inputText.slice(0, inputPreviousWordStart) + edit_string.replace(/#(.)/g, '#');
          const afterErrorCount = countCharErrors(inputText, targetText);
          if (afterErrorCount > beforeErrorCount) {
            console.error("2: afterErrorCount > beforeErrorCount");
          }
          charErrorCount += afterErrorCount - beforeErrorCount;
          inputArea.value = inputText;
          if (edit_string.split('$').length === 2) {
            // then we have added a char so need to makes the per letter timings the same.
            const lastDollarIndex = inputText.lastIndexOf('$');
            currentPassageLetterTimesSec.splice(lastDollarIndex, 0, -1);
          }
          else {
            const lastHashIndex = edit_string.lastIndexOf('#');
            if (lastHashIndex == -1) {
              console.error("lastHashIndex == -1");
            }
            currentPassageLetterTimesSec.splice(inputPreviousWordStart + lastHashIndex + 1, 1);
          }
        }
      }
    }
  }
  colorText(inputText);

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


  setupTopErrorsBox();
}

inputArea.addEventListener("paste", e => e.preventDefault());

inputArea.addEventListener('input', handleInput);

inputArea.addEventListener('keydown', function (e) {
  // Prevent left/right arrow keys and mouse clicks from moving cursor
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault();
  }
});

inputArea.addEventListener('mousedown', function (e) {
  // Prevent mouse clicks from moving cursor
  e.preventDefault();
  const end = this.value.length;
  this.setSelectionRange(end, end);
});

inputArea.addEventListener('select', function (e) {
  // Prevent text selection
  const end = this.value.length;
  this.setSelectionRange(end, end);
});

function calculateMetrics() {
  // const timeElapsedMins = (new Date() - startTime) / 60000; // minutes
  const cappedPassageLetterTimes = currentPassageLetterTimesSec.map(t => Math.max(0, Math.min(t, 2))); // cap the time for a letter at 2 seconds ~ 6wpm
  const timeElapsedMins = cappedPassageLetterTimes.reduce((a, b) => a + b, 0) / 60;
  const charsPerWord = 5.0;
  let lettersTyped = currentPassageLetterTimesSec.length;
  let rawWpm = lettersTyped / charsPerWord / timeElapsedMins;
  let wpm = Math.round(rawWpm);
  const rawErrRate = charErrorCount / charTotalCount;
  const errRate_percentile = betaCDF(rawErrRate, ERROR_RATE_DISTRIBUTION_PARAMS.a, ERROR_RATE_DISTRIBUTION_PARAMS.b, ERROR_RATE_DISTRIBUTION_PARAMS.loc, ERROR_RATE_DISTRIBUTION_PARAMS.scale);
  const wpm_percentile = gammaCDF(rawWpm, WPM_DISTRIBUTION_PARAMS.a, WPM_DISTRIBUTION_PARAMS.loc, WPM_DISTRIBUTION_PARAMS.scale);
  let accuracy = Math.round((1 - rawErrRate) * 100);
  wpm = isNaN(wpm) || !isFinite(wpm) ? 0 : wpm;
  accuracy = isNaN(accuracy) || !isFinite(accuracy) ? 100 : accuracy;
  return { wpm, accuracy, errRate_percentile, wpm_percentile };
}

const liveMetricsWpm = document.getElementById('wpm');
const liveMetricsAccuracy = document.getElementById('accuracy');
const liveMetricsReps = document.getElementById('session_rep_count');
function updateLiveMetrics() {
  const metrics = calculateMetrics();
  const wpm = metrics.wpm;
  const accuracy = metrics.accuracy;
  liveMetricsWpm.textContent = `WPM: ${wpm}`;
  liveMetricsWpm.style.display = 'block';
  liveMetricsAccuracy.textContent = `Accuracy: ${accuracy}%`;
  liveMetricsAccuracy.style.display = 'block';
  if (session_rep_count > 0) {
    liveMetricsReps.textContent = `Reps: ${session_rep_count}`;
    liveMetricsReps.style.display = 'block';
  }
}

function saveErrorData() {
  localStorage.setItem('errorLog', JSON.stringify(errorLog));
  localStorage.setItem('speedLog', JSON.stringify(speedLog));
  localStorage.setItem('seenLog', JSON.stringify(seenLog));
  localStorage.setItem('interestingErrorLog', JSON.stringify(interestingErrorLog));
}

function resetSession() {
  document.getElementById('socialProof').style.display = 'none';
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
  prevCharTime = null;
  currentPassageLetterTimesSec = [];
  currentPassageErrors = [];
  currentPassageErrorActualChar = [];
  // Add current passage to recent list
  if (targetText) {
    recentPassages.unshift(targetText);
    recentPassages = recentPassages.slice(0, MAX_RECENT_PASSAGES);
    localStorage.setItem('recentPassages', JSON.stringify(recentPassages));
  }

  const { passage, source, highlightIndecies, selectionStratedy: currentPassageSelectionStratedy } = getPassage();
  previousRepSelectionStrategies.unshift(currentPassageSelectionStratedy);
  setFocusText(currentPassageSelectionStratedy);
  targetText = passage;
  currentPassageSource = source;
  currentPassageSelectionStrategy = currentPassageSelectionStratedy;
  toHighlight = highlightIndecies;
  renderText();
  colorText("");
  inputArea.value = "";
  progressBar.style.width = "0%";
  passageWorker.postMessage({
    type: 'suggestStrategyFromSpeedLog',
    speedLog: speedLog,
    previousRepSelectionStrategies: previousRepSelectionStrategies
  });
}

function showTooltip(event, text) {
  const rect = event.target.getBoundingClientRect();
  tooltip.textContent = text;
  tooltip.style.opacity = '1';
  tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
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
  interestingErrorLog = {
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
  localStorage.removeItem('interestingErrorLog');
  localStorage.removeItem('speedLog');
  localStorage.removeItem('runHistory');
  localStorage.removeItem('repetition_count');

  // Update UI
  setupTopErrorsBox();
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

const logFeedbackToS3 = (feedback) => {
  try {
    const data = {
      uid: userId,
      timestamp: new Date().toISOString(),
      feedback: feedback
    };
    if (window.location.hostname === 'localhost' || window.location.hostname === '') {
      console.log('Feedback would be sent to S3:', JSON.stringify(data));
      return;
    }

    navigator.sendBeacon('https://fhh4l7u7d7.execute-api.eu-west-2.amazonaws.com/default/feedback-log', JSON.stringify(data));
  } catch (sendError) {
    originalConsoleError('Failed to send feedback to S3:', sendError);
  }
}

// Override console.error to automatically log all errors
console.error = function (...args) {
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

// Feedback Dialog functionality
function openFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  // Auto-focus the textarea
  setTimeout(() => {
    const textarea = document.getElementById('feedbackMessage');
    if (textarea) {
      textarea.focus();
    }
  }, 100); // Small delay to ensure modal is fully rendered
}

function closeFeedbackModal() {
  const modal = document.getElementById('feedbackModal');
  modal.style.display = 'none';
  document.body.style.overflow = 'auto'; // Restore scrolling
  // Reset form
  document.getElementById('feedbackForm').reset();
}

function handleFeedbackSubmission(event) {
  event.preventDefault();

  const message = document.getElementById('feedbackMessage').value.trim();
  const email = document.getElementById('feedbackEmail').value.trim();

  // Validate required fields
  if (!message) {
    alert('Please share your thoughts on how we can improve Typo Dojo.');
    return;
  }

  const feedbackData = {
    message: message,
    email: email
  };

  // Disable submit button to prevent double submission
  const submitButton = document.getElementById('submitFeedback');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  // Send feedback to S3
  logFeedbackToS3(feedbackData);

  // Show success message and close modal
  setTimeout(() => {
    closeFeedbackModal();
    submitButton.disabled = false;
    submitButton.textContent = 'Send Feedback';
  }, 100);
}

window.addEventListener('load', () => {
  document.getElementById('resetStats').addEventListener('click', resetStats);

  // Feedback dialog event listeners
  const feedbackButton = document.getElementById('feedbackButton');
  const closeButton = document.getElementById('closeFeedbackModal');
  const cancelButton = document.getElementById('cancelFeedback');
  const feedbackForm = document.getElementById('feedbackForm');
  const modal = document.getElementById('feedbackModal');

  if (feedbackButton) {
    feedbackButton.addEventListener('click', openFeedbackModal);
  }

  if (closeButton) {
    closeButton.addEventListener('click', closeFeedbackModal);
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', closeFeedbackModal);
  }

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', handleFeedbackSubmission);
  }

  // Close modal when clicking outside of it
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeFeedbackModal();
      }
    });
  }

  // Close modal with Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.style.display === 'block') {
      closeFeedbackModal();
    }
  });
});