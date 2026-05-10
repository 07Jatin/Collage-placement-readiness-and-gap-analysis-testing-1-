import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, ArrowRight, ExternalLink, CheckCircle2, Timer, ChevronRight } from 'lucide-react';
import { SECTION_META } from '../../config/mockTestSections';

const SectionTest = ({ sectionKey, questions, answers, onAnswer, onBack, onSubmitEarly }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const meta = SECTION_META[sectionKey];
  const Icon = meta.icon;
  const isDSA = sectionKey === 'dsa_random_pool';
  const [timeLeft, setTimeLeft] = useState(meta.time * 60);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (isDSA) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in py-8">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-slate-400 hover:text-slate-700 font-bold transition-colors">
            <ArrowLeft size={18} className="mr-2" /> Back to Overview
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={onSubmitEarly}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center"
            >
              <Send size={16} className="mr-2" /> Submit Test Early
            </button>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl bg-${meta.color}-50 text-${meta.color}-600`}><Icon size={20} /></div>
              <span className="font-black text-slate-900 text-lg">{meta.label}</span>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 text-center">
          <p className="font-bold text-rose-700">⚡ Select and answer any <span className="text-rose-900 text-xl">3</span> questions from this section.</p>
        </div>

        <div className="space-y-6">
          {questions.map((q, i) => {
            const isSelected = answers[i] !== undefined;
            return (
              <div key={i} className={`premium-card p-8 transition-all ${isSelected ? 'ring-2 ring-rose-500/30' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-black text-sm">{i + 1}</span>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      q.type === 'coding' ? 'bg-violet-50 text-violet-600' : 'bg-blue-50 text-blue-600'
                    }`}>{q.type}</span>
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      q.difficulty === 'hard' ? 'bg-red-50 text-red-600' : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                    }`}>{q.difficulty}</span>
                  </div>
                  {isSelected && <CheckCircle2 size={20} className="text-emerald-500" />}
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center justify-between">
                  <span>{q.question}</span>
                  {q.link && (
                    <a href={q.link} target="_blank" rel="noopener noreferrer" className="ml-4 flex items-center shrink-0 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                      View Problem <ExternalLink size={14} className="ml-1.5" />
                    </a>
                  )}
                </h3>
                
                <p className="text-sm text-slate-500 mb-4">💡 <span className="font-medium">{q.hint}</span></p>
                <textarea
                  value={answers[i] || ''}
                  onChange={(e) => onAnswer(i, e.target.value)}
                  placeholder="Write your answer / approach here..."
                  className="w-full h-24 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button onClick={onBack}
            className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center">
            Save & Return <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  // Regular MCQ section
  const q = questions[currentQ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in mt-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-50">
          <div className={`h-full bg-${meta.color}-600 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(99,102,241,0.4)]`}
            style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-10 pt-4">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className={`px-4 py-2 bg-${meta.color}-50 text-${meta.color}-700 rounded-2xl text-sm font-black tracking-wider uppercase`}>
              {meta.label} — Q{currentQ + 1}/{questions.length}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onSubmitEarly}
              className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors flex items-center"
            >
              <Send size={16} className="mr-2" /> Submit Test
            </button>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
              q.difficulty === 'hard' ? 'bg-red-50 text-red-600' : q.difficulty === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
            }`}>{q.difficulty}</span>
            <div className={`flex items-center space-x-2 font-bold px-4 py-2 rounded-2xl ${
              timeLeft < 120 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
            }`}>
              <Timer size={16} />
              <span className="tabular-nums">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-8 mb-10">
          <h2 className="text-2xl font-black text-slate-900 leading-tight">{q.question}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => onAnswer(currentQ, i)}
                className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                  answers[currentQ] === i
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600/20'
                    : 'border-gray-100 hover:border-indigo-200 hover:bg-white hover:shadow-lg'
                }`}>
                <div className="flex items-center">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-bold transition-colors ${
                    answers[currentQ] === i ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                  }`}>{String.fromCharCode(65 + i)}</span>
                  <span className={`text-base transition-colors ${answers[currentQ] === i ? 'text-indigo-900 font-semibold' : 'text-gray-700'}`}>
                    {opt}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center px-2">
          <button disabled={currentQ === 0} onClick={() => setCurrentQ(p => p - 1)}
            className="px-6 py-3 text-gray-600 font-bold disabled:opacity-30 flex items-center hover:text-indigo-600 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Previous
          </button>

          {/* Question dots */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xs">
            {questions.slice(0, Math.min(questions.length, 30)).map((_, i) => (
              <button key={i} onClick={() => setCurrentQ(i)}
                className={`w-7 h-7 rounded-lg text-[10px] font-bold transition-all ${
                  i === currentQ ? 'bg-indigo-600 text-white scale-110 shadow-md' :
                  answers[i] !== undefined ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}>{i + 1}</button>
            ))}
          </div>

          {currentQ === questions.length - 1 ? (
            <button onClick={onBack}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center">
              Save & Return <ChevronRight size={18} className="ml-2" />
            </button>
          ) : (
            <button onClick={() => setCurrentQ(p => p + 1)}
              className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold flex items-center hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
              Next <ArrowRight size={18} className="ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionTest;
