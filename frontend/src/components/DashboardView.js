import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import {
    LogOut, Users, Target, Briefcase, Activity, Award,
    TrendingUp, BarChart2, Zap, AlertCircle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { StatCard } from './Common';

const DashboardView = ({
    dashboardTrack, setDashboardTrack,
    selectedStudent, setSelectedStudent,
    students,
    readinessScore, readiness,
    gapReport,
    history,
    benchmarkData,
    radarData,
    setActiveTab
}) => {
    return (
        <div className="space-y-10 animate-in pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
                        Insights <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-xl text-sm font-bold">PRO</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Predicting your trajectory in the global tech ecosystem.</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center space-x-3">
                        <LogOut size={16} className="text-slate-400" />
                        <select
                            value={dashboardTrack}
                            onChange={(e) => setDashboardTrack(e.target.value)}
                            className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer text-sm"
                        >
                            <option value="Software Engineer">Software Engineering</option>
                            <option value="Data Scientist">Data Science</option>
                            <option value="DevOps Engineer">DevOps & Cloud</option>
                        </select>
                    </div>

                    <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center space-x-3">
                        <Users size={20} className="text-slate-400" />
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
                        >
                            {students.map((sid) => (
                                <option key={sid} value={sid}>{sid}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {/* Primary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Readiness" value={`${Math.round(readinessScore)}%`} subtext={readiness?.prediction || "Analyzing..."} icon={Target} color="indigo" />
                <StatCard title="Career Fit" value={gapReport?.target_role || "Pending"} subtext={`Match: ${gapReport ? Math.round(gapReport.match_percent) : 0}%`} icon={Briefcase} color="amber" />
                <StatCard title="Tests Taken" value={history.length} subtext="Consistency is key" icon={Activity} color="emerald" />
                <StatCard title="Global Rank" value="Top 8%" subtext="Across 12k students" icon={Award} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth & Benchmarks */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="premium-card p-8">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center">
                                <TrendingUp size={24} className="mr-3 text-indigo-600" /> Improvement Vector
                            </h3>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={history.filter(h => h.track === dashboardTrack)}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} tickMargin={10} />
                                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                                        cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                                    />
                                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={5} dot={{ fill: '#4f46e5', strokeWidth: 3, r: 6, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                    <Line type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="premium-card p-8">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center">
                                <BarChart2 size={24} className="mr-3 text-amber-500" /> Market Alignment Benchmark
                            </h3>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={benchmarkData} barGap={8}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="user" fill="#6366f1" radius={[6, 6, 0, 0]} name="Your Performance" />
                                    <Bar dataKey="market" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Industry Target" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Sidebar Insights */}
                <div className="space-y-8">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
                        <h4 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Skill Radar Profile</h4>
                        <div className="h-64 mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }} />
                                    <Radar name="Proficiency" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-5 pt-8 border-t border-white/5">
                            {radarData.slice(0, 3).map((d, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm font-medium">{d.subject}</span>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.A}%` }} />
                                        </div>
                                        <span className="text-xs font-bold w-8">{d.A}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    </div>

                    <div className="premium-card p-8">
                        <h4 className="text-slate-900 font-bold mb-6 flex items-center">
                            <Zap size={20} className="mr-2 text-rose-500" /> Critical Skills Gap
                        </h4>
                        <div className="space-y-4">
                            {gapReport?.missing_skills?.slice(0, 3).map((skill, i) => (
                                <div key={i} className="flex items-center p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm mr-4 shrink-0">
                                        <AlertCircle size={14} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{skill}</p>
                                        <p className="text-[10px] text-rose-600 font-bold uppercase tracking-tight">Immediate Action Required</p>
                                    </div>
                                </div>
                            ))}
                            {!gapReport?.missing_skills?.length && (
                                <div className="text-center py-6 bg-emerald-50 rounded-2xl">
                                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                                    <p className="text-sm font-bold text-emerald-900">Market Profile Matched!</p>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setActiveTab('gap')} className="w-full mt-6 py-3 text-indigo-600 font-bold text-sm bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                            View Full Gap Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* Industry Roadmap Preview */}
            <div className="premium-card p-10 overflow-hidden relative">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                    <div className="max-w-xl space-y-4">
                        <h3 className="text-2xl font-black text-slate-900">Bridging the Industry Gap</h3>
                        <p className="text-slate-500 font-medium">We've computed a personalized 3-month roadmap based on your current readiness matches.</p>
                        <div className="flex items-center space-x-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs font-bold text-slate-400">Join 800+ students in this track</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="bg-slate-50 px-8 py-6 rounded-3xl border border-slate-100 text-center">
                            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Current Velocity</p>
                            <p className="text-3xl font-black text-indigo-600">High</p>
                        </div>
                        <button
                            onClick={() => setActiveTab('learning')}
                            className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center group"
                        >
                            View Detailed Roadmap <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            </div>
        </div>
    );
};

export default DashboardView;
