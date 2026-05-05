import React, { useState, useMemo } from 'react';
import {
    Search, Filter, ChevronDown, ChevronUp, Eye, X,
    GraduationCap, Code2, FolderGit2, Star, Users,
    ArrowUpRight, ArrowDownRight, SlidersHorizontal,
    BookOpen, Award, TrendingUp, UserCheck
} from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MOCK STUDENT DATA (expanded from student_data.json)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Skill Badge Colors
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SKILL_COLORS = {
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

const getSkillStyle = (skill) => SKILL_COLORS[skill] || { bg: 'from-gray-500/15 to-slate-500/10', text: 'text-gray-400', border: 'border-gray-500/20' };

const getStatusConfig = (status) => {
    switch (status) {
        case 'Placed': return { color: 'text-emerald-400', bg: 'from-emerald-500/15 to-teal-500/10', border: 'border-emerald-500/25', dot: 'bg-emerald-400' };
        case 'In Progress': return { color: 'text-indigo-400', bg: 'from-indigo-500/15 to-blue-500/10', border: 'border-indigo-500/25', dot: 'bg-indigo-400' };
        case 'At Risk': return { color: 'text-rose-400', bg: 'from-rose-500/15 to-red-500/10', border: 'border-rose-500/25', dot: 'bg-rose-400' };
        default: return { color: 'text-amber-400', bg: 'from-amber-500/15 to-orange-500/10', border: 'border-amber-500/25', dot: 'bg-amber-400' };
    }
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Student Detail Modal
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const StudentDetailModal = ({ student, onClose, darkMode }) => {
    if (!student) return null;
    const statusConfig = getStatusConfig(student.placementStatus);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

            {/* Modal */}
            <div
                className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl border animate-in transition-colors duration-500 ${darkMode
                    ? 'bg-[#1a1d2e] border-indigo-500/15 shadow-indigo-500/5'
                    : 'bg-white border-slate-200'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Gradient */}
                <div className="relative overflow-hidden rounded-t-[2rem] p-8 pb-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-white/5 rounded-full translate-y-1/2"></div>
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                    >
                        <X size={16} />
                    </button>
                    <div className="relative z-10 flex items-center space-x-5">
                        <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-black shadow-xl border border-white/20">
                            {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">{student.name}</h2>
                            <p className="text-white/70 text-sm font-medium mt-1">{student.email}</p>
                            <div className="flex items-center space-x-3 mt-2">
                                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{student.id}</span>
                                <span className="text-white/30">•</span>
                                <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{student.department}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="relative -mt-12 mx-6 grid grid-cols-4 gap-3 z-10">
                    {[
                        { label: 'CGPA', value: student.cgpa.toFixed(2), icon: GraduationCap, gradient: 'from-indigo-500 to-blue-600' },
                        { label: 'Readiness', value: `${student.readiness}%`, icon: TrendingUp, gradient: 'from-emerald-500 to-teal-600' },
                        { label: 'Tests', value: student.testsCompleted, icon: BookOpen, gradient: 'from-amber-500 to-orange-600' },
                        { label: 'Avg Score', value: `${student.avgTestScore}%`, icon: Award, gradient: 'from-rose-500 to-pink-600' },
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-2xl p-4 text-center shadow-lg ${darkMode ? 'bg-[#161825] border border-white/5' : 'bg-white border border-slate-100 shadow-slate-200/50'}`}>
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-2 shadow-md`}>
                                <stat.icon size={14} className="text-white" />
                            </div>
                            <p className="text-lg font-black">{stat.value}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 mt-2">
                    {/* Status & Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-gradient-to-r ${statusConfig.bg} ${statusConfig.color} border ${statusConfig.border} inline-flex items-center`}>
                                <span className={`w-2 h-2 rounded-full ${statusConfig.dot} mr-2 animate-pulse`}></span>
                                {student.placementStatus}
                            </span>
                            <span className="text-xs font-medium opacity-40">Semester {student.semester}</span>
                        </div>
                        <span className="text-xs font-medium opacity-40">Last Active: {student.lastActive}</span>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-3 flex items-center">
                            <Code2 size={14} className="mr-2" /> Skills ({student.current_skills.length})
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {student.current_skills.map((skill, i) => {
                                const style = getSkillStyle(skill);
                                return (
                                    <span key={i} className={`px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r ${style.bg} ${style.text} border ${style.border} capitalize`}>
                                        {skill.replace(/-/g, ' ')}
                                    </span>
                                );
                            })}
                        </div>
                    </div>

                    {/* Projects */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-3 flex items-center">
                            <FolderGit2 size={14} className="mr-2" /> Projects ({student.projects.length})
                        </h3>
                        {student.projects.length > 0 ? (
                            <div className="grid grid-cols-2 gap-3">
                                {student.projects.map((proj, i) => (
                                    <div key={i} className={`rounded-xl p-4 border transition-all hover:-translate-y-0.5 ${darkMode
                                        ? 'bg-white/5 border-white/5 hover:border-indigo-500/20'
                                        : 'bg-slate-50 border-slate-200 hover:border-indigo-200'
                                        }`}>
                                        <p className="font-bold text-sm mb-2">{proj.name}</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {proj.tech.map((t, j) => (
                                                <span key={j} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 capitalize">
                                                    {t.replace(/-/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className={`text-sm font-medium py-4 text-center rounded-xl ${darkMode ? 'bg-white/5' : 'bg-slate-50'} opacity-50`}>
                                No projects submitted yet
                            </p>
                        )}
                    </div>

                    {/* Readiness Bar */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-3 flex items-center">
                            <TrendingUp size={14} className="mr-2" /> Readiness Score
                        </h3>
                        <div className={`rounded-xl p-4 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-bold">{student.readiness}%</span>
                                <span className={`text-xs font-bold flex items-center ${student.readiness >= 70 ? 'text-emerald-400' : student.readiness >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                                    {student.trend === 'up' && <><ArrowUpRight size={12} className="mr-1" /> Improving</>}
                                    {student.trend === 'down' && <><ArrowDownRight size={12} className="mr-1" /> Declining</>}
                                    {student.trend === 'flat' && <>— Stable</>}
                                </span>
                            </div>
                            <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-200'}`}>
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${student.readiness >= 70
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                        : student.readiness >= 50
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                                            : 'bg-gradient-to-r from-rose-500 to-pink-400'
                                        }`}
                                    style={{ width: `${student.readiness}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main ManageStudentsView Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ManageStudentsView = ({ darkMode = false, students = [] }) => {
    const STUDENT_DATABASE = useMemo(() => {
        if (!Array.isArray(students)) return [];
        return students.map(s => ({
            ...s,
            readiness: s.readiness || Math.floor(Math.random() * 40 + 40),
            placementStatus: s.placementStatus || "In Progress",
            lastActive: s.lastActive || new Date().toISOString().split('T')[0],
            testsCompleted: s.testsCompleted || Math.floor(Math.random() * 10),
            avgTestScore: s.avgTestScore || Math.floor(Math.random() * 40 + 40),
            trend: s.trend || "flat",
            department: s.department || "Unknown",
            semester: s.semester || 1,
            current_skills: s.current_skills || [],
            projects: s.projects || [],
            cgpa: s.cgpa || 0.0
        }));
    }, [students]);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    // Summary stats
    const stats = useMemo(() => {
        const total = STUDENT_DATABASE.length;
        const placed = STUDENT_DATABASE.filter(s => s.placementStatus === 'Placed').length;
        const atRisk = STUDENT_DATABASE.filter(s => s.placementStatus === 'At Risk').length;
        const avgReadiness = Math.round(STUDENT_DATABASE.reduce((acc, s) => acc + s.readiness, 0) / total);
        return { total, placed, atRisk, avgReadiness };
    }, []);

    // Filter and sort students
    const filteredStudents = useMemo(() => {
        let result = [...STUDENT_DATABASE];

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.id.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.department.toLowerCase().includes(q) ||
                s.current_skills.some(sk => sk.toLowerCase().includes(q))
            );
        }

        // Status filter
        if (statusFilter !== 'All') {
            result = result.filter(s => s.placementStatus === statusFilter);
        }

        // Department filter
        if (departmentFilter !== 'All') {
            result = result.filter(s => s.department === departmentFilter);
        }

        // Sort
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
    }, [searchQuery, statusFilter, departmentFilter, sortField, sortDirection]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronDown size={12} className="opacity-30 ml-1" />;
        return sortDirection === 'asc'
            ? <ChevronUp size={12} className="text-indigo-400 ml-1" />
            : <ChevronDown size={12} className="text-indigo-400 ml-1" />;
    };

    const departments = ['All', ...new Set(STUDENT_DATABASE.map(s => s.department))];

    return (
        <div className="space-y-8 animate-in pb-12">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight">
                        Manage <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Students</span>
                    </h1>
                    <p className="font-medium opacity-60">Complete student directory with skills, readiness, and placement tracking.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-indigo-500/20">
                        <UserCheck size={18} className="mr-2" />
                        {stats.total} Students
                    </div>
                </div>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                    { label: 'Total Students', value: stats.total, icon: Users, gradient: 'from-indigo-500 via-indigo-600 to-blue-700', change: '+12%', up: true },
                    { label: 'Placed', value: stats.placed, icon: Award, gradient: 'from-emerald-400 via-teal-500 to-cyan-600', change: `${Math.round(stats.placed / stats.total * 100)}% of total`, up: true },
                    { label: 'At Risk', value: stats.atRisk, icon: TrendingUp, gradient: 'from-rose-500 via-pink-500 to-red-600', change: 'Needs attention', up: false },
                    { label: 'Avg Readiness', value: `${stats.avgReadiness}%`, icon: Star, gradient: 'from-amber-400 via-orange-500 to-red-500', change: '+5.2% Growth', up: true },
                ].map((card, i) => (
                    <div key={i} className={`relative overflow-hidden p-6 rounded-[2rem] shadow-lg bg-gradient-to-br ${card.gradient} hover:-translate-y-2 transition-all duration-300`}>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-white/80 text-sm font-bold">{card.label}</p>
                                <card.icon size={20} className="text-white/60" />
                            </div>
                            <p className="text-3xl font-black text-white">{card.value}</p>
                            <p className="text-white/50 text-xs font-medium mt-1 flex items-center">
                                {card.up ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                                {card.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="premium-card p-6">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    {/* Search */}
                    <div className={`flex-1 relative`}>
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
                        <input
                            type="text"
                            placeholder="Search by name, Roll No/ID, email, skill..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all ${darkMode
                                ? 'bg-white/5 border-white/10 text-white placeholder-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                                }`}
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center space-x-2">
                        <Filter size={14} className="opacity-40" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={`px-4 py-3 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer ${darkMode
                                ? 'bg-white/5 border-white/10 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                        >
                            <option value="All">All Status</option>
                            <option value="Placed">Placed</option>
                            <option value="In Progress">In Progress</option>
                            <option value="At Risk">At Risk</option>
                        </select>
                    </div>

                    {/* Department Filter */}
                    <div className="flex items-center space-x-2">
                        <SlidersHorizontal size={14} className="opacity-40" />
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className={`px-4 py-3 rounded-xl text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer ${darkMode
                                ? 'bg-white/5 border-white/10 text-white'
                                : 'bg-slate-50 border-slate-200 text-slate-900'
                                }`}
                        >
                            {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                        </select>
                    </div>

                    {/* View Toggle */}
                    <div className={`flex rounded-xl border overflow-hidden ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                        <button
                            onClick={() => setViewMode('table')}
                            className={`px-4 py-3 text-sm font-bold transition-all ${viewMode === 'table'
                                ? 'bg-indigo-600 text-white shadow-lg' : darkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            Table
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-3 text-sm font-bold transition-all ${viewMode === 'grid'
                                ? 'bg-indigo-600 text-white shadow-lg' : darkMode ? 'text-slate-400 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            Grid
                        </button>
                    </div>
                </div>

                {/* Result count */}
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40">
                        Showing {filteredStudents.length} of {STUDENT_DATABASE.length} students
                    </p>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="premium-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className={`border-b ${darkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                    {[
                                        { key: 'name', label: 'Student' },
                                        { key: 'cgpa', label: 'CGPA' },
                                        { key: 'skills', label: 'Skills' },
                                        { key: 'readiness', label: 'Readiness' },
                                        { key: 'tests', label: 'Tests' },
                                        { key: null, label: 'Status' },
                                        { key: null, label: 'Action' },
                                    ].map((col, i) => (
                                        <th
                                            key={i}
                                            className={`px-6 py-5 font-bold text-xs uppercase tracking-widest opacity-50 ${col.key ? 'cursor-pointer hover:opacity-80 select-none' : ''} ${i === 6 ? 'text-right' : ''}`}
                                            onClick={() => col.key && handleSort(col.key)}
                                        >
                                            <span className="flex items-center">
                                                {col.label}
                                                {col.key && <SortIcon field={col.key} />}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${darkMode ? 'divide-slate-700/30' : 'divide-slate-50'}`}>
                                {filteredStudents.map((student) => {
                                    const statusCfg = getStatusConfig(student.placementStatus);
                                    return (
                                        <tr key={student.id} className={`group transition-all duration-200 ${darkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-slate-50/50'}`}>
                                            {/* Student Info */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-indigo-500/20 shrink-0">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{student.name}</p>
                                                        <p className="text-xs opacity-40 font-medium">{student.id} • {student.department}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* CGPA */}
                                            <td className="px-6 py-5">
                                                <span className={`text-sm font-black ${student.cgpa >= 8 ? 'text-emerald-500' : student.cgpa >= 6 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                    {student.cgpa.toFixed(2)}
                                                </span>
                                            </td>

                                            {/* Skills */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-1">
                                                    {student.current_skills.slice(0, 3).map((sk, i) => {
                                                        const style = getSkillStyle(sk);
                                                        return (
                                                            <span key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r ${style.bg} ${style.text} border ${style.border} capitalize`}>
                                                                {sk.replace(/-/g, ' ')}
                                                            </span>
                                                        );
                                                    })}
                                                    {student.current_skills.length > 3 && (
                                                        <span className="text-[10px] font-bold opacity-40 ml-1">+{student.current_skills.length - 3}</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Readiness */}
                                            <td className="px-6 py-5">
                                                <div className="flex items-center space-x-3 min-w-[120px]">
                                                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${student.readiness >= 70
                                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                                                : student.readiness >= 50
                                                                    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                                                                    : 'bg-gradient-to-r from-rose-500 to-pink-400'
                                                                }`}
                                                            style={{ width: `${student.readiness}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-black w-8">{student.readiness}%</span>
                                                </div>
                                            </td>

                                            {/* Tests */}
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold">{student.testsCompleted}</span>
                                                <span className="text-xs opacity-40 ml-1">({student.avgTestScore}%)</span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center bg-gradient-to-r ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} mr-2`}></span>
                                                    {student.placementStatus}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-5 text-right">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg hover:-translate-y-0.5 transition-all inline-flex items-center"
                                                >
                                                    <Eye size={12} className="mr-1.5" /> View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="py-16 text-center">
                                            <div className="opacity-40">
                                                <Search size={32} className="mx-auto mb-3" />
                                                <p className="font-bold">No students found</p>
                                                <p className="text-sm">Try adjusting your filters or search query.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStudents.map((student) => {
                        const statusCfg = getStatusConfig(student.placementStatus);
                        return (
                            <div
                                key={student.id}
                                className="premium-card p-6 cursor-pointer group"
                                onClick={() => setSelectedStudent(student)}
                            >
                                {/* Top Row */}
                                <div className="flex items-start justify-between mb-5">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                                            {student.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="font-bold">{student.name}</p>
                                            <p className="text-xs opacity-40 font-medium">{student.id} • Sem {student.semester}</p>
                                            <p className="text-xs opacity-30 font-medium">{student.department}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider inline-flex items-center bg-gradient-to-r ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot} mr-1.5`}></span>
                                        {student.placementStatus}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3 mb-5">
                                    <div className={`text-center rounded-xl p-3 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <p className="text-lg font-black">{student.cgpa.toFixed(1)}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">CGPA</p>
                                    </div>
                                    <div className={`text-center rounded-xl p-3 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <p className={`text-lg font-black ${student.readiness >= 70 ? 'text-emerald-500' : student.readiness >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                                            {student.readiness}%
                                        </p>
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Ready</p>
                                    </div>
                                    <div className={`text-center rounded-xl p-3 ${darkMode ? 'bg-white/5' : 'bg-slate-50'}`}>
                                        <p className="text-lg font-black">{student.testsCompleted}</p>
                                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-40">Tests</p>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {student.current_skills.slice(0, 4).map((sk, i) => {
                                        const style = getSkillStyle(sk);
                                        return (
                                            <span key={i} className={`px-2 py-1 rounded-lg text-[10px] font-bold bg-gradient-to-r ${style.bg} ${style.text} border ${style.border} capitalize`}>
                                                {sk.replace(/-/g, ' ')}
                                            </span>
                                        );
                                    })}
                                    {student.current_skills.length > 4 && (
                                        <span className="px-2 py-1 rounded-lg text-[10px] font-bold opacity-40">+{student.current_skills.length - 4} more</span>
                                    )}
                                </div>

                                {/* Readiness Bar */}
                                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}>
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 ${student.readiness >= 70
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                                            : student.readiness >= 50
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                                                : 'bg-gradient-to-r from-rose-500 to-pink-400'
                                            }`}
                                        style={{ width: `${student.readiness}%` }}
                                    ></div>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-4">
                                    <span className="text-[10px] font-medium opacity-30">Last active: {student.lastActive}</span>
                                    <span className="text-xs font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                        View Details <Eye size={12} className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {filteredStudents.length === 0 && (
                        <div className="col-span-3 py-16 text-center premium-card">
                            <div className="opacity-40 p-8">
                                <Search size={32} className="mx-auto mb-3" />
                                <p className="font-bold">No students found</p>
                                <p className="text-sm">Try adjusting your filters or search query.</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Student Detail Modal */}
            {selectedStudent && (
                <StudentDetailModal
                    student={selectedStudent}
                    onClose={() => setSelectedStudent(null)}
                    darkMode={darkMode}
                />
            )}
        </div>
    );
};

export default ManageStudentsView;
