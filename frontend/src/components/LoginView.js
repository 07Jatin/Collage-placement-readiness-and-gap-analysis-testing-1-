import React, { useState } from 'react';
import { Target, GraduationCap, ShieldCheck, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const LoginView = ({ setUserRole, setIsAuthenticated, setActiveTab, setSelectedStudent, darkMode, setDarkMode }) => {
    const [selected, setSelected] = useState('student');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        setError('');
        const cleanUsername = username.trim();
        const cleanPassword = password.trim();
        
        if (selected === 'admin') {
            if (!cleanUsername || !cleanPassword) {
                setError('Please enter both username and password');
                return;
            }
            
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: cleanUsername,
                        password: cleanPassword
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Invalid administrator credentials');
                }
                
                const data = await response.json();
                localStorage.setItem('placify_token', data.token);
                
                setUserRole('admin');
                setIsAuthenticated(true);
                setActiveTab('admin');
                setSelectedStudent(cleanUsername.toUpperCase());
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            if (!cleanUsername || !cleanPassword) {
                setError('Roll Number and Password are required.');
                return;
            }
            
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/api/students/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roll_no: cleanUsername.toUpperCase(),
                        password: cleanPassword,
                        name: name.trim() || undefined,
                        email: email.trim(),
                        mobile: mobile.trim()
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Authentication failed');
                }
                const data = await response.json();
                localStorage.setItem('placify_token', data.token);
                
                setSelectedStudent(data.id);
                setUserRole('student');
                setIsAuthenticated(true);
                setActiveTab('dashboard');
                
            } catch (err) {
                setError(err.message || 'Server error. Please try again later.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden font-sans transition-all duration-700 dark bg-[#050b16]">
            {/* Dark background gradient - forced */}
            <div className="absolute inset-0 opacity-100 transition-opacity duration-1000" 
                 style={{ background: 'radial-gradient(circle at 20% 20%,rgba(88,166,255,0.22),transparent 18%),radial-gradient(circle at 80% 20%,rgba(59,130,246,0.12),transparent 18%),linear-gradient(180deg,#08101d_0%,#050b16_100%)' }}>
            </div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-sky-900/30 blur-[140px]"></div>
                <div className="absolute -bottom-[10%] -right-[10%] h-[50%] w-[50%] rounded-full bg-indigo-900/20 blur-[140px]"></div>
                <div className="absolute left-1/2 top-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-900/20 blur-[150px]"></div>
            </div>

            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '36px 36px' }}></div>

            <div className="relative z-20 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                {/* Header Section */}
                <div className="space-y-8 text-center lg:text-left">
                    <div className="inline-flex items-center rounded-[28px] border border-sky-400/10 bg-[#0e1b30]/85 px-4 py-3 shadow-[0_24px_80px_rgba(2,9,22,0.5)] backdrop-blur-xl">
                        <div className="rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-3 shadow-lg shadow-sky-500/20">
                            <Target size={32} className="text-white" />
                        </div>
                        <div className="ml-3">
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-sky-300">Placify AI</p>
                            <p className="text-sm font-semibold text-slate-200">Career readiness command center</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-black tracking-tight text-white md:text-6xl">
                            Sign in to <span className="bg-gradient-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">Placify AI</span>
                        </h1>
                        <p className="max-w-xl text-lg font-medium text-slate-400">
                            Resume intelligence, readiness tracking, mock assessments, coding validation, and institutional analytics in one dark control panel.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            ['Readiness score', 'Live dashboard'],
                            ['Resume intelligence', 'Regex + LLM'],
                            ['Admin monitoring', 'Skill gap heatmaps'],
                        ].map(([title, subtitle]) => (
                            <div key={title} className="rounded-[24px] border border-sky-400/10 bg-[#0e1b30]/75 px-5 py-4 text-left shadow-[0_24px_80px_rgba(2,9,22,0.35)] backdrop-blur-xl">
                                <p className="text-sm font-black text-white">{title}</p>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-300">{subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Auth Card */}
                <div className="rounded-[36px] border border-sky-400/10 bg-[#0d1728]/88 p-8 shadow-[0_32px_100px_rgba(2,9,22,0.55)] backdrop-blur-3xl md:p-10">
                    <div className="space-y-3 mb-10">
                        <h2 className="text-3xl font-black text-white">Welcome Back</h2>
                        <p className="font-medium text-slate-400">Select your portal and continue into the Placify workspace.</p>
                    </div>

                    {/* Portal Switcher */}
                    <div className="mb-10 flex flex-col sm:flex-row items-center gap-3 rounded-[2.5rem] border border-sky-400/10 bg-[#09111f]/70 p-2">
                        <button
                            onClick={() => { setSelected('student'); setError(''); }}
                            className={`flex-1 w-full flex items-center justify-center space-x-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${selected === 'student'
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            <GraduationCap size={20} />
                            <span>STUDENT PORTAL</span>
                        </button>
                        <button
                            onClick={() => { setSelected('admin'); setError(''); }}
                            className={`flex-1 w-full flex items-center justify-center space-x-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${selected === 'admin'
                                ? 'bg-rose-600 text-white shadow-xl shadow-rose-500/30'
                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            <ShieldCheck size={20} />
                            <span>ADMINISTRATOR</span>
                        </button>
                    </div>

                    {/* Interaction Fields */}
                    <div className="space-y-6">
                        {selected === 'admin' ? (
                            <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-2">
                                    <label className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Institutional ID</label>
                                    <input
                                        type="text"
                                        placeholder="Admin Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="placify-input w-full rounded-3xl px-8 py-5 font-bold transition-all focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Access Key</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="placify-input w-full rounded-3xl px-8 py-5 font-bold transition-all focus:outline-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                    <label className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your Name (Optional if existing)"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="placify-input w-full rounded-3xl px-8 py-5 font-bold transition-all focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Roll No</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. S001"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="placify-input w-full rounded-3xl px-8 py-5 font-bold transition-all focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="ml-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Security Crypt / Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Secret Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="placify-input w-full rounded-3xl px-8 py-5 font-bold transition-all focus:outline-none"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className="px-4 text-[10px] font-bold text-slate-500">
                                        Identity verification required. New users will be automatically registered upon first successful synchronization.
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center text-rose-500 space-x-3 text-sm font-black animate-in fade-in zoom-in duration-300">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            className={`w-full py-6 rounded-3xl font-black text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center text-lg ${
                                selected === 'admin' 
                                ? 'bg-gradient-to-r from-rose-600 to-red-600 shadow-rose-900/10' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-indigo-900/10'
                            }`}
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Synchronize Identity'}
                        </button>
                    </div>
                </div>

                <p className="text-center font-bold text-sm text-slate-600">
                    Placify AI Secure Authentication Layer v4.0.1
                </p>
            </div>
        </div>
    );
};

export default LoginView;
