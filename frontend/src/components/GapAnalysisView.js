import React, { useEffect, useCallback } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import {
    CheckCircle2, ShieldCheck, AlertCircle, Zap, Trophy, Briefcase, Award, ChevronRight,
    TrendingUp, Activity, RefreshCw, FileText, BarChart3, Clock
} from 'lucide-react';

const SECTION_META = {
    quantitative: { label: 'Quantitative Aptitude', color: '#6366f1' },
    english: { label: 'English Proficiency', color: '#10b981' },
    reasoning: { label: 'Logical Reasoning', color: '#8b5cf6' },
    computer_science: { label: 'Computer Science', color: '#f59e0b' },
    dsa_random_pool: { label: 'DSA Challenge Pool', color: '#f43f5e' },
};

const CompetencyHeatmap = ({ gapReport }) => {
    const domains = [
        { label: 'Core CS', skills: ['Data Structures', 'Algorithms', 'Operating Systems', 'DBMS'] },
        { label: 'Engineering', skills: ['System Design', 'Software Engineering', 'Testing', 'Clean Code'] },
        { label: 'Frontend', skills: ['React', 'JavaScript', 'HTML', 'CSS'] },
        { label: 'Backend', skills: ['Node.js', 'Python', 'APIs', 'Docker'] },
        { label: 'Data Science', skills: ['Statistics', 'Machine Learning', 'NLP', 'Big Data'] },
        { label: 'Aptitude', skills: ['Quantitative', 'Logical', 'Verbal', 'Probability'] }
    ];

    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                    <h3 className="text-2xl font-black text-slate-900">Competency Heatmap</h3>
                    <p className="text-slate-500 font-medium text-sm">Visualizing skill concentration across key technology domains.</p>
                </div>
                <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Mastered</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-rose-500 mr-2"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Missing</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-slate-200 mr-2"></div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Target</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative z-10">
                {domains.map((domain) => (
                    <div key={domain.label} className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 text-center">{domain.label}</p>
                        <div className="grid grid-cols-2 gap-3">
                            {domain.skills.map((skill) => {
                                const isMastered = gapReport?.current_skills?.some(s => 
                                    s.toLowerCase().includes(skill.toLowerCase()) || 
                                    skill.toLowerCase().includes(s.toLowerCase())
                                );
                                const isMissing = gapReport?.missing_skills?.some(s => 
                                    s.toLowerCase().includes(skill.toLowerCase()) || 
                                    skill.toLowerCase().includes(s.toLowerCase())
                                );
                                
                                return (
                                    <div 
                                        key={skill}
                                        className={`aspect-square rounded-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 cursor-help relative group border-2
                                            ${isMastered ? 'bg-emerald-500 border-emerald-400 shadow-lg shadow-emerald-500/20' : 
                                              isMissing ? 'bg-rose-500 border-rose-400 shadow-lg shadow-rose-500/20' : 
                                              'bg-slate-50 border-slate-100'}`}
                                    >
                                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 hidden group-hover:block z-30 transition-all">
                                            <div className="bg-slate-900 text-white text-[10px] font-bold py-2 px-3 rounded-xl whitespace-nowrap shadow-2xl relative">
                                                {skill}
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900"></div>
                                            </div>
                                        </div>
                                        {isMastered && <ShieldCheck size={14} className="text-white opacity-40" />}
                                        {isMissing && <Zap size={14} className="text-white opacity-40" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        </div>
    );
};

/* ━━━━━ Test Performance Breakdown ━━━━━ */
const TestPerformanceSection = ({ gapReport }) => {
    const latestTest = gapReport?.latest_test_scores;
    const catScores = latestTest?.category_scores;

    if (!catScores || Object.keys(catScores).length === 0) {
        return (
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm text-center space-y-4">
                <FileText size={48} className="mx-auto text-slate-300" />
                <h3 className="text-xl font-bold text-slate-600">No Test Data Available</h3>
                <p className="text-slate-400 font-medium text-sm max-w-md mx-auto">Complete a Mock Assessment to see a detailed performance breakdown here. Your category scores will sync automatically.</p>
            </div>
        );
    }

    const barData = Object.entries(catScores).map(([key, val]) => {
        const score = typeof val === 'object' ? val.score : val;
        const total = typeof val === 'object' ? val.total : 100;
        return {
            name: SECTION_META[key]?.label || key,
            score: total > 0 ? Math.round((score / total) * 100) : 0,
            fill: SECTION_META[key]?.color || '#6366f1'
        };
    });

    return (
        <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center">
                        <div className="p-2 rounded-xl bg-violet-50 mr-3"><BarChart3 size={24} className="text-violet-600" /></div>
                        Latest Test Performance
                    </h3>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                        Test <span className="font-mono text-indigo-600">{latestTest?.test_id || 'N/A'}</span> — {latestTest?.test_date || 'N/A'}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-4 py-2 rounded-2xl text-sm font-black ${
                        latestTest?.overall_score >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        latestTest?.overall_score >= 40 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                        Overall: {latestTest?.overall_score ?? 0}%
                    </span>
                    <span className="px-3 py-2 bg-slate-50 text-slate-500 rounded-2xl text-xs font-bold border border-slate-100">
                        {gapReport?.total_tests_taken || 0} tests taken
                    </span>
                </div>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical" margin={{ left: 20, right: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `${v}%`} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} width={160} />
                        <Tooltip
                            formatter={(val) => [`${val}%`, 'Score']}
                            contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={24}>
                            {barData.map((entry, idx) => (
                                <Cell key={idx} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Test Gaps Warning */}
            {gapReport?.test_gaps?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h4 className="font-bold text-amber-800 flex items-center mb-3">
                        <AlertCircle size={18} className="mr-2" /> Weak Areas Detected from Tests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {gapReport.test_gaps.map((gap, i) => (
                            <span key={i} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl text-sm font-bold border border-amber-200">
                                {gap}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        </div>
    );
};

/* ━━━━━ Trending Skills Section ━━━━━ */
const TrendingSkillsSection = ({ gapReport }) => {
    const trending = gapReport?.trending_recommendations;
    if (!trending || trending.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 p-8 rounded-[2.5rem] border border-indigo-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 flex items-center mb-6">
                <div className="p-2 rounded-xl bg-indigo-100 mr-3"><TrendingUp size={22} className="text-indigo-600" /></div>
                Trending in Industry
            </h3>
            <div className="flex flex-wrap gap-3">
                {trending.map((skill, i) => (
                    <div key={i} className="px-5 py-3 bg-white border border-indigo-100 text-indigo-700 rounded-2xl text-sm font-bold flex items-center hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-default hover:-translate-y-1 shadow-sm">
                        <Activity size={14} className="mr-2 text-indigo-400" />
                        {skill}
                    </div>
                ))}
            </div>
        </div>
    );
};


const GapAnalysisView = ({ gapReport, onRefresh, selectedStudent, dashboardTrack }) => {
    const matchPercent = gapReport?.match_percent ?? 0;

    // Auto-refresh gap report when the view mounts
    useEffect(() => {
        if (onRefresh) onRefresh();
    }, [selectedStudent, dashboardTrack]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Competency Analysis</h1>
                    <p className="text-gray-500 font-medium text-lg">Deep dive into your professional skill matrix vs. industry standards.</p>
                </div>
                {onRefresh && (
                    <button onClick={onRefresh} className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <RefreshCw size={16} className="mr-2" /> Refresh Data
                    </button>
                )}
            </header>

            {/* Mastered & Missing Skills */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center text-gray-900">
                            <div className="p-2 rounded-xl bg-emerald-50 mr-3">
                                <CheckCircle2 size={24} className="text-emerald-500" />
                            </div>
                            Mastered Assets
                        </h3>
                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">
                            {gapReport?.current_skills?.length || 0} Skills
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {gapReport?.current_skills?.length > 0 ? gapReport.current_skills.map((skill) => (
                            <div key={skill} className="px-6 py-4 bg-slate-50 border border-slate-100 text-slate-700 rounded-[1.25rem] text-sm font-bold flex items-center hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 transition-all cursor-default hover:-translate-y-1">
                                <ShieldCheck size={14} className="mr-2" />
                                {skill}
                            </div>
                        )) : (
                            <div className="w-full py-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-slate-400 font-medium">No mastered skills yet. Take a test to get started!</p>
                            </div>
                        )}
                    </div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center text-gray-900">
                            <div className="p-2 rounded-xl bg-rose-50 mr-3">
                                <AlertCircle size={24} className="text-rose-500" />
                            </div>
                            Growth Opportunities
                        </h3>
                        <span className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest border border-rose-100">
                            {gapReport?.missing_skills?.length || 0} Deficits
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {gapReport?.missing_skills?.length > 0 ? (
                            gapReport.missing_skills.map((skill) => (
                                <div key={skill} className="px-6 py-4 bg-rose-50/50 border border-rose-100 text-rose-700 rounded-[1.25rem] text-sm font-bold flex items-center hover:bg-rose-100 transition-all cursor-default hover:-translate-y-1">
                                    <Zap size={14} className="mr-2" />
                                    {skill}
                                </div>
                            ))
                        ) : (
                            <div className="w-full py-12 text-center bg-emerald-50 rounded-[2rem] border border-emerald-100">
                                <Trophy size={48} className="mx-auto text-emerald-500 mb-4" />
                                <p className="text-emerald-900 font-black text-lg">Industry Standard Met!</p>
                                <p className="text-emerald-600 font-medium mt-1">You possess all required competencies.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Test Performance Breakdown */}
            <TestPerformanceSection gapReport={gapReport} />

            {/* Competency Heatmap */}
            <CompetencyHeatmap gapReport={gapReport} />

            {/* Trending Skills */}
            <TrendingSkillsSection gapReport={gapReport} />

            {/* Visual Alignment Distribution */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative group">
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="h-64 w-64 shrink-0 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Mastered', value: gapReport?.current_skills?.length || 0 },
                                        { name: 'Missing', value: gapReport?.missing_skills?.length || 0 }
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f43f5e" />
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-slate-900">{Math.round(matchPercent)}%</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Match</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-8">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Skill Composition Analysis</h3>
                            <p className="text-slate-500 font-medium">Your profile is currently <span className="text-emerald-600 font-bold">{Math.round(matchPercent)}%</span> complete based on job market requirements for <span className="text-indigo-600 font-bold">{gapReport?.target_role || 'Target Role'}</span>.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Current Assets</p>
                                <p className="text-3xl font-black text-emerald-900">{gapReport?.current_skills?.length || 0}</p>
                            </div>
                            <div className="p-6 bg-rose-50 rounded-2xl border border-rose-100">
                                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Deficit Area</p>
                                <p className="text-3xl font-black text-rose-900">{gapReport?.missing_skills?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>

            {/* Target Role + Certifications */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-indigo-950 p-12 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <p className="text-indigo-300 font-black uppercase tracking-[0.2em] text-xs">Primary Market Goal</p>
                                <h3 className="text-5xl font-black leading-tight">
                                    Targeting: <span className="text-indigo-400 capitalize">{gapReport?.target_role || 'Target Role'}</span>
                                </h3>
                            </div>
                            <div className="flex items-center space-x-10">
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black">{Math.round(matchPercent)}%</span>
                                    <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Affinity Match</span>
                                </div>
                                <div className="w-px h-12 bg-white/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-4xl font-black">High</span>
                                    <span className="text-indigo-300 text-xs font-bold uppercase tracking-widest">Market Demand</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-56 h-56 bg-white/5 rounded-full flex items-center justify-center p-4 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-500">
                            <Briefcase size={96} className="text-indigo-400 opacity-60" />
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <div className="p-2 rounded-xl bg-amber-50 mr-3">
                            <Award size={24} className="text-amber-500" />
                        </div>
                        Recommended Paths
                    </h3>
                    <div className="space-y-4">
                        {gapReport?.recommended_certifications && gapReport.recommended_certifications.length > 0 ? (
                            gapReport.recommended_certifications.map((cert, i) => (
                                <div key={i} className="group p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer hover:-translate-x-1">
                                    <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-900">{cert}</p>
                                    <div className="flex items-center mt-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-indigo-600">
                                        Verify Credentials <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center bg-amber-50/50 rounded-3xl border border-amber-100">
                                <Award size={40} className="mx-auto text-amber-500 mb-3 opacity-60" />
                                <p className="text-amber-800 font-bold text-sm">No certifications recommended yet</p>
                                <p className="text-amber-600 text-xs mt-1 font-medium">Complete missing skills to unlock certification paths</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GapAnalysisView;
