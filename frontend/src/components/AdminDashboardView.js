import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import {
    Users, Award, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import {
    buildAdminStatCards,
    PLACEMENT_STATUS_DATA,
    READINESS_TREND_DATA,
    SKILL_GAP_DISTRIBUTION,
} from '../data/adminDashboardData';

const AdminDashboardView = ({ atRiskStudents = [], darkMode = false, setActiveTab, selectedStudent, setSelectedStudent, students = [] }) => {
    const gridColor = darkMode ? '#1e293b' : '#f1f5f9';
    const chartText = '#94a3b8';
    const adminStats = buildAdminStatCards(students, atRiskStudents);
    const statIcons = {
        users: Users,
        alert: AlertCircle,
        trend: TrendingUp,
        award: Award,
    };

    return (
        <div className="space-y-10 animate-in pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
                        Institutional <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Admin</span>
                    </h1>
                    <p className="font-medium text-slate-400">Monitoring placement readiness across the student body.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className={`placify-panel px-6 py-4 rounded-[1.5rem] border shadow-sm flex items-center space-x-3 ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-100'
                        }`}>
                        <Users size={18} className="text-indigo-500" />
                        <select
                            value={selectedStudent}
                            onChange={(e) => setSelectedStudent(e.target.value)}
                            className="bg-transparent font-bold focus:outline-none cursor-pointer w-44 text-ellipsis overflow-hidden whitespace-nowrap text-sm"
                        >
                            {students.map((stu) => (
                                <option key={stu.id || stu} value={stu.id || stu}>
                                    {stu.name ? `${stu.name}` : stu}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
                    <button onClick={() => setActiveTab && setActiveTab('manage_students')} className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-sky-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                        Manage Students
                    </button>
                </div>
            </header>

            {/* Gradient Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {adminStats.map((card) => {
                    const Icon = statIcons[card.iconKey];
                    return (
                        <div key={card.title} className={`relative overflow-hidden p-6 rounded-[2rem] shadow-lg bg-gradient-to-br ${card.gradient} hover:-translate-y-2 transition-all duration-300`}>
                            <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-white/80 text-sm font-bold">{card.title}</p>
                                    <Icon size={20} className="text-white/60" />
                                </div>
                                <p className="text-3xl font-black text-white">{card.value}</p>
                                <p className="text-white/50 text-xs font-medium mt-1 flex items-center">
                                    {card.trend === 'up' && <ArrowUpRight size={12} className="mr-1" />}
                                    {card.subtext}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Skill Gap Distribution */}
                <div className="lg:col-span-2 premium-card p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 mr-3">
                            <TrendingUp size={18} className="text-white" />
                        </div>
                        Skill Gap Distribution
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SKILL_GAP_DISTRIBUTION}>
                                <defs>
                                    <linearGradient id="adminBar1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#818cf8" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke={chartText} fontWeight="bold" />
                                <YAxis axisLine={false} tickLine={false} stroke={chartText} />
                                <Tooltip
                                    cursor={{ fill: darkMode ? 'rgba(99, 102, 241, 0.05)' : '#f8fafc' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                        backgroundColor: darkMode ? '#1a1d2e' : '#fff',
                                        color: darkMode ? '#e2e8f0' : '#0f172a'
                                    }}
                                />
                                <Bar dataKey="count" fill="url(#adminBar1)" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Placement Distribution Pie */}
                <div className="premium-card p-8">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                        <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 mr-3">
                            <Award size={18} className="text-white" />
                        </div>
                        Placement Status
                    </h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={PLACEMENT_STATUS_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {PLACEMENT_STATUS_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px', border: 'none',
                                        backgroundColor: darkMode ? '#1a1d2e' : '#fff',
                                        color: darkMode ? '#e2e8f0' : '#0f172a',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-3 mt-4">
                        {PLACEMENT_STATUS_DATA.map((item, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm font-medium">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Readiness Trend */}
            <div className="premium-card p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 mr-3">
                        <TrendingUp size={18} className="text-white" />
                    </div>
                    Readiness Trends
                </h3>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={READINESS_TREND_DATA}>
                            <defs>
                                <linearGradient id="adminReadiness" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} stroke={chartText} fontWeight="bold" />
                            <YAxis axisLine={false} tickLine={false} stroke={chartText} />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px', border: 'none',
                                    backgroundColor: darkMode ? '#1a1d2e' : '#fff',
                                    color: darkMode ? '#e2e8f0' : '#0f172a',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                                }}
                            />
                            <Area type="monotone" dataKey="readiness" stroke="#10b981" fillOpacity={1} fill="url(#adminReadiness)" strokeWidth={4} name="Readiness %" />
                            <Area type="monotone" dataKey="target" stroke="#f43f5e" fill="none" strokeWidth={2} strokeDasharray="8 4" name="Target" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* At-Risk Students */}
            <div className="premium-card p-8 overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-2xl font-black flex items-center">
                            <div className="p-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 mr-3">
                                <AlertCircle size={20} className="text-white" />
                            </div>
                            Priority Intervention List
                        </h3>
                        <p className="font-medium mt-1 opacity-60">Students with no improvement in readiness over the last 30 days.</p>
                    </div>
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20">
                        {atRiskStudents.length} Critical
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className={`border-b ${darkMode ? 'border-slate-700/50' : 'border-slate-100'}`}>
                                <th className="pb-4 font-bold text-xs uppercase tracking-widest opacity-50">Student</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-widest text-center opacity-50">Tests (30d)</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-widest text-center opacity-50">Initial</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-widest text-center opacity-50">Latest</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-widest opacity-50">Trajectory</th>
                                <th className="pb-4 font-bold text-xs uppercase tracking-widest text-right opacity-50">Action</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${darkMode ? 'divide-slate-700/30' : 'divide-slate-50'}`}>
                            {atRiskStudents.length > 0 ? atRiskStudents.map((student) => (
                                <tr key={student.id} className={`group transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-slate-50/50'}`}>
                                    <td className="py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                                                {student.id.slice(-2)}
                                            </div>
                                            <div>
                                                <p className="font-bold">{student.name}</p>
                                                <p className="text-xs opacity-50">{student.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5 text-center font-bold">{student.tests_taken}</td>
                                    <td className="py-5 text-center font-medium opacity-60">{student.initial_score}%</td>
                                    <td className="py-5 text-center font-bold">{student.latest_score}%</td>
                                    <td className="py-5">
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center ${student.status === 'Declining'
                                            ? 'bg-gradient-to-r from-rose-500/10 to-pink-500/10 text-rose-500 border border-rose-500/20'
                                            : 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-500 border border-amber-500/20'
                                            }`}>
                                            {student.status === 'Declining' ? <ArrowDownRight size={10} className="mr-1" /> : <Minus size={10} className="mr-1" />}
                                            {student.status} ({student.improvement > 0 ? '+' : ''}{student.improvement}%)
                                        </span>
                                    </td>
                                    <td className="py-5 text-right">
                                        <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all">
                                            Schedule Review
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center font-medium opacity-50">
                                        No immediate intervention cases detected. Performance is stable across the batch.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardView;
