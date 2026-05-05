export const PLACEMENT_STATUS_DATA = [
  { name: 'Placed', value: 342, color: '#10b981' },
  { name: 'In Progress', value: 556, color: '#6366f1' },
  { name: 'At Risk', value: 172, color: '#f43f5e' },
  { name: 'New', value: 170, color: '#f59e0b' },
];

export const SKILL_GAP_DISTRIBUTION = [
  { name: 'React', count: 450 },
  { name: 'Python', count: 320 },
  { name: 'SQL', count: 280 },
  { name: 'DS/Algo', count: 580 },
  { name: 'System Des', count: 210 }
];

export const READINESS_TREND_DATA = [
  { month: 'Jan', readiness: 45, target: 70 },
  { month: 'Feb', readiness: 52, target: 70 },
  { month: 'Mar', readiness: 48, target: 70 },
  { month: 'Apr', readiness: 61, target: 70 },
  { month: 'May', readiness: 64, target: 70 }
];

export function buildAdminStatCards(students, atRiskStudents) {
  const totalStudents = students.length || 1240;
  const placementReady = Math.max(342, totalStudents - atRiskStudents.length - 150);
  const avgReadinessBase = totalStudents > 0
    ? Math.max(52, Math.min(88, Math.round(((placementReady / totalStudents) * 100 + 38) / 2)))
    : 64;

  return [
    {
      title: 'Total Students',
      value: totalStudents.toLocaleString(),
      subtext: '+12% from last sem',
      iconKey: 'users',
      gradient: 'from-indigo-500 via-indigo-600 to-blue-700',
      trend: 'up'
    },
    {
      title: 'At-Risk',
      value: atRiskStudents.length,
      subtext: 'Needs Intervention',
      iconKey: 'alert',
      gradient: 'from-rose-500 via-pink-500 to-red-600',
      trend: 'flat'
    },
    {
      title: 'Avg Readiness',
      value: `${avgReadinessBase}%`,
      subtext: '+5.2% Growth',
      iconKey: 'trend',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      trend: 'up'
    },
    {
      title: 'Placement Ready',
      value: placementReady,
      subtext: '85% Market Match',
      iconKey: 'award',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
      trend: 'flat'
    }
  ];
}
