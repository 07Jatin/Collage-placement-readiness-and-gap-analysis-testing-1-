import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    Users, Award, TrendingUp, AlertCircle
} from 'lucide-react';
import { StatCard } from './Common';

const AdminDashboardView = ({ atRiskStudents = [] }) => (
    <div className="space-y-10 animate-in pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Institutional <span className="text-indigo-600">Admin</span></h1>
                <p className="text-slate-500 font-medium">Monitoring placement readiness across the student body.</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-10 h-10 rounded-xl border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=admin${i}`} alt="user" />
                        </div>
                    ))}
                </div>
                <div className="h-10 w-px bg-slate-200 mx-2"></div>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center hover:bg-black transition-all">
                    <Users size={18} className="mr-2" /> Manage Students
                </button>
            </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
                icon={Users}
                title="Total Students"
                value="1,240"
                subtext="+12% from last sem"
                color="indigo"
            />
            <StatCard
                icon={AlertCircle}
                title="At-Risk"
                value={atRiskStudents.length}
                subtext="Needs Intervention"
                color="rose"
            />
            <StatCard
                icon={TrendingUp}
                title="Avg Readiness"
                value="64%"
                subtext="+5.2% Growth"
                color="amber"
            />
            <StatCard
                icon={Award}
                title="Placement Ready"
                value="342"
                subtext="85% Market Match"
                color="emerald"
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="premium-card p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Skill Gap Distribution</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'React', count: 450 },
                            { name: 'Python', count: 320 },
                            { name: 'SQL', count: 280 },
                            { name: 'DS/Algo', count: 580 },
                            { name: 'System Des', count: 210 }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="premium-card p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Readiness Trends</h3>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            { month: 'Jan', readiness: 45 },
                            { month: 'Feb', readiness: 52 },
                            { month: 'Mar', readiness: 48 },
                            { month: 'Apr', readiness: 61 },
                            { month: 'May', readiness: 64 }
                        ]}>
                            <defs>
                                <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="readiness" stroke="#10b981" fillOpacity={1} fill="url(#colorReadiness)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* At-Risk Students List */}
        <div className="premium-card p-8 bg-white overflow-hidden">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black text-slate-900 flex items-center">
                        <AlertCircle size={24} className="mr-3 text-rose-500" />
                        Priority Intervention List
                    </h3>
                    <p className="text-slate-500 font-medium">Students with no improvement in readiness over the last 30 days despite multiple assessments.</p>
                </div>
                <div className="bg-rose-50 text-rose-600 px-4 py-2 rounded-xl font-bold text-sm">
                    {atRiskStudents.length} Critical Cases
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100">
                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Student</th>
                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Tests (30d)</th>
                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Initial</th>
                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-center">Latest</th>
                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest">Trajectory</th>
                            <th className="pb-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {atRiskStudents.length > 0 ? atRiskStudents.map((student) => (
                            <tr key={student.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-5">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                            {student.id.slice(-2)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{student.name}</p>
                                            <p className="text-xs text-slate-500">{student.id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-5 text-center font-bold text-slate-700">{student.tests_taken}</td>
                                <td className="py-5 text-center text-slate-500 font-medium">{student.initial_score}%</td>
                                <td className="py-5 text-center font-bold text-slate-900">{student.latest_score}%</td>
                                <td className="py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${student.status === 'Declining' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                        {student.status} ({student.improvement > 0 ? '+' : ''}{student.improvement}%)
                                    </span>
                                </td>
                                <td className="py-5 text-right">
                                    <button className="text-indigo-600 font-bold text-sm hover:underline">Schedule Review</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
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

export default AdminDashboardView;
