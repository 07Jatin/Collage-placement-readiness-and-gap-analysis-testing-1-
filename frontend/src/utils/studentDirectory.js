export const SKILL_COLORS = {
    python: { bg: 'from-blue-500/15 to-cyan-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    react: { bg: 'from-cyan-500/15 to-sky-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
    sql: { bg: 'from-amber-500/15 to-orange-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    docker: { bg: 'from-blue-500/15 to-indigo-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
    kubernetes: { bg: 'from-indigo-500/15 to-purple-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
    aws: { bg: 'from-orange-500/15 to-amber-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
    algorithms: { bg: 'from-emerald-500/15 to-teal-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
    'data-structures': { bg: 'from-teal-500/15 to-cyan-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    'rest-api': { bg: 'from-violet-500/15 to-purple-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
    'machine-learning': { bg: 'from-rose-500/15 to-pink-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
    linux: { bg: 'from-slate-500/15 to-gray-500/10', text: 'text-slate-300', border: 'border-slate-500/20' },
    git: { bg: 'from-red-500/15 to-orange-500/10', text: 'text-red-400', border: 'border-red-500/20' },
    statistics: { bg: 'from-green-500/15 to-emerald-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    pandas: { bg: 'from-purple-500/15 to-fuchsia-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
    'ci-cd': { bg: 'from-sky-500/15 to-blue-500/10', text: 'text-sky-400', border: 'border-sky-500/20' },
};

const DEFAULT_SKILL_STYLE = {
    bg: 'from-gray-500/15 to-slate-500/10',
    text: 'text-gray-400',
    border: 'border-gray-500/20'
};

const STATUS_CONFIG = {
    Placed: { color: 'text-emerald-400', bg: 'from-emerald-500/15 to-teal-500/10', border: 'border-emerald-500/25', dot: 'bg-emerald-400' },
    'In Progress': { color: 'text-indigo-400', bg: 'from-indigo-500/15 to-blue-500/10', border: 'border-indigo-500/25', dot: 'bg-indigo-400' },
    'At Risk': { color: 'text-rose-400', bg: 'from-rose-500/15 to-red-500/10', border: 'border-rose-500/25', dot: 'bg-rose-400' },
    default: { color: 'text-amber-400', bg: 'from-amber-500/15 to-orange-500/10', border: 'border-amber-500/25', dot: 'bg-amber-400' }
};

export function getSkillStyle(skill) {
    return SKILL_COLORS[skill] || DEFAULT_SKILL_STYLE;
}

export function getStatusConfig(status) {
    return STATUS_CONFIG[status] || STATUS_CONFIG.default;
}

export function normalizeStudents(students) {
    if (!Array.isArray(students)) {
        return [];
    }

    return students.map((student) => ({
        ...student,
        readiness: student.readiness || Math.floor(Math.random() * 40 + 40),
        placementStatus: student.placementStatus || 'In Progress',
        lastActive: student.lastActive || new Date().toISOString().split('T')[0],
        testsCompleted: student.testsCompleted || Math.floor(Math.random() * 10),
        avgTestScore: student.avgTestScore || Math.floor(Math.random() * 40 + 40),
        trend: student.trend || 'flat',
        department: student.department || 'Unknown',
        semester: student.semester || 1,
        current_skills: student.current_skills || [],
        projects: student.projects || [],
        cgpa: student.cgpa || 0.0
    }));
}

export function buildStudentStats(studentDirectory) {
    const total = studentDirectory.length;
    const placed = studentDirectory.filter((student) => student.placementStatus === 'Placed').length;
    const atRisk = studentDirectory.filter((student) => student.placementStatus === 'At Risk').length;
    const avgReadiness = total > 0
        ? Math.round(studentDirectory.reduce((acc, student) => acc + student.readiness, 0) / total)
        : 0;

    return { total, placed, atRisk, avgReadiness };
}

export function filterAndSortStudents(studentDirectory, filters) {
    const { departmentFilter, searchQuery, sortDirection, sortField, statusFilter } = filters;
    let result = [...studentDirectory];

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter((student) =>
            student.name.toLowerCase().includes(query) ||
            student.id.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query) ||
            student.department.toLowerCase().includes(query) ||
            student.current_skills.some((skill) => skill.toLowerCase().includes(query))
        );
    }

    if (statusFilter !== 'All') {
        result = result.filter((student) => student.placementStatus === statusFilter);
    }

    if (departmentFilter !== 'All') {
        result = result.filter((student) => student.department === departmentFilter);
    }

    result.sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
            case 'name': comparison = a.name.localeCompare(b.name); break;
            case 'cgpa': comparison = a.cgpa - b.cgpa; break;
            case 'readiness': comparison = a.readiness - b.readiness; break;
            case 'skills': comparison = a.current_skills.length - b.current_skills.length; break;
            case 'tests': comparison = a.testsCompleted - b.testsCompleted; break;
            default: comparison = 0;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
}

export function buildDepartmentOptions(studentDirectory) {
    return ['All', ...new Set(studentDirectory.map((student) => student.department))];
}
