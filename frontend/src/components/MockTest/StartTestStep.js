import React, { useState } from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { SECTION_META, SECTION_ORDER } from '../../config/mockTestSections';

const StartTestStep = ({ onGenerate }) => {
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      onGenerate('');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in py-8">
      {/* Header */}
      <div className="text-center space-y-5">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
          <div className="relative inline-flex p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl text-indigo-600">
            <ShieldCheck size={48} />
          </div>
        </div>
        <h2 className="text-5xl font-black text-slate-900 tracking-tight">
          Placement Readiness <span className="text-indigo-600">Mock Test</span>
        </h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Generate a <span className="text-indigo-600 font-bold">randomized</span> mock test
          calibrated for your placement preparation.
        </p>
      </div>

      {/* Test Structure Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {SECTION_ORDER.map(key => {
          const meta = SECTION_META[key];
          const Icon = meta.icon;
          return (
            <div key={key} className="premium-card p-5 text-center group hover:scale-[1.03] transition-all">
              <div className={`w-12 h-12 mx-auto rounded-2xl bg-${meta.color}-50 text-${meta.color}-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <p className="font-bold text-slate-800 text-sm">{meta.label}</p>
              <p className="text-xs text-slate-400 font-bold mt-1">{meta.count} Qs • {meta.time} min</p>
            </div>
          );
        })}
      </div>

      {/* Generate Button */}
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        <button onClick={handleGenerate} disabled={generating}
          className={`px-16 py-6 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center ${
            generating ? 'bg-indigo-600 text-white opacity-80 cursor-wait' :
            'bg-indigo-600 text-white shadow-indigo-300 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98]'
          }`}>
          {generating ? (
            <><div className="w-6 h-6 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin mr-4"></div> Crafting Your Test...</>
          ) : (
            <><Zap size={24} className="mr-3" /> Generate Mock Test</>
          )}
        </button>
      </div>

      {/* Features Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Test Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { s: "1", t: "101 Questions", d: "25 Quant + 25 English + 30 Reasoning + 15 CS + 6 DSA" },
              { s: "2", t: "Difficulty Mix", d: "30% Easy, 50% Medium, 20% Hard" },
              { s: "3", t: "Always Unique", d: "Randomized every single time from our test bank" }
            ].map((item, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">
                  {item.s}
                </div>
                <div>
                  <p className="font-bold text-white">{item.t}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      </div>
    </div>
  );
};

export default StartTestStep;
