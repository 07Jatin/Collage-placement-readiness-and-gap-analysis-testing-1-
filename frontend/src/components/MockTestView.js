import React from 'react';
import { Clock, ArrowRight, ShieldCheck, Plus, Briefcase, Activity, GraduationCap } from 'lucide-react';

const MockTestView = ({
    testActive,
    currentQuestion, setCurrentQuestion,
    testQuestions,
    userAnswers, handleAnswer,
    finishTest,
    startTest
}) => {
    if (testActive && testQuestions.length > 0) {
        const q = testQuestions[currentQuestion];
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in mt-10">
                <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                            style={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                        />
                    </div>

                    <div className="flex justify-between items-center mb-12 pt-4">
                        <div className="px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-black tracking-wider uppercase">
                            Question {currentQuestion + 1} of {testQuestions.length}
                        </div>
                        <div className="flex items-center space-x-3 text-slate-400 font-bold bg-slate-50 px-5 py-2.5 rounded-2xl">
                            <Clock size={18} />
                            <span className="tabular-nums">14:52 Remaining</span>
                        </div>
                    </div>

                    <div className="space-y-10 mb-12">
                        <h2 className="text-3xl font-black text-slate-900 leading-tight">
                            {q.question}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {q.options.map((opt, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleAnswer(i)}
                                    className={`group relative text-left p-6 rounded-2xl border-2 transition-all duration-300 ${userAnswers[currentQuestion] === i
                                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600/20'
                                        : 'border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg'
                                        }`}
                                >
                                    <div className="flex items-center">
                                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-bold transition-colors ${userAnswers[currentQuestion] === i ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                            }`}>
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className={`text-lg transition-colors ${userAnswers[currentQuestion] === i ? 'text-indigo-900 font-semibold' : 'text-gray-700'}`}>
                                            {opt}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center px-4">
                        <button
                            disabled={currentQuestion === 0}
                            onClick={() => setCurrentQuestion(prev => prev - 1)}
                            className="px-8 py-3 text-gray-600 font-bold disabled:opacity-30 flex items-center hover:text-indigo-600 transition-colors"
                        >
                            Previous Question
                        </button>
                        {currentQuestion === testQuestions.length - 1 ? (
                            <button
                                onClick={finishTest}
                                className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                Complete Assessment
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestion(prev => prev + 1)}
                                className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                            >
                                Next Step <ArrowRight size={20} className="ml-2" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 space-y-16 animate-in">
            <div className="flex flex-col items-center text-center space-y-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
                    <div className="relative inline-flex p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl text-indigo-600 mb-2">
                        <ShieldCheck size={48} />
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">Industry Benchmarks</h2>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Specialized evaluation tracks calibrated against current market standards.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[
                    {
                        id: 'software_engineering',
                        name: 'Software Engineering',
                        icon: Briefcase,
                        desc: 'Algorithms, Architecture & Systems.',
                        color: 'indigo',
                        stats: '15 Mins'
                    },
                    {
                        id: 'data_science',
                        name: 'Data Science',
                        icon: Activity,
                        desc: 'ML Core, Statistics & Data Ops.',
                        color: 'emerald',
                        stats: '10 Mins'
                    },
                    {
                        id: 'aptitude',
                        name: 'Global Aptitude',
                        icon: GraduationCap,
                        desc: 'Logical, Quant & Verbal Mastery.',
                        color: 'amber',
                        stats: '5 Mins'
                    }
                ].map((track) => (
                    <div key={track.id} className="premium-card group overflow-hidden">
                        <div className="p-10 flex flex-col items-center text-center h-full">
                            <div className={`p-6 rounded-3xl bg-${track.color}-50 text-${track.color}-600 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm shadow-${track.color}-100`}>
                                <track.icon size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-4">{track.name}</h3>
                            <p className="text-slate-500 mb-10 flex-1 font-medium leading-relaxed">
                                {track.desc}
                            </p>
                            <div className="w-full pt-8 border-t border-slate-50 flex flex-col space-y-4">
                                <div className="flex items-center justify-center space-x-2 text-slate-400">
                                    <Clock size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest">{track.stats}</span>
                                </div>
                                <button
                                    onClick={() => startTest(track.id)}
                                    className="w-full py-5 rounded-2xl font-black text-white shadow-xl shadow-indigo-100 transition-all hover:scale-[1.03] active:scale-[0.97] bg-indigo-600"
                                >
                                    Launch Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900 rounded-[3.5rem] p-16 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-10">
                        <h3 className="text-4xl font-black leading-tight">Dynamic Benchmarking <br /><span className="text-indigo-400">Feedback Loop</span></h3>
                        <div className="space-y-6">
                            {[
                                { t: "Adaptive Difficulty", d: "Content modulates based on previous session velocity." },
                                { t: "Peer Benchmarking", d: "Live ranking against 50k+ global candidate profiles." },
                                { t: "Deep-Insight Report", d: "Granular breakdown of sub-category performance." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start space-x-5">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-1">
                                        <Plus size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{item.t}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-2xl p-12 rounded-[3rem] border border-white/10 flex flex-col items-center justify-center text-center shadow-inner">
                        <div className="space-y-2 mb-8">
                            <p className="text-indigo-400 font-black uppercase tracking-widest text-xs">Platform Impact</p>
                            <p className="text-7xl font-black">+92%</p>
                            <p className="text-slate-400 font-medium">Placement Predictability Rate</p>
                        </div>
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-slate-900 bg-slate-800 overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            </div>
        </div>
    );
};

export default MockTestView;
