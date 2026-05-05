export const BENCHMARK_DATA = [
  { name: 'Core CS', user: 82, market: 75 },
  { name: 'System Design', user: 65, market: 70 },
  { name: 'Frontend', user: 90, market: 68 },
  { name: 'Backend', user: 72, market: 78 },
  { name: 'DevOps', user: 45, market: 60 }
];

export function createInitialHistory() {
  const today = new Date();
  const baselineEntries = [10, 5, 2].map((daysAgo, index) => {
    const snapshot = new Date(today);
    snapshot.setDate(today.getDate() - daysAgo);

    const defaults = [
      { score: 65, readiness: 62, track: 'Software Engineer' },
      { score: 72, readiness: 68, track: 'Software Engineer' },
      { score: 78, readiness: 75, track: 'Data Scientist' }
    ];

    return {
      date: snapshot.toISOString().split('T')[0],
      ...defaults[index]
    };
  });

  return baselineEntries;
}

export function createEmptyGapReport(track) {
  return {
    current_skills: [],
    missing_skills: [],
    match_percent: 0,
    target_role: track
  };
}

export function buildLocalGapReportFromTest(track, scores) {
  const skillMap = {
    quantitative: ['Probability', 'Statistics', 'Algebra'],
    english: ['Communication', 'Grammar', 'Vocabulary'],
    reasoning: ['Logical Reasoning', 'Analytical Thinking', 'Pattern Recognition'],
    computer_science: ['Data Structures', 'Algorithms', 'OOP'],
    dsa_random_pool: ['Problem Solving', 'Coding Efficiency', 'Complexity Analysis']
  };

  const missing = Object.entries(scores)
    .filter(([key, score]) => key !== 'dsa_random_pool' && score.total > 0 && (score.score / score.total) < 0.6)
    .flatMap(([key]) => skillMap[key] || [])
    .slice(0, 5);

  const mastered = Object.entries(scores)
    .filter(([key, score]) => key !== 'dsa_random_pool' && score.total > 0 && (score.score / score.total) >= 0.6)
    .flatMap(([key]) => skillMap[key] || [])
    .slice(0, 5);

  return {
    target_role: track,
    match_percent: Math.round(
      (scores.quantitative?.score / (scores.quantitative?.total || 1)) * 20 +
      (scores.english?.score / (scores.english?.total || 1)) * 20 +
      (scores.reasoning?.score / (scores.reasoning?.total || 1)) * 20 +
      (scores.computer_science?.score / (scores.computer_science?.total || 1)) * 20 +
      Math.min(20, (scores.dsa_random_pool?.score || 0) * 3)
    ),
    current_skills: mastered,
    missing_skills: missing,
    recommended_certifications: ['Problem Solving', 'Aptitude', 'DSA Fundamentals'],
    test_gaps: missing
  };
}

export function buildRadarData(gapReport) {
  if (gapReport?.missing_skills) {
    const missingCount = gapReport.missing_skills.length;
    const techScore = Math.max(50, 100 - missingCount * 15);
    const quantScore = 70 + Math.random() * 25;
    const logicalScore = 65 + Math.random() * 30;
    const verbalScore = 60 + Math.random() * 30;

    return [
      { subject: 'Technical', A: techScore, full: 100 },
      { subject: 'Quantitative', A: quantScore, full: 100 },
      { subject: 'Logical', A: logicalScore, full: 100 },
      { subject: 'Verbal', A: verbalScore, full: 100 },
      { subject: 'Soft Skills', A: 80, full: 100 },
    ];
  }

  return [
    { subject: 'Technical', A: 85, full: 100 },
    { subject: 'Quantitative', A: 70, full: 100 },
    { subject: 'Logical', A: 75, full: 100 },
    { subject: 'Verbal', A: 65, full: 100 },
    { subject: 'Soft Skills', A: 80, full: 100 },
  ];
}

export function calculateReadinessScore(readiness, history, radarData) {
  if (readiness?.readiness_score_percent > 0) {
    return readiness.readiness_score_percent;
  }

  if (radarData?.length) {
    const total = radarData.reduce((sum, item) => sum + item.A, 0);
    return total / radarData.length;
  }

  return history[history.length - 1]?.readiness || 0;
}
