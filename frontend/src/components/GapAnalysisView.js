import React from 'react';
import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import {
    CheckCircle2, ShieldCheck, AlertCircle, Zap, Trophy, Briefcase, Award, ChevronRight
} from 'lucide-react';

const getAffinityScore = (gapReport) => {
    if (!gapReport?.current_skills?.length) return 0;
    const total = (gapReport?.current_skills?.length || 0) + (gapReport?.missing_skills?.length || 0);
    return total > 0 ? Math.round((gapReport.current_skills.length / total) * 100) : 0;
};

const GapAnalysisView = ({ gapReport }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Competency Analysis</h1>
            <p className="text-gray-500 font-medium">Deep dive into your professional skill matrix vs. industry standards.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center text-gray-900">
                        <CheckCircle2 size={24} className="mr-3 text-emerald-500" />
                        Mastered Assets
                    </h3>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest">
                        {gapReport?.current_skills?.length || 0} Skills
                    </span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {gapReport?.current_skills?.map((skill) => (
                        <div key={skill} className="px-5 py-3 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl text-sm font-bold flex items-center hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 transition-colors cursor-default">
                            <ShieldCheck size={14} className="mr-2" />
                            {skill}
                        </div>
                    ))}
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center text-gray-900">
                        <AlertCircle size={24} className="mr-3 text-rose-500" />
                        Growth Opportunities
                    </h3>
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-black uppercase tracking-widest">
                        {gapReport?.missing_skills?.length || 0} Deficits
                    </span>
                </div>
                <div className="flex flex-wrap gap-3">
                    {gapReport?.missing_skills?.length > 0 ? (
                        gapReport.missing_skills.map((skill) => (
                            <div key={skill} className="px-5 py-3 bg-rose-50/50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-bold flex items-center hover:bg-rose-100 transition-colors cursor-default">
                                <Zap size={14} className="mr-2" />
                                {skill}
                            </div>
                        ))
                    ) : (
                        <div className="w-full py-8 text-center bg-emerald-50 rounded-3xl border border-emerald-100">
                            <Trophy size={40} className="mx-auto text-emerald-500 mb-3" />
                            <p className="text-emerald-900 font-bold">Industry Standard Met!</p>
                            <p className="text-emerald-600 text-xs mt-1">You possess all required competencies.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Visual Alignment Distribution */}
        <div className="premium-card p-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="h-64 w-64 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Mastered', value: gapReport?.current_skills?.length || 0 },
                                    { name: 'Missing', value: gapReport?.missing_skills?.length || 0 }
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                <Cell fill="#10b981" />
                                <Cell fill="#f43f5e" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-6">
                    <h3 className="text-2xl font-black text-slate-900">Skill Composition Analysis</h3>
                    <p className="text-slate-500 font-medium">Your profile is currently <span className="text-emerald-600 font-bold">{((gapReport?.current_skills?.length || 0) + (gapReport?.missing_skills?.length || 0)) > 0 ? Math.round(((gapReport?.current_skills?.length || 0) / ((gapReport?.current_skills?.length || 0) + (gapReport?.missing_skills?.length || 0))) * 100) : 0}%</span> complete based on job market requirements for <span className="text-indigo-600 font-bold">{gapReport?.target_role || gapReport?.best_role_match || 'Target Role'}</span>.</p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Current Assets</p>
                            <p className="text-2xl font-black text-emerald-900">{gapReport?.current_skills?.length || 0}</p>
                        </div>
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Deficit Area</p>
                            <p className="text-2xl font-black text-rose-900">{gapReport?.missing_skills?.length || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-indigo-950 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4">
                        <p className="text-indigo-300 font-black uppercase tracking-widest text-xs">Primary Market Goal</p>
                        <h3 className="text-4xl font-black leading-tight">
                            Targeting: <span className="text-indigo-400 capitalize">{gapReport?.target_role || gapReport?.best_role_match || 'Target Role'}</span>
                        </h3>
                        <div className="flex items-center space-x-6">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black">{getAffinityScore(gapReport)}%</span>
                                <span className="text-indigo-300 text-xs font-bold uppercase">Affinity Match</span>
                            </div>
                            <div className="w-px h-10 bg-white/10"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black">High</span>
                                <span className="text-indigo-300 text-xs font-bold uppercase">Market Demand</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center p-4 border border-white/10 shadow-inner">
                        <Briefcase size={80} className="text-indigo-400 opacity-60" />
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Award size={22} className="mr-2 text-amber-500" />
                    Recommended Certifications
                </h3>
                <div className="space-y-4">
                    {gapReport?.recommended_certifications && gapReport.recommended_certifications.length > 0 ? (
                        gapReport.recommended_certifications.map((cert, i) => (
                            <div key={i} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer">
                                <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-900">{cert}</p>
                                <div className="flex items-center mt-2 text-[10px] font-black uppercase tracking-tighter text-indigo-400">
                                    Verify Credentials <ChevronRight size={10} className="ml-1" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-6 text-center bg-amber-50 rounded-2xl border border-amber-100">
                            <Award size={32} className="mx-auto text-amber-500 mb-2 opacity-60" />
                            <p className="text-amber-800 font-bold text-sm">No certifications recommended yet</p>
                            <p className="text-amber-600 text-xs mt-1">Complete missing skills to unlock certification paths</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default GapAnalysisView;
