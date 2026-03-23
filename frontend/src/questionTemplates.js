/**
 * Parameterized Question Templates — Infinite Unique Questions
 * 
 * Generates mathematically correct questions with random values every time.
 * No API needed — pure JavaScript random generation with verified answers.
 * 
 * Covers: Percentages, Profit/Loss, Ratios, Speed/Distance/Time,
 *         Simple Interest, Averages, Algebra, Geometry, Number Series,
 *         Probability, and Logical Reasoning patterns.
 */

// ━━━━━━━━━ Helpers ━━━━━━━━━
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function roundTo(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function generateWrongOptions(correct, count = 3, spread = null) {
  const s = spread || Math.max(Math.abs(Math.round(correct * 0.3)), 3);
  const wrongs = new Set();
  let attempts = 0;
  while (wrongs.size < count && attempts < 100) {
    const offset = rand(1, s) * pick([-1, 1]);
    const wrong = typeof correct === 'number' ? correct + offset : correct;
    if (wrong !== correct && wrong > 0) wrongs.add(wrong);
    attempts++;
  }
  // Fallback if not enough wrongs
  while (wrongs.size < count) {
    wrongs.add(correct + wrongs.size + 1);
  }
  return [...wrongs].slice(0, count);
}

function buildMCQ(question, correct, unit = '', difficulty = 'medium') {
  const corrVal = typeof correct === 'number' ? roundTo(correct) : correct;
  const wrongs = generateWrongOptions(corrVal);
  const options = [...wrongs, corrVal].sort(() => Math.random() - 0.5);
  const answerIdx = options.indexOf(corrVal);
  const optionsStr = options.map(o => unit ? `${o} ${unit}` : `${o}`);

  return {
    id: `tpl_${Date.now()}_${rand(1000, 9999)}`,
    question,
    options: optionsStr,
    answer: answerIdx,
    difficulty,
    generated: true
  };
}

// ━━━━━━━━━ QUANTITATIVE TEMPLATES ━━━━━━━━━

function percentageQuestion() {
  const pct = pick([5, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40]);
  const base = pick([120, 150, 180, 200, 240, 250, 300, 350, 400, 450, 500, 600, 800]);
  const answer = (pct / 100) * base;
  return buildMCQ(`What is ${pct}% of ${base}?`, answer, '', 'easy');
}

function profitLossQuestion() {
  const cp = pick([100, 150, 200, 250, 300, 400, 500, 600, 750, 800]);
  const profitPct = pick([10, 15, 20, 25, 30, 40, 50]);
  const sp = cp * (1 + profitPct / 100);
  return buildMCQ(
    `A man buys an article for ₹${cp} and sells it for ₹${sp}. His profit percentage is:`,
    profitPct, '%', 'medium'
  );
}

function simpleInterestQuestion() {
  const principal = pick([2000, 3000, 4000, 5000, 6000, 8000, 10000]);
  const rate = pick([4, 5, 6, 7, 8, 10, 12]);
  const years = pick([2, 3, 4, 5]);
  const si = (principal * rate * years) / 100;
  return buildMCQ(
    `Simple interest on ₹${principal} at ${rate}% per annum for ${years} years is:`,
    si, '₹', 'easy'
  );
}

function speedDistTimeQuestion() {
  const speed = pick([30, 36, 40, 45, 48, 50, 54, 60, 72, 80, 90]);
  const time = pick([2, 3, 4, 5, 6, 8, 10]);
  const distance = speed * time;
  return buildMCQ(
    `A car travelling at ${speed} km/h covers a distance in ${time} hours. The distance is:`,
    distance, 'km', 'easy'
  );
}

function averageQuestion() {
  const count = pick([4, 5, 6, 7]);
  const nums = Array.from({ length: count }, () => rand(5, 50));
  const avg = roundTo(nums.reduce((a, b) => a + b, 0) / count);
  return buildMCQ(
    `Find the average of ${nums.join(', ')}:`,
    avg, '', 'easy'
  );
}

function ratioQuestion() {
  const a = rand(2, 8);
  const b = rand(2, 8);
  const total = pick([30, 40, 50, 60, 70, 80, 90, 100, 120]);
  const larger = Math.max(a, b);
  const answer = roundTo((larger / (a + b)) * total);
  return buildMCQ(
    `Two numbers are in ratio ${a}:${b}. If their sum is ${total}, the larger number is:`,
    answer, '', 'medium'
  );
}

function algebraQuestion() {
  const a = rand(2, 9);
  const x = rand(2, 12);
  const b = rand(1, 20);
  const result = a * x + b;
  return buildMCQ(
    `If ${a}x + ${b} = ${result}, what is x?`,
    x, '', 'easy'
  );
}

function areaQuestion() {
  const shapes = ['square', 'rectangle', 'circle'];
  const shape = pick(shapes);

  if (shape === 'square') {
    const side = pick([5, 6, 7, 8, 9, 10, 11, 12, 14, 15]);
    return buildMCQ(`What is the area of a square with side ${side} cm?`, side * side, 'cm²', 'easy');
  } else if (shape === 'rectangle') {
    const l = pick([8, 10, 12, 14, 15, 16, 18, 20]);
    const w = pick([3, 4, 5, 6, 7, 8, 9, 10]);
    return buildMCQ(`What is the area of a rectangle with length ${l} cm and width ${w} cm?`, l * w, 'cm²', 'easy');
  } else {
    const r = pick([3, 5, 7, 10, 14, 21]);
    return buildMCQ(`What is the area of a circle with radius ${r} cm? (Use π ≈ 3.14)`, roundTo(3.14 * r * r), 'cm²', 'medium');
  }
}

function compoundInterestQuestion() {
  const p = pick([5000, 8000, 10000, 12000, 15000, 20000]);
  const r = pick([5, 8, 10, 12]);
  const t = 2;
  const ci = roundTo(p * Math.pow(1 + r / 100, t) - p);
  return buildMCQ(
    `Compound interest on ₹${p} at ${r}% for ${t} years is:`,
    ci, '₹', 'medium'
  );
}

function workTimeQuestion() {
  const aDays = pick([6, 8, 10, 12, 15, 18, 20, 24, 30]);
  const bDays = pick([8, 10, 12, 15, 18, 20, 24, 30]);
  if (aDays === bDays) return workTimeQuestion(); // Retry
  const together = roundTo((aDays * bDays) / (aDays + bDays));
  return buildMCQ(
    `A can finish work in ${aDays} days, B in ${bDays} days. Working together, they finish in:`,
    together, 'days', 'medium'
  );
}

function pipeTankQuestion() {
  const aHrs = pick([6, 8, 10, 12, 15, 18, 20, 24]);
  const bHrs = pick([8, 10, 12, 15, 18, 20, 24, 30]);
  if (aHrs === bHrs) return pipeTankQuestion();
  const together = roundTo((aHrs * bHrs) / (aHrs + bHrs));
  return buildMCQ(
    `Pipe A fills a tank in ${aHrs} hours, Pipe B in ${bHrs} hours. Together they fill it in:`,
    together, 'hours', 'medium'
  );
}

function trainSpeedQuestion() {
  const length = pick([100, 120, 150, 180, 200, 240, 250, 300, 360]);
  const time = pick([5, 6, 8, 9, 10, 12, 15, 18, 20]);
  const speedMs = length / time;
  const speedKmh = roundTo(speedMs * 3.6);
  return buildMCQ(
    `A train ${length}m long passes a pole in ${time} seconds. Its speed in km/h is:`,
    speedKmh, 'km/h', 'medium'
  );
}

function permutationQuestion() {
  const n = pick([5, 6, 7, 8]);
  const r = pick([2, 3]);
  let pnr = 1;
  for (let i = 0; i < r; i++) pnr *= (n - i);
  return buildMCQ(
    `In how many ways can ${r} items be selected from ${n} items where order matters? (P(${n},${r}))`,
    pnr, '', 'hard'
  );
}

function combinationQuestion() {
  const n = pick([6, 7, 8, 9, 10]);
  const r = pick([2, 3, 4]);
  const factorial = (x) => { let f = 1; for (let i = 2; i <= x; i++) f *= i; return f; };
  const cnr = factorial(n) / (factorial(r) * factorial(n - r));
  return buildMCQ(
    `How many ways can you choose ${r} items from ${n}? (C(${n},${r}))`,
    cnr, '', 'hard'
  );
}

function probabilityQuestion() {
  const scenarios = [
    () => {
      const total = pick([5, 6, 8, 10, 12]);
      const favorable = rand(1, total - 1);
      const correct = roundTo(favorable / total * 100);
      const wrongs = generateWrongOptions(correct, 3, 15);
      const options = [...wrongs, correct].sort(() => Math.random() - 0.5);
      return {
        id: `tpl_${Date.now()}_${rand(1000, 9999)}`,
        question: `A bag has ${total} balls, ${favorable} are red. Probability of drawing a red ball (in %)?`,
        options: options.map(o => `${o}%`),
        answer: options.indexOf(correct),
        difficulty: 'medium',
        generated: true
      };
    },
    () => {
      const coins = pick([2, 3]);
      const totalOutcomes = Math.pow(2, coins);
      const allHeads = 1;
      const probPct = roundTo((allHeads / totalOutcomes) * 100);
      return buildMCQ(
        `${coins} fair coins are tossed. Probability of getting all heads (in %) is:`,
        probPct, '%', 'hard'
      );
    }
  ];
  return pick(scenarios)();
}

function boatStreamQuestion() {
  const stillSpeed = pick([8, 10, 12, 15, 18, 20]);
  const streamSpeed = pick([2, 3, 4, 5]);
  if (streamSpeed >= stillSpeed) return boatStreamQuestion();
  const upstream = stillSpeed - streamSpeed;
  const distance = upstream * pick([2, 3, 4, 5]);
  const time = roundTo(distance / upstream);
  return buildMCQ(
    `A boat's speed in still water is ${stillSpeed} km/h, stream speed is ${streamSpeed} km/h. Time to go ${distance} km upstream:`,
    time, 'hours', 'hard'
  );
}

// ━━━━━━━━━ REASONING TEMPLATES ━━━━━━━━━

function numberSeriesQuestion() {
  const types = [
    () => {
      const start = rand(2, 10);
      const diff = rand(2, 8);
      const series = Array.from({ length: 5 }, (_, i) => start + i * diff);
      const answer = start + 5 * diff;
      return buildMCQ(`Find the next: ${series.join(', ')}, ?`, answer, '', 'easy');
    },
    () => {
      const base = rand(2, 5);
      const series = Array.from({ length: 4 }, (_, i) => Math.pow(base, i + 1));
      const answer = Math.pow(base, 5);
      return buildMCQ(`Find the next: ${series.join(', ')}, ?`, answer, '', 'medium');
    },
    () => {
      const series = [];
      let val = rand(1, 5);
      let add = rand(2, 4);
      for (let i = 0; i < 5; i++) { series.push(val); val += add; add++; }
      return buildMCQ(`Find the next: ${series.join(', ')}, ?`, val, '', 'medium');
    },
    () => {
      const series = Array.from({ length: 5 }, (_, i) => (i + 1) * (i + 1));
      const answer = 36;
      return buildMCQ(`Find the next: ${series.join(', ')}, ?`, answer, '', 'easy');
    }
  ];
  return pick(types)();
}

function ageQuestion() {
  const multiplier = pick([2, 3]);
  const yearsAgo = pick([3, 4, 5, 6, 8, 10]);
  // A = multiplier * B; (A - yearsAgo) = (multiplier+1) * (B - yearsAgo)
  // multiplier*B - yearsAgo = (multiplier+1)*B - (multiplier+1)*yearsAgo
  // -yearsAgo = B - (multiplier+1)*yearsAgo
  // B = multiplier * yearsAgo
  const B = multiplier * yearsAgo;
  const A = multiplier * B;
  return buildMCQ(
    `A is ${multiplier} times as old as B. ${yearsAgo} years ago, A was ${multiplier + 1} times B's age. A's present age is:`,
    A, 'years', 'hard'
  );
}

function clockAngleQuestion() {
  const hour = rand(1, 12);
  const minute = pick([0, 15, 30, 45]);
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  let angle = Math.abs(hourAngle - minuteAngle);
  if (angle > 180) angle = 360 - angle;
  return buildMCQ(
    `A clock shows ${hour}:${minute.toString().padStart(2, '0')}. The angle between the hands is:`,
    angle, '°', 'hard'
  );
}

function codingPatternQuestion() {
  const shift = pick([1, 2, 3, 4]);
  const words = ['CAT', 'DOG', 'PEN', 'SUN', 'MAP', 'TOY', 'RED', 'HIT', 'FUN', 'BIG'];
  const word = pick(words);
  const coded = word.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift)).join('');
  // Now ask the reverse
  const testWords = words.filter(w => w !== word);
  const testWord = pick(testWords);
  const testCoded = testWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift)).join('');

  const wrongs = [
    testWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift + 1)).join(''),
    testWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift - 1)).join(''),
    testWord.split('').map(c => String.fromCharCode(c.charCodeAt(0) + shift + 2)).join('')
  ];

  const options = [...wrongs, testCoded].sort(() => Math.random() - 0.5);
  return {
    id: `tpl_${Date.now()}_${rand(1000, 9999)}`,
    question: `If '${word}' is coded as '${coded}', how is '${testWord}' coded?`,
    options,
    answer: options.indexOf(testCoded),
    difficulty: 'medium',
    generated: true
  };
}

function dayCalculationQuestion() {
  const today = pick(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysAhead = pick([45, 60, 75, 90, 100, 120, 150, 200]);
  const todayIdx = days.indexOf(today);
  const answerIdx = (todayIdx + daysAhead) % 7;
  const answer = days[answerIdx];

  const wrongDays = days.filter(d => d !== answer);
  const wrongs = [];
  while (wrongs.length < 3) {
    const w = pick(wrongDays.filter(d => !wrongs.includes(d)));
    if (w) wrongs.push(w);
  }
  const options = [...wrongs, answer].sort(() => Math.random() - 0.5);

  return {
    id: `tpl_${Date.now()}_${rand(1000, 9999)}`,
    question: `Today is ${today}. What day will it be ${daysAhead} days from now?`,
    options,
    answer: options.indexOf(answer),
    difficulty: 'medium',
    generated: true
  };
}

// ━━━━━━━━━ MAIN EXPORTS ━━━━━━━━━

const QUANT_GENERATORS = [
  percentageQuestion, profitLossQuestion, simpleInterestQuestion,
  speedDistTimeQuestion, averageQuestion, ratioQuestion, algebraQuestion,
  areaQuestion, compoundInterestQuestion, workTimeQuestion, pipeTankQuestion,
  trainSpeedQuestion, permutationQuestion, combinationQuestion,
  probabilityQuestion, boatStreamQuestion
];

const REASONING_GENERATORS = [
  numberSeriesQuestion, ageQuestion, clockAngleQuestion,
  codingPatternQuestion, dayCalculationQuestion
];

/**
 * Generate N unique parameterized questions for Quantitative section.
 * Each call produces brand new numbers — never the same test twice.
 */
export function generateQuantQuestions(count) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const gen = QUANT_GENERATORS[i % QUANT_GENERATORS.length];
    questions.push(gen());
  }
  return questions;
}

/**
 * Generate N unique parameterized questions for Reasoning section.
 */
export function generateReasoningQuestions(count) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    const gen = REASONING_GENERATORS[i % REASONING_GENERATORS.length];
    questions.push(gen());
  }
  return questions;
}
