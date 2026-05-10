import React from 'react';
import { X, GraduationCap, Code2, FolderGit2, TrendingUp, BookOpen, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getSkillStyle, getStatusConfig } from '../../utils/studentDirectory';

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

export default StudentDetailModal;
