import React, { useState } from 'react';
import { Target, GraduationCap, ShieldCheck, AlertCircle } from 'lucide-react';

const LoginView = ({ setUserRole, setIsAuthenticated, setActiveTab, setSelectedStudent }) => {
    const [selected, setSelected] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const allowedAdmins = ['jatin', 'trilok', 'akshar', 'bhavya', 'jatin trilok akshar bhbaya'];

    const handleLogin = () => {
        setError('');
        const cleanUsername = username.trim().toLowerCase();
        const cleanPassword = password.trim();

        if (selected === 'admin') {
            if (!cleanUsername || !cleanPassword) {
                setError('Please enter both username and password');
                return;
            }
            if (allowedAdmins.includes(cleanUsername) && cleanPassword === '12345') {
                setUserRole('admin');
                setIsAuthenticated(true);
                setActiveTab('admin');
                setSelectedStudent(username.trim().toUpperCase());
            } else {
                setError('Invalid administrator credentials');
            }
        } else {
            setUserRole('student');
            setIsAuthenticated(true);
            setActiveTab('dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-6 md:p-12 relative overflow-y-auto">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="w-full max-w-xl relative z-10 space-y-8">
                <div className="text-center space-y-4">
                    <div className="inline-flex p-4 rounded-3xl bg-white shadow-xl border border-slate-100 mb-4 animate-bounce-slow">
                        <Target size={48} className="text-indigo-600" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                        Placify <span className="text-indigo-600">AI</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Next-Gen Placement Readiness & Market Fit</p>
                </div>

                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
                        <p className="text-slate-400 text-sm">Please select your portal to continue</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <button
                            onClick={() => { setSelected('student'); setError(''); }}
                            className={`p-6 rounded-[2rem] border-2 transition-all duration-300 text-left space-y-4 ${selected === 'student'
                                ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100'
                                : 'border-slate-100 hover:border-indigo-200 bg-white'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <p className={`font-bold ${selected === 'student' ? 'text-indigo-900' : 'text-slate-600'}`}>Student</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Learning Portal</p>
                            </div>
                        </button>

                        <button
                            onClick={() => { setSelected('admin'); setError(''); }}
                            className={`p-6 rounded-[2rem] border-2 transition-all duration-300 text-left space-y-4 ${selected === 'admin'
                                ? 'border-rose-600 bg-rose-50 shadow-lg shadow-rose-100'
                                : 'border-slate-100 hover:border-rose-200 bg-white'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected === 'admin' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-400'
                                }`}>
                                <ShieldCheck size={24} />
                            </div>
                            <div>
                                <p className={`font-bold ${selected === 'admin' ? 'text-rose-900' : 'text-slate-600'}`}>Administrator</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Insight Engine</p>
                            </div>
                        </button>
                    </div>

                    {selected === 'admin' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Admin Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Admin Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Security Key</label>
                                <input
                                    type="password"
                                    placeholder="•••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center text-rose-600 space-x-3 text-sm font-bold animate-pulse">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        onClick={handleLogin}
                        className="w-full py-5 rounded-2xl font-black text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"
                    >
                        Sign In to Dashboard
                    </button>
                </div>

                <p className="text-center text-slate-400 text-sm font-medium">
                    Contact your department for portal access issues.
                </p>
            </div>
        </div>
    );
};

export default LoginView;
