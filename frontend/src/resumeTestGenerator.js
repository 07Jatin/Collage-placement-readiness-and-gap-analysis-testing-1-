/**
 * Resume-Based Test Generator Engine
 * 
 * Parses resume text, extracts skills/projects, and generates
 * a unique randomized placement mock test every time.
 */

import {
  QUANTITATIVE_BANK,
  ENGLISH_BANK,
  REASONING_BANK,
  CS_BANK,
  DSA_BANK
} from './mockTestQuestionBank';
import { generateQuantQuestions, generateReasoningQuestions } from './questionTemplates';

// ━━━━━━━━━ Utility: Shuffle Array (Fisher-Yates) ━━━━━━━━━
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ━━━━━━━━━ Utility: Generate unique test ID ━━━━━━━━━
function generateTestId() {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `PMOCK-${ts}-${rand}`.toUpperCase();
}

// ━━━━━━━━━ Question History Tracking ━━━━━━━━━
// Tracks which questions a student has already seen across test attempts.
// Prioritizes unseen questions first; resets history after 10 tests or when
// all questions in a bank have been exhausted.
const HISTORY_KEY = 'placify_question_history';
const MAX_HISTORY_TESTS = 10;

function getQuestionHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { seenIds: [], testCount: 0 };
}

function saveQuestionHistory(pickedIds) {
  try {
    const history = getQuestionHistory();
    const newSeen = [...new Set([...history.seenIds, ...pickedIds])];
    const newCount = history.testCount + 1;
    // Auto-reset history after MAX_HISTORY_TESTS to keep tests fresh
    if (newCount >= MAX_HISTORY_TESTS) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify({ seenIds: pickedIds, testCount: 1 }));
    } else {
      localStorage.setItem(HISTORY_KEY, JSON.stringify({ seenIds: newSeen, testCount: newCount }));
    }
  } catch (e) { /* ignore */ }
}

// ━━━━━━━━━ Utility: Pick N questions with difficulty mix ━━━━━━━━━
// 30% Easy, 50% Medium, 20% Hard
// Prioritizes questions the student has NOT seen before.
function pickWithDifficultyMix(bank, count, seenIds = new Set()) {
  // Split into unseen and seen, then shuffle each
  const unseen = bank.filter(q => !seenIds.has(q.id));
  const seen = bank.filter(q => seenIds.has(q.id));

  // Helper: pick from unseen first, then fill from seen
  function pickByDifficulty(difficulty, needed) {
    const fresh = shuffle(unseen.filter(q => q.difficulty === difficulty));
    const stale = shuffle(seen.filter(q => q.difficulty === difficulty));
    return [...fresh, ...stale].slice(0, needed);
  }

  const easyCount = Math.round(count * 0.3);
  const hardCount = Math.round(count * 0.2);
  const mediumCount = count - easyCount - hardCount;

  let picked = [
    ...pickByDifficulty('easy', easyCount),
    ...pickByDifficulty('medium', mediumCount),
    ...pickByDifficulty('hard', hardCount)
  ];

  // If we don't have enough of a type, fill from remaining unseen then seen
  if (picked.length < count) {
    const pickedIds = new Set(picked.map(q => q.id));
    const freshRemaining = shuffle(unseen.filter(q => !pickedIds.has(q.id)));
    const staleRemaining = shuffle(seen.filter(q => !pickedIds.has(q.id)));
    const remaining = [...freshRemaining, ...staleRemaining];
    picked = [...picked, ...remaining.slice(0, count - picked.length)];
  }

  // Also shuffle the option order for MCQ questions to add extra variety
  picked = picked.map(q => {
    if (q.options && q.answer !== undefined) {
      // Shuffle options and update answer index
      const optionsWithIdx = q.options.map((opt, idx) => ({ opt, isAnswer: idx === q.answer }));
      const shuffled = shuffle(optionsWithIdx);
      return {
        ...q,
        options: shuffled.map(o => o.opt),
        answer: shuffled.findIndex(o => o.isAnswer)
      };
    }
    return q;
  });

  return shuffle(picked).slice(0, count);
}

// ━━━━━━━━━ Resume Analysis ━━━━━━━━━
function analyzeResume(resumeText) {
  // Normalize text: collapse extra whitespace, handle PDF artifacts
  const text = resumeText
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .toLowerCase();

  // Skill patterns — broad, forgiving patterns for real-world resumes
  const skillPatterns = {
    'Python': /python/i,
    'JavaScript': /javascript|java\s*script/i,
    'React': /\breact\b|react\.?js|react\s*native|next\.?js|nextjs/i,
    'Java': /\bjava\b(?!\s*script)/i,
    'C++': /\bc\s*\+\s*\+|cpp\b/i,
    'C#': /\bc\s*#|c\s*sharp|\.net\b|asp\.net/i,
    'C Language': /\bc\s+programming|c\s+language|\bc\b(?=\s*[,\/&])/i,
    'SQL': /\bsql\b|mysql|postgres|postgresql|sqlite|oracle\s*db|plsql|pl\/sql|sql\s*server/i,
    'MongoDB': /mongo\s*db|nosql|mongoose/i,
    'Docker': /docker|container\s*iz/i,
    'Kubernetes': /kubernetes|k8s/i,
    'AWS': /\baws\b|amazon\s*web|ec2|s3\b|lambda|cloud\s*formation|dynamo\s*db/i,
    'Azure': /\bazure\b|microsoft\s*cloud/i,
    'GCP': /\bgcp\b|google\s*cloud|bigquery|firebase/i,
    'Machine Learning': /machine\s*learning|deep\s*learning|neural\s*net|tensorflow|pytorch|keras|scikit|xgboost|random\s*forest|svm\b|nlp\b|computer\s*vision/i,
    'Data Science': /data\s*scien|data\s*analy|big\s*data|data\s*engineer/i,
    'Git': /\bgit\b|github|gitlab|bitbucket|version\s*control/i,
    'Linux': /\blinux\b|ubuntu|centos|debian|unix\b/i,
    'REST API': /rest\s*(ful)?(\s*api)?|api\s*develop|microservice|graphql|swagger|postman/i,
    'Django': /\bdjango\b/i,
    'Flask': /\bflask\b|fast\s*api|fastapi/i,
    'Node.js': /node\.?\s*js|express\.?\s*js|express\s*server/i,
    'HTML/CSS': /\bhtml\b|\bcss\b|tailwind|bootstrap|sass|scss|responsive\s*design/i,
    'TypeScript': /type\s*script/i,
    'CI/CD': /ci\s*\/?\s*cd|jenkins|github\s*actions|circle\s*ci|travis|gitlab\s*ci|devops\s*pipeline/i,
    'Pandas': /\bpandas\b|numpy|scipy|matplotlib|data\s*frame/i,
    'TensorFlow': /tensor\s*flow|py\s*torch|keras/i,
    'Algorithms': /algorithm|data\s*structure|\bdsa\b|sorting|searching|dynamic\s*program|competitive\s*program/i,
    'Networking': /network\s*ing|tcp\s*\/?\s*ip|http|dns\b|osi\s*model|socket\s*program/i,
    'DBMS': /\bdbms\b|database|normalization|rdbms\b|entity\s*relation/i,
    'Angular': /angular/i,
    'Vue': /\bvue\b|vue\.?\s*js|vuex|nuxt/i,
    'Spring Boot': /spring\s*boot|spring\s*framework|spring\s*mvc/i,
    'Ruby': /\bruby\b|rails|ruby\s*on\s*rails/i,
    'PHP': /\bphp\b|laravel|symfony|wordpress/i,
    'Swift': /\bswift\b|ios\s*develop|swiftui/i,
    'Kotlin': /\bkotlin\b|android\s*develop/i,
    'Go': /\bgolang\b|\bgo\s+language|\bgo\b(?=\s*[,\/&])/i,
    'Rust': /\brust\b(?!\s*y)/i,
    'Power BI': /power\s*bi|tableau|data\s*visual/i,
    'Excel': /\bexcel\b|spreadsheet|vlookup|pivot\s*table/i,
    'Agile': /\bagile\b|scrum|kanban|sprint/i,
    'R Language': /\br\b\s*(program|studio|language|statistic)/i,
    'Selenium': /selenium|test\s*auto|cypress|playwright|jest/i,
    'Hadoop': /hadoop|spark|hive|mapreduce|pig\b/i,
  };

  const topSkills = [];
  Object.entries(skillPatterns).forEach(([skill, pattern]) => {
    if (pattern.test(text)) {
      topSkills.push(skill);
    }
  });

  // If no skills found, add a generic fallback
  if (topSkills.length === 0) {
    topSkills.push('General Programming');
  }

  // Role suggestion based on skills
  const suggestedRoles = [];
  if (topSkills.some(s => ['React', 'HTML/CSS', 'JavaScript', 'TypeScript', 'Angular', 'Vue'].includes(s))) {
    suggestedRoles.push('Frontend Developer');
  }
  if (topSkills.some(s => ['Python', 'Django', 'Flask', 'REST API', 'Java', 'Node.js', 'Spring Boot', 'PHP', 'Go'].includes(s))) {
    suggestedRoles.push('Backend Developer');
  }
  if (topSkills.some(s => ['Machine Learning', 'Data Science', 'Pandas', 'TensorFlow', 'R Language', 'Hadoop'].includes(s))) {
    suggestedRoles.push('Data Scientist');
  }
  if (topSkills.some(s => ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD'].includes(s))) {
    suggestedRoles.push('DevOps Engineer');
  }
  if (topSkills.some(s => ['React', 'REST API', 'SQL', 'Docker', 'Node.js'].includes(s))) {
    suggestedRoles.push('Full Stack Developer');
  }
  if (topSkills.some(s => ['Swift', 'Kotlin'].includes(s))) {
    suggestedRoles.push('Mobile Developer');
  }
  if (topSkills.some(s => ['Power BI', 'Excel', 'Data Science'].includes(s))) {
    suggestedRoles.push('Data Analyst');
  }
  if (topSkills.some(s => ['Selenium'].includes(s))) {
    suggestedRoles.push('QA / Test Engineer');
  }
  if (suggestedRoles.length === 0) suggestedRoles.push('Software Engineer');

  // Extract skill IDs that map to DSA tags
  const skillIds = [];
  if (/python/i.test(text)) skillIds.push('python');
  if (/react/i.test(text)) skillIds.push('react');
  if (/rest|api/i.test(text)) skillIds.push('rest-api');
  if (/docker/i.test(text)) skillIds.push('docker');
  if (/data.?struct/i.test(text)) skillIds.push('data-structures');
  if (/algorithm|\bdsa\b/i.test(text)) skillIds.push('algorithms');
  if (/sql|database/i.test(text)) skillIds.push('sql');

  return { topSkills, suggestedRoles, skillIds };
}

// ━━━━━━━━━ Main: Generate Test ━━━━━━━━━
export function generatePlacementTest(resumeText) {
  const analysis = analyzeResume(resumeText);

  // Load question history to avoid repeating questions
  const history = getQuestionHistory();
  const seenIds = new Set(history.seenIds);

  // 1. Quantitative: HYBRID — 12 from template (infinite unique) + 13 from static bank
  const quantTemplated = generateQuantQuestions(12);
  const quantStatic = pickWithDifficultyMix(QUANTITATIVE_BANK, 13, seenIds);
  const quantitative = shuffle([...quantTemplated, ...quantStatic]).map((q, i) => ({
    ...q, _origId: q.id, id: i + 1
  }));

  // 2. English: pick 25 from static bank (templates don't work well for language)
  const english = pickWithDifficultyMix(ENGLISH_BANK, 25, seenIds).map((q, i) => ({
    ...q, _origId: q.id, id: i + 1
  }));

  // 3. Reasoning: HYBRID — 10 from template (infinite unique) + 20 from static bank
  const reasonTemplated = generateReasoningQuestions(10);
  const reasonStatic = pickWithDifficultyMix(REASONING_BANK, 20, seenIds);
  const reasoning = shuffle([...reasonTemplated, ...reasonStatic]).map((q, i) => ({
    ...q, _origId: q.id, id: i + 1
  }));

  // 4. Computer Science: pick 15
  const computer_science = pickWithDifficultyMix(CS_BANK, 15, seenIds).map((q, i) => ({
    ...q, _origId: q.id, id: i + 1
  }));

  // 5. DSA Random Pool: Pick 6 relevant to resume skills
  let dsaPool = DSA_BANK;
  // Separate unseen and seen DSA questions
  const unseenDSA = dsaPool.filter(q => !seenIds.has(q.id));
  const seenDSA = dsaPool.filter(q => seenIds.has(q.id));

  if (analysis.skillIds.length > 0) {
    // Prioritize unseen questions tagged with user's skills
    const relevantFresh = unseenDSA.filter(q =>
      q.tags.some(t => analysis.skillIds.includes(t))
    );
    const othersFresh = unseenDSA.filter(q =>
      !q.tags.some(t => analysis.skillIds.includes(t))
    );
    const relevantStale = seenDSA.filter(q =>
      q.tags.some(t => analysis.skillIds.includes(t))
    );
    const othersStale = seenDSA.filter(q =>
      !q.tags.some(t => analysis.skillIds.includes(t))
    );
    dsaPool = [...shuffle(relevantFresh), ...shuffle(othersFresh), ...shuffle(relevantStale), ...shuffle(othersStale)];
  } else {
    dsaPool = [...shuffle(unseenDSA), ...shuffle(seenDSA)];
  }
  const dsa_random_pool = dsaPool.slice(0, 6).map((q, i) => ({
    ...q, _origId: q.id, id: i + 1
  }));

  // Save all picked question IDs to history so they are deprioritized next time
  const allPickedIds = [
    ...quantitative, ...english, ...reasoning, ...computer_science, ...dsa_random_pool
  ].map(q => q._origId);
  saveQuestionHistory(allPickedIds);

  return {
    test_id: generateTestId(),
    resume_analysis: {
      top_skills: analysis.topSkills,
      suggested_roles: analysis.suggestedRoles
    },
    sections: {
      quantitative,
      english,
      reasoning,
      computer_science,
      dsa_random_pool
    }
  };
}

