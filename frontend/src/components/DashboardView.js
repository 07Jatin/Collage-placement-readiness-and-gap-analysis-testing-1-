


import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, Radar, Area, AreaChart
} from 'recharts';
import {
    Users, Target, Briefcase, Activity, Award,
    TrendingUp, BarChart2, Zap, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';

// Colorful Stat Card with gradient backgrounds
const ColorStatCard = ({ title, value, subtext, icon: Icon, gradient }) => (
    <div className={`relative overflow-hidden rounded-[2rem] border border-sky-400/10 p-6 shadow-[0_24px_60px_rgba(2,9,22,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(2,9,22,0.45)] group ${gradient}`}>
        <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 transition-transform duration-500 group-hover:scale-150"></div>
        <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent)]"></div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <p className="text-white/80 text-sm font-bold uppercase tracking-[0.18em]">{title}</p>
                <div className="rounded-xl bg-white/15 p-2 backdrop-blur-sm">
                    <Icon size={20} className="text-white" />
                </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">{value}</h3>
            {subtext && <p className="text-white/60 text-xs font-medium">{subtext}</p>}
        </div>
    </div>
);

// Custom chart tooltip
const CustomTooltip = ({ active, payload, label, darkMode }) => {
    if (active && payload && payload.length) {
        return (
            <div className={`px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-sm ${darkMode
                    ? 'bg-slate-800/95 border-slate-700 text-white'
                    : 'bg-white/95 border-slate-100 text-slate-900'
                }`}>
                <p className="font-bold text-sm mb-1">{label}</p>
                {payload.map((entry, i) => (
                    <p key={i} className="text-xs font-medium" style={{ color: entry.color }}>
                        {entry.name}: <span className="font-bold">{entry.value}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const DashboardView = ({
    dashboardTrack, setDashboardTrack,
    selectedStudent, setSelectedStudent,
    students,
    readinessScore, readiness,
    gapReport,
    history,
    benchmarkData,
    radarData,
    setActiveTab,
    darkMode
}) => {
    // Handle empty state when no student data available
    if (!gapReport && !readiness && (!history || history.length === 0)) {
        return (
            <div className="space-y-10 animate-in pb-12">
                <header>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Insights</h1>
                    <p className="font-medium text-lg text-slate-600 dark:text-slate-300">Predicting your trajectory in the global tech ecosystem.</p>
                </header>
                
                <div className={`rounded-[2.5rem] p-16 text-center space-y-6 ${darkMode ? 'bg-slate-800/50 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                    <div className="inline-flex p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950">
                        <AlertCircle size={40} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>No Data Available</h3>
                        <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Upload your resume or take a mock assessment to generate insights and recommendations.</p>
                    </div>
                    <div className="flex gap-4 justify-center pt-4">
                        <button onClick={() => setActiveTab('resume')} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                            Upload Resume
                        </button>
                        <button onClick={() => setActiveTab('tests')} className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                            Take Mock Test
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const chartText = darkMode ? '#94a3b8' : '#94a3b8';
    const gridColor = darkMode ? '#1e293b' : '#f1f5f9';

    return (
        <div className="space-y-10 animate-in pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight flex items-center">
                        <span className="text-slate-900 dark:text-white">Insights</span>
                        <span className="ml-3 rounded-xl bg-sky-500/15 px-3 py-1 text-sm font-bold text-sky-600 dark:text-sky-300 shadow-lg shadow-sky-500/10">
                            LIVE
                        </span>
                    </h1>
                    <p className="font-medium text-lg text-slate-500 dark:text-slate-400">Predicting your trajectory in the global tech ecosystem.</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className={`placify-panel px-6 py-4 rounded-[1.5rem] border shadow-sm flex items-center space-x-3 ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100'
                        }`}>
                        <Briefcase size={16} className="text-slate-400" />
                        <select
                            value={dashboardTrack}
                            onChange={(e) => setDashboardTrack(e.target.value)}
                            className="bg-transparent font-bold focus:outline-none cursor-pointer text-sm"
                        >
                            <option value="Software Engineer">Software Engineering</option>
                            <option value="Data Scientist">Data Science</option>
                            <option value="DevOps Engineer">DevOps & Cloud</option>
                        </select>
                    </div>

                    <div className={`placify-panel px-6 py-4 rounded-[1.5rem] border shadow-sm flex items-center space-x-3 ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100'
                        }`}>
                        <Users size={20} className="text-slate-400" />
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="bg-transparent font-bold focus:outline-none cursor-pointer w-48 text-ellipsis overflow-hidden whitespace-nowrap"
                        >
                            {students.map((stu) => (
                                <option key={stu.id || stu} value={stu.id || stu}>
                                    {stu.name ? `${stu.name} (${stu.id})` : stu}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Colorful Gradient Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ColorStatCard
                    title="Readiness Score"
                    value={`${Math.round(readinessScore)}%`}
                    subtext={readiness?.prediction || "Analyzing..."}
                    icon={Target}
                    gradient="bg-[linear-gradient(135deg,#102847_0%,#1d4ed8_55%,#4ea8ff_100%)]"
                />
                <ColorStatCard
                    title="Career Fit"
                    value={gapReport?.target_role || "Pending"}
                    subtext={`Match: ${gapReport ? Math.round(gapReport.match_percent) : 0}%`}
                    icon={Briefcase}
                    gradient="bg-[linear-gradient(135deg,#112440_0%,#12385f_45%,#2f7cf6_100%)]"
                />
                <ColorStatCard
                    title="Tests Taken"
                    value={history.length}
                    subtext="Consistency is key"
                    icon={Activity}
                    gradient="bg-[linear-gradient(135deg,#0b2036_0%,#12557b_50%,#42c7ff_100%)]"
                />
                <ColorStatCard
                    title="Global Rank"
                    value="Top 8%"
                    subtext="Across 12k students"
                    icon={Award}
                    gradient="bg-[linear-gradient(135deg,#1a2340_0%,#243c7e_55%,#7aa8ff_100%)]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth & Benchmarks */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Improvement Chart */}
                    <div className="premium-card p-8">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-bold flex items-center">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 mr-3">
                                    <TrendingUp size={20} className="text-white" />
                                </div>
                                Improvement Vector
                            </h3>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-2"></div>
                                    <span className="text-xs font-bold text-slate-500">Score</span>
                                </div>
                                <div className="flex items-center ml-4">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 mr-2"></div>
                                    <span className="text-xs font-bold text-slate-500">Readiness</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={history.filter(h => h.track === dashboardTrack)}>
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                    <XAxis dataKey="date" stroke={chartText} fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} tickMargin={10} />
                                    <YAxis domain={[0, 100]} stroke={chartText} fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                                    <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fill="url(#scoreGrad)" name="Score" dot={{ fill: '#6366f1', strokeWidth: 3, r: 5, stroke: darkMode ? '#1a1d2e' : '#fff' }} />
                                    <Area type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={3} fill="url(#readinessGrad)" name="Readiness" dot={false} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Benchmark Chart */}
                    <div className="premium-card p-8">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-bold flex items-center">
                                <div className="p-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 mr-3">
                                    <BarChart2 size={20} className="text-white" />
                                </div>
                                Market Alignment Benchmark
                            </h3>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={benchmarkData} barGap={8}>
                                    <defs>
                                        <linearGradient id="barUser" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" />
                                            <stop offset="100%" stopColor="#6366f1" />
                                        </linearGradient>
                                        <linearGradient id="barMarket" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={darkMode ? '#334155' : '#e2e8f0'} />
                                            <stop offset="100%" stopColor={darkMode ? '#1e293b' : '#cbd5e1'} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                    <XAxis dataKey="name" stroke={chartText} fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <YAxis stroke={chartText} fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                                    <Bar dataKey="user" fill="url(#barUser)" radius={[8, 8, 0, 0]} name="Your Performance" />
                                    <Bar dataKey="market" fill="url(#barMarket)" radius={[8, 8, 0, 0]} name="Industry Target" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Sidebar Insights */}
                <div className="space-y-8">
                    {/* Radar Chart - Dark themed */}
                    <div className={`rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl transition-all duration-500 ${darkMode
                            ? 'bg-gradient-to-br from-slate-800 via-indigo-950 to-slate-900 border border-indigo-500/10'
                            : 'bg-gradient-to-br from-indigo-600 to-blue-700 border border-indigo-400/20'
                        }`}>
                        <h4 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Skill Radar Profile</h4>
                        <div className="h-64 mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis 
                                        dataKey="subject" 
                                        tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 'bold' }}
                                        label={{ value: '', angle: 90, distance: 120 }}
                                    />
                                    <Radar name="Proficiency" dataKey="A" stroke="#818cf8" fill="url(#radarFill)" fillOpacity={0.6} strokeWidth={2} />
                                    <defs>
                                        <linearGradient id="radarFill" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#818cf8" stopOpacity={0.6} />
                                            <stop offset="100%" stopColor="#c084fc" stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-5 pt-8 border-t border-white/5">
                            {radarData.slice(0, 5).map((d, i) => {
                                const colors = ['from-indigo-500 to-purple-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500', 'from-pink-500 to-rose-500', 'from-cyan-400 to-blue-500'];
                                return (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-slate-400 text-sm font-medium">{d.subject}</span>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`} style={{ width: `${d.A}%` }} />
                                            </div>
                                            <span className="text-xs font-bold w-10 text-right">{typeof d.A === 'number' ? d.A.toFixed(1) : d.A}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                    </div>

                    {/* Skills Gap */}
                    <div className="premium-card p-8">
                        <h4 className="font-bold mb-6 flex items-center">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 mr-3">
                                <Zap size={16} className="text-white" />
                            </div>
                            Critical Skills Gap
                        </h4>
                        <div className="space-y-4">
                            {gapReport?.missing_skills?.slice(0, 3).map((skill, i) => {
                                const gradients = ['from-rose-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-red-500 to-rose-600'];
                                return (
                                    <div key={i} className={`flex items-center p-4 rounded-2xl border transition-all hover:scale-[1.02] ${darkMode
                                            ? 'bg-rose-500/5 border-rose-500/10'
                                            : 'bg-rose-50/50 border-rose-100/50'
                                        }`}>
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${gradients[i]} flex items-center justify-center shadow-lg mr-4 shrink-0`}>
                                            <AlertCircle size={14} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{skill}</p>
                                            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight">Immediate Action Required</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {!gapReport?.missing_skills?.length && (
                                <div className={`text-center py-6 rounded-2xl border ${darkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50'
                                    }`}>
                                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                                    <p className="text-sm font-bold text-emerald-600">Market Profile Matched!</p>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setActiveTab('gap')} className="w-full mt-6 py-3 text-white font-bold text-sm bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all">
                            View Full Gap Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* Industry Roadmap Banner */}
            <div className={`rounded-[2.5rem] p-10 overflow-hidden relative ${darkMode
                    ? 'bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/10'
                    : 'premium-card'
                }`}>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="max-w-xl space-y-4">
                        <h3 className="text-2xl font-black">Bridging the Industry Gap</h3>
                        <p className="font-medium opacity-70">We've computed a personalized 3-month roadmap based on your current readiness matches.</p>
                        <div className="flex items-center space-x-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden dark:border-slate-800">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-bold opacity-50">Join 800+ students in this track</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className={`px-8 py-6 rounded-3xl text-center border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'
                            }`}>
                            <p className="font-bold text-[10px] uppercase tracking-widest mb-1 opacity-50">Current Velocity</p>
                            <p className="text-3xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">High</p>
                        </div>
                        <button
                            onClick={() => setActiveTab('learning')}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-indigo-500/20 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center group"
                        >
                            View Detailed Roadmap <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>
        </div>
    );
};

export default DashboardView;
