import React, { useState } from 'react';
import { Target, GraduationCap, ShieldCheck, AlertCircle, Loader2, Sun, Moon, Eye, EyeOff } from 'lucide-react';

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
            // Roll Number is treated as varchar (string) automatically
            if (!cleanUsername || !cleanPassword) {
                setError('Roll Number and Password are required.');
                return;
            }
            
            setLoading(true);
            try {
                // If student is already in JSON, name is optional. 
                // If they are new, name will be updated/set on backend.
                const response = await fetch('http://127.0.0.1:8000/api/students/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roll_no: cleanUsername.toUpperCase(),
                        password: cleanPassword,
                        name: name.trim() || undefined, // Allow empty name if existing
                        email: email.trim(),
                        mobile: mobile.trim()
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.detail || 'Authentication failed');
                }
                const data = await response.json();
                
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
        <div className={`min-h-screen flex items-center justify-center p-6 md:p-12 relative overflow-hidden font-sans transition-colors duration-700 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            {/* Animated Background Blobs */}
            <div className={`absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40`}>
                <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse duration-[8s] ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-200/50'}`}></div>
                <div className={`absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full blur-[120px] animate-pulse duration-[10s] ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-100/50'}`}></div>
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full blur-[150px] animate-pulse duration-[12s] ${darkMode ? 'bg-purple-900/20' : 'bg-purple-100/40'}`}></div>
            </div>

            {/* Subtle Tech Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: `radial-gradient(${darkMode ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>

            <div className="w-full max-w-xl relative z-20 space-y-8 my-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className={`inline-flex p-5 rounded-[2.5rem] shadow-2xl transition-all duration-500 hover:rotate-6 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} border`}>
                        <div className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
                            <Target size={42} className="text-white" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <h1 className={`text-6xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Placify <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">AI</span>
                        </h1>
                        <p className={`font-bold text-lg ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>The Future of Career Orchestration</p>
                    </div>
                    
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`absolute top-0 right-0 p-3 rounded-2xl transition-all active:scale-90 ${darkMode ? 'bg-slate-900 text-amber-400 border-slate-800' : 'bg-white text-slate-500 border-slate-100'} border shadow-xl`}
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                {/* Main Auth Card */}
                <div className={`p-10 rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border transition-all duration-500 backdrop-blur-3xl ${darkMode ? 'bg-slate-900/80 border-slate-800/80' : 'bg-white/80 border-white/20'}`}>
                    <div className="space-y-3 mb-10">
                        <h2 className={`text-3xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Welcome Back</h2>
                        <p className={`font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select your portal to synchronize your progress.</p>
                    </div>

                    {/* Portal Switcher */}
                    <div className={`p-2 rounded-[2.5rem] flex items-center mb-10 ${darkMode ? 'bg-slate-950/50' : 'bg-slate-100/50'}`}>
                        <button
                            onClick={() => { setSelected('student'); setError(''); }}
                            className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${selected === 'student'
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                                : `${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`
                                }`}
                        >
                            <GraduationCap size={20} />
                            <span>STUDENT</span>
                        </button>
                        <button
                            onClick={() => { setSelected('admin'); setError(''); }}
                            className={`flex-1 flex items-center justify-center space-x-3 py-4 rounded-[2rem] font-black text-sm transition-all duration-300 ${selected === 'admin'
                                ? 'bg-rose-600 text-white shadow-xl shadow-rose-500/30'
                                : `${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`
                                }`}
                        >
                            <ShieldCheck size={20} />
                            <span>INSTITUTIONAL</span>
                        </button>
                    </div>

                    {/* Interaction Fields */}
                    <div className="space-y-6">
                        {selected === 'admin' ? (
                            <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Institutional ID</label>
                                    <input
                                        type="text"
                                        placeholder="Admin Username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className={`w-full px-8 py-5 rounded-3xl border focus:outline-none focus:ring-4 transition-all font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:ring-rose-500/10 focus:border-rose-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-rose-500/10 focus:border-rose-500'}`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Access Key</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full px-8 py-5 rounded-3xl border focus:outline-none focus:ring-4 transition-all font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:ring-rose-500/10 focus:border-rose-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-rose-500/10 focus:border-rose-500'}`}
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
                                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Your Name (Optional if existing)"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className={`w-full px-8 py-5 rounded-3xl border focus:outline-none focus:ring-4 transition-all font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:ring-indigo-500/10 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-indigo-500/10 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Roll No</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. S001"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className={`w-full px-8 py-5 rounded-3xl border focus:outline-none focus:ring-4 transition-all font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:ring-indigo-500/10 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-indigo-500/10 focus:border-indigo-500'}`}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ml-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Security Crypt / Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Secret Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`w-full px-8 py-5 rounded-3xl border focus:outline-none focus:ring-4 transition-all font-bold ${darkMode ? 'bg-slate-950 border-slate-800 text-white focus:ring-indigo-500/10 focus:border-indigo-500' : 'bg-slate-50 border-slate-100 text-slate-900 focus:ring-indigo-500/10 focus:border-indigo-500'}`}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    <p className={`text-[10px] font-bold px-4 ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>New users: Create a password. Existing users: Enter your registered key.</p>
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

                <p className={`text-center font-bold text-sm ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                    Placify AI Secure Authentication Layer v4.0.1
                </p>
            </div>
        </div>
    );
};

export default LoginView;
