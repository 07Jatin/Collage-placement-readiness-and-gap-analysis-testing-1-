import React from 'react';
import { Award, Eye, AlertCircle, CheckCircle2, Clock, Sparkles, RotateCcw } from 'lucide-react';
import { SECTION_META, SECTION_ORDER } from '../../config/mockTestSections';

const ResultsScreen = ({ testData, sectionProgress, onReset, selectedStudent, onTestSubmitted, setActiveTab, testHistory = [] }) => {
  const scores = {};
  SECTION_ORDER.forEach(key => {
    if (key === 'dsa_random_pool') {
      const dsaAnswered = Object.keys(sectionProgress[key] || {}).filter(k => sectionProgress[key][k] !== '').length;
      scores[key] = { score: dsaAnswered, total: 6, label: 'Attempted' };
    } else {
      const questions = testData.sections[key];
      const answers = sectionProgress[key] || {};
      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });
      scores[key] = { score: correct, total: questions.length, label: `${correct}/${questions.length}` };
    }
  });

  const totalCorrect = Object.values(scores).reduce((s, v, i) => s + (i < 4 ? v.score : 0), 0);
  const totalMCQ = 25 + 25 + 30 + 15;
  const percentage = Math.round((totalCorrect / totalMCQ) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className={`inline-flex p-6 rounded-[2rem] shadow-xl ${
          percentage >= 70 ? 'bg-emerald-50 text-emerald-600 shadow-emerald-100' :
          percentage >= 40 ? 'bg-amber-50 text-amber-600 shadow-amber-100' : 'bg-rose-50 text-rose-600 shadow-rose-100'
        }`}>
          <Award size={48} />
        </div>
        <h2 className="text-5xl font-black text-slate-900">{percentage}%</h2>
        <p className="text-xl text-slate-500 font-medium">
          {percentage >= 70 ? 'Excellent! You are placement-ready 🎉' :
           percentage >= 40 ? 'Good effort! Focus on weak areas 📚' : 'Keep practicing! You\'ll get there 💪'}
        </p>
        <p className="text-sm text-slate-400 font-mono">Test ID: {testData.test_id}</p>
      </div>

      {/* Section Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SECTION_ORDER.map(key => {
          const meta = SECTION_META[key];
          const Icon = meta.icon;
          const score = scores[key];
          const pct = key === 'dsa_random_pool' ? (score.score > 0 ? Math.round((score.score / score.total) * 100) : 0) : Math.round((score.score / score.total) * 100);

          return (
            <div key={key} className="premium-card p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-3 rounded-xl bg-${meta.color}-50 text-${meta.color}-600`}><Icon size={22} /></div>
                <div>
                  <p className="font-bold text-slate-900">{meta.label}</p>
                  <p className={`text-sm font-bold ${pct >= 60 ? 'text-emerald-600' : pct >= 30 ? 'text-amber-600' : 'text-rose-600'}`}>{score.label}</p>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${pct >= 60 ? 'bg-emerald-500' : pct >= 30 ? 'bg-amber-500' : 'bg-rose-500'}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Skill Insights */}
      <div className="premium-card p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <Eye size={20} className="mr-2 text-indigo-600" /> Test Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Target Role Profile</p>
            <div className="flex flex-wrap gap-2">
              {testData.resume_analysis.top_skills.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Suggested Focus Areas</p>
            <div className="space-y-2">
              {Object.entries(scores).filter(([k, v]) => k !== 'dsa_random_pool' && v.total > 0 && (v.score / v.total) < 0.5).map(([key]) => (
                <div key={key} className="flex items-center space-x-2 text-sm">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span className="text-slate-700 font-medium">{SECTION_META[key].label}</span>
                </div>
              ))}
              {Object.entries(scores).filter(([k, v]) => k !== 'dsa_random_pool' && v.total > 0 && (v.score / v.total) < 0.5).length === 0 && (
                <p className="text-emerald-600 font-bold text-sm flex items-center">
                  <CheckCircle2 size={14} className="mr-2" /> All sections above 50% — Great job!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Previous Attempts */}
      {testHistory && testHistory.length > 0 && (
        <div className="premium-card p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Clock size={20} className="mr-2 text-violet-600" /> Previous Attempts
          </h3>
          <div className="space-y-3">
            {testHistory.slice(-5).reverse().map((attempt, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-bold text-slate-500 min-w-[100px]">{attempt.date}</div>
                  <div className="text-sm text-slate-600">{attempt.track || 'Placement Test'}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`text-lg font-bold ${attempt.score >= 70 ? 'text-emerald-600' : attempt.score >= 40 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {attempt.score}%
                  </div>
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${attempt.score >= 70 ? 'bg-emerald-500' : attempt.score >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${attempt.score}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
        <button 
          onClick={async () => {
            const btn = document.getElementById('sync-btn');
            btn.disabled = true;
            btn.innerHTML = '<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div> Syncing...';
            
            try {
              const response = await fetch('http://127.0.0.1:8000/api/submit_test_result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  student_id: selectedStudent,
                  test_id: testData.test_id,
                  overall_score: percentage,
                  category_scores: scores
                })
              });
              
              if (response.ok) {
                if (onTestSubmitted) await onTestSubmitted({ testData, scores });
                btn.innerHTML = '✓ Synced with Gap Visualizer';
                btn.className = 'bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-emerald-200 transition-all flex items-center justify-center';
                setTimeout(() => {
                  if (setActiveTab) setActiveTab('gap');
                }, 1000);
              } else {
                btn.innerHTML = 'Failed to Sync';
                btn.disabled = false;
              }
            } catch (err) {
              console.error('Sync error:', err);
              btn.innerHTML = 'Error Syncing';
              btn.disabled = false;
            }
          }}
          id="sync-btn"
          className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
        >
          <Sparkles size={20} className="mr-3" /> Sync with Milestone Roadmap
        </button>
        <button onClick={onReset}
          className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
          <RotateCcw size={20} className="mr-3" /> Take Another Test
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
