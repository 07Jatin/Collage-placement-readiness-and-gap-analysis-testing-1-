import React from 'react';
import { Target, RotateCcw, Clock, Award } from 'lucide-react';
import { SECTION_META, SECTION_ORDER } from '../../config/mockTestSections';

const TestOverview = ({ testData, onStartSection, sectionProgress, onFinishAll, onBack }) => {
  const totalAnswered = Object.values(sectionProgress).reduce((sum, sp) => sum + Object.keys(sp).length, 0);
  const totalQuestions = SECTION_ORDER.reduce((sum, key) => sum + SECTION_META[key].count, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
            <Target size={32} className="mr-3 text-indigo-600" /> Your Mock Test
          </h2>
          <p className="text-slate-500 font-medium">
            Test ID: <span className="text-indigo-600 font-bold font-mono">{testData.test_id}</span>
          </p>
        </div>
        <button onClick={onBack} className="flex items-center text-slate-400 hover:text-slate-700 font-bold transition-colors">
          <RotateCcw size={18} className="mr-2" /> New Test
        </button>
      </div>

      {/* Progress Bar */}
      <div className="premium-card p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-slate-600">Overall Progress</span>
          <span className="text-sm font-black text-indigo-600">{totalAnswered}/{totalQuestions}</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${(totalAnswered / totalQuestions) * 100}%` }} />
        </div>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTION_ORDER.map(key => {
          const meta = SECTION_META[key];
          const Icon = meta.icon;
          const answered = Object.keys(sectionProgress[key] || {}).length;
          const total = key === 'dsa_random_pool' ? 6 : meta.count;
          const isDSA = key === 'dsa_random_pool';
          const isComplete = answered > 0 && answered >= (isDSA ? 3 : total);

          return (
            <div key={key} className={`premium-card group overflow-hidden transition-all ${isComplete ? 'ring-2 ring-emerald-500/30' : ''}`}>
              <div className="p-8 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-4 rounded-2xl bg-${meta.color}-50 text-${meta.color}-600 group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  {isComplete && (
                    <div className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl">
                      ✓ Done
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{meta.label}</h3>
                {isDSA && (
                  <p className="text-xs text-rose-500 font-bold mb-2">⚡ Answer any 3 of 6 questions</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center"><Clock size={14} className="mr-1" />{meta.time} min</span>
                  <span className="font-bold">{answered}/{total} answered</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                  <div className={`h-full bg-${meta.color}-500 rounded-full transition-all duration-500`}
                    style={{ width: `${(answered / total) * 100}%` }} />
                </div>
                <button onClick={() => onStartSection(key)}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
                    isComplete
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.97]'
                  }`}>
                  {isComplete ? 'Review Answers' : answered > 0 ? 'Continue' : 'Start Section'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Finish Button */}
      {totalAnswered > 0 && (
        <div className="flex justify-center pt-4">
          <button onClick={onFinishAll}
            className="bg-emerald-600 text-white px-14 py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center">
            <Award size={24} className="mr-3" /> Submit & View Results
          </button>
        </div>
      )}
    </div>
  );
};

export default TestOverview;
