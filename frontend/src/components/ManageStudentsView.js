import React, { useState, useMemo } from 'react';
import {
    Search, Filter, ChevronDown, ChevronUp, Eye, X,
    GraduationCap, Code2, FolderGit2, Star, Users,
    ArrowUpRight, ArrowDownRight, SlidersHorizontal,
    BookOpen, Award, TrendingUp, UserCheck
} from 'lucide-react';
import {
    buildDepartmentOptions,
    buildStudentStats,
    filterAndSortStudents,
    getSkillStyle,
    getStatusConfig,
    normalizeStudents
} from '../utils/studentDirectory';

import StudentDetailModal from './ManageStudents/StudentDetailModal';


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main ManageStudentsView Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ManageStudentsView = ({ darkMode = false, students = [] }) => {
    const studentDirectory = useMemo(() => normalizeStudents(students), [students]);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [departmentFilter, setDepartmentFilter] = useState('All');
    const [sortField, setSortField] = useState('name');
    const [sortDirection, setSortDirection] = useState('asc');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    // Summary stats
    const stats = useMemo(() => buildStudentStats(studentDirectory), [studentDirectory]);

    // Filter and sort students
    const filteredStudents = useMemo(() => filterAndSortStudents(studentDirectory, {
        departmentFilter,
        searchQuery,
        sortDirection,
        sortField,
        statusFilter
    }), [departmentFilter, searchQuery, sortDirection, sortField, statusFilter, studentDirectory]);

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

    const departments = useMemo(() => buildDepartmentOptions(studentDirectory), [studentDirectory]);

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
                        Showing {filteredStudents.length} of {studentDirectory.length} students
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
