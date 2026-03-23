import React, { useState, useEffect } from 'react';
import {
  Clock, ArrowRight, ArrowLeft, ShieldCheck,
  FileText, Sparkles, CheckCircle2,
  Target, AlertCircle, BookOpen, Code, Timer, Award, ChevronRight,
  Zap, Brain, BarChart3, ClipboardPaste, FileUp, RotateCcw, Eye, ExternalLink
} from 'lucide-react';
import { generatePlacementTest } from '../resumeTestGenerator';
import { SAMPLE_RESUME } from '../skillData';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// ━━━━━━━━━ PDF Text Extraction ━━━━━━━━━
async function extractTextFromPDF(arrayBuffer) {
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items.map(item => item.str);
      fullText += strings.join(' ') + '\n';
    }
    return fullText;
  } catch (err) {
    console.error('PDF parsing error:', err);
    return '';
  }
}

// ━━━━━━━━━ SECTION META INFO ━━━━━━━━━
const SECTION_META = {
  quantitative: { label: 'Quantitative Aptitude', icon: BarChart3, color: 'indigo', count: 25, time: 30 },
  english: { label: 'English Proficiency', icon: BookOpen, color: 'emerald', count: 25, time: 25 },
  reasoning: { label: 'Logical Reasoning', icon: Brain, color: 'violet', count: 30, time: 35 },
  computer_science: { label: 'Computer Science', icon: Code, color: 'amber', count: 15, time: 20 },
  dsa_random_pool: { label: 'DSA Challenge Pool', icon: Zap, color: 'rose', count: 6, time: 30 },
};
const SECTION_ORDER = ['quantitative', 'english', 'reasoning', 'computer_science', 'dsa_random_pool'];

// ━━━━━━━━━ STEP 1: Resume Upload for Test ━━━━━━━━━
const ResumeInputStep = ({ onGenerate }) => {
  const [resumeText, setResumeText] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [parseStatus, setParseStatus] = useState(''); // '', 'parsing', 'done', 'error'

  const handleFileRead = async (file) => {
    setFileName(file.name);
    const ext = file.name.split('.').pop().toLowerCase();

    if (ext === 'pdf') {
      // Parse PDF to extract actual text
      setParseStatus('parsing');
      try {
        const arrayBuffer = await file.arrayBuffer();
        const text = await extractTextFromPDF(arrayBuffer);
        if (text.trim()) {
          setResumeText(text);
          setParseStatus('done');
        } else {
          setParseStatus('error');
          setResumeText('');
        }
      } catch (err) {
        console.error('Error reading PDF:', err);
        setParseStatus('error');
      }
    } else {
      // Plain text / other files
      setParseStatus('');
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeText(e.target.result);
        setParseStatus('done');
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      onGenerate(resumeText);
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
          Upload your resume to generate a <span className="text-indigo-600 font-bold">personalized, randomized</span> test
          calibrated to your skills and target role.
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

      {/* Upload Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFileRead(file);
          }}
          className={`relative rounded-[2.5rem] border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${
            dragOver ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
          }`}
        >
          <input type="file" accept=".txt,.pdf,.doc,.docx"
            onChange={(e) => { const f = e.target.files[0]; if (f) handleFileRead(f); }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="space-y-4">
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-colors ${
              dragOver ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              <FileUp size={32} />
            </div>
            <p className="font-bold text-slate-700 text-lg">
              {fileName ? fileName : 'Drop your resume here'}
            </p>
            <p className="text-sm text-slate-400">Supports .txt and .pdf resume files</p>
            {parseStatus === 'parsing' && (
              <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold">
                <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mr-2"></div> Extracting text from PDF...
              </div>
            )}
            {parseStatus === 'error' && (
              <div className="inline-flex items-center px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold">
                <AlertCircle size={16} className="mr-2" /> Could not extract text. Try pasting content instead.
              </div>
            )}
            {(parseStatus === 'done' || (fileName && parseStatus === '')) && (
              <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold">
                <CheckCircle2 size={16} className="mr-2" /> File loaded
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center">
              <ClipboardPaste size={14} className="mr-2" /> Or paste content
            </label>
            <button onClick={() => { setResumeText(SAMPLE_RESUME); setFileName('sample_resume.txt'); }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center">
              <Sparkles size={12} className="mr-1" /> Load Sample
            </button>
          </div>
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="w-full h-[280px] p-6 rounded-2xl bg-white border border-slate-100 text-slate-700 font-medium text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all custom-scrollbar"
          />
        </div>
      </div>

      {/* Generate Button (Moved above Features banner for visibility) */}
      <div className="flex flex-col items-center justify-center py-6 gap-3">
        <button onClick={handleGenerate} disabled={generating}
          className={`px-16 py-6 rounded-2xl font-black text-xl shadow-2xl transition-all flex items-center ${
            generating ? 'bg-indigo-600 text-white opacity-80 cursor-wait' :
            !resumeText.trim() 
              ? 'bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:-translate-y-1 hover:shadow-indigo-100 active:scale-[0.98]' 
              : 'bg-indigo-600 text-white shadow-indigo-300 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98]'
          }`}>
          {generating ? (
            <><div className="w-6 h-6 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin mr-4"></div> Crafting Your Test...</>
          ) : (
            <><Zap size={24} className="mr-3" /> {resumeText.trim() ? 'Generate Resume-Tuned Test' : 'Skip Resume & Generate Mock Test'}</>
          )}
        </button>
        {!resumeText.trim() && !generating && (
          <p className="text-sm font-bold text-slate-400">Standard questions will be randomly selected from the bank.</p>
        )}
      </div>

      {/* Features Banner */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">Test Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { s: "1", t: "101 Questions", d: "25 Quant + 25 English + 30 Reasoning + 15 CS + 6 DSA" },
              { s: "2", t: "Difficulty Mix", d: "30% Easy, 50% Medium, 20% Hard" },
              { s: "3", t: "Resume-Tuned", d: "DSA questions match your tech stack" },
              { s: "4", t: "Always Unique", d: "Randomized every single time" }
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

// ━━━━━━━━━ STEP 2: Test Overview / Section Selector ━━━━━━━━━
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

      {/* Resume Analysis Card */}
      <div className="premium-card p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
          <FileText size={20} className="mr-2 text-indigo-600" /> Resume Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Top Skills Detected</p>
            <div className="flex flex-wrap gap-2">
              {testData.resume_analysis.top_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Suggested Roles</p>
            <div className="flex flex-wrap gap-2">
              {testData.resume_analysis.suggested_roles.map((role, i) => (
                <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold">{role}</span>
              ))}
            </div>
          </div>
        </div>
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

// ━━━━━━━━━ STEP 3: Section Test (MCQ or DSA) ━━━━━━━━━
const SectionTest = ({ sectionKey, questions, answers, onAnswer, onBack }) => {
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
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl bg-${meta.color}-50 text-${meta.color}-600`}><Icon size={20} /></div>
            <span className="font-black text-slate-900 text-lg">{meta.label}</span>
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

// ━━━━━━━━━ STEP 4: Results Screen ━━━━━━━━━
const ResultsScreen = ({ testData, sectionProgress, onReset }) => {
  const scores = {};
  SECTION_ORDER.forEach(key => {
    if (key === 'dsa_random_pool') {
      const dsaAnswered = Object.keys(sectionProgress[key] || {}).filter(k => sectionProgress[key][k] !== '').length;
      scores[key] = { answered: dsaAnswered, total: 6, correct: dsaAnswered, label: 'Attempted' };
    } else {
      const questions = testData.sections[key];
      const answers = sectionProgress[key] || {};
      let correct = 0;
      questions.forEach((q, i) => {
        if (answers[i] === q.answer) correct++;
      });
      scores[key] = { answered: Object.keys(answers).length, total: questions.length, correct, label: `${correct}/${questions.length}` };
    }
  });

  const totalCorrect = Object.values(scores).reduce((s, v) => s + (v.key !== 'dsa_random_pool' ? v.correct : 0), 0);
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
          const pct = key === 'dsa_random_pool' ? (score.answered > 0 ? 100 : 0) : Math.round((score.correct / score.total) * 100);

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
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Skills from Resume</p>
            <div className="flex flex-wrap gap-2">
              {testData.resume_analysis.top_skills.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Suggested Focus Areas</p>
            <div className="space-y-2">
              {Object.entries(scores).filter(([k, v]) => k !== 'dsa_random_pool' && (v.correct / v.total) < 0.5).map(([key]) => (
                <div key={key} className="flex items-center space-x-2 text-sm">
                  <AlertCircle size={14} className="text-amber-500" />
                  <span className="text-slate-700 font-medium">{SECTION_META[key].label}</span>
                </div>
              ))}
              {Object.entries(scores).filter(([k, v]) => k !== 'dsa_random_pool' && (v.correct / v.total) < 0.5).length === 0 && (
                <p className="text-emerald-600 font-bold text-sm flex items-center">
                  <CheckCircle2 size={14} className="mr-2" /> All sections above 50% — Great job!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
        <button onClick={onReset}
          className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center">
          <RotateCcw size={20} className="mr-3" /> Take Another Test
        </button>
      </div>
    </div>
  );
};

// ━━━━━━━━━ MAIN COMPONENT ━━━━━━━━━
const MockTestView = () => {
  const [phase, setPhase] = useState('upload'); // upload | overview | section | results
  const [testData, setTestData] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [sectionProgress, setSectionProgress] = useState({
    quantitative: {}, english: {}, reasoning: {}, computer_science: {}, dsa_random_pool: {}
  });

  const handleGenerate = async (resumeText) => {
    try {
      const test = await generatePlacementTest(resumeText);
      setTestData(test);
      setSectionProgress({ quantitative: {}, english: {}, reasoning: {}, computer_science: {}, dsa_random_pool: {} });
      setPhase('overview');
    } catch(e) {
      console.error("Test generation failed", e);
    }
  };

  const handleStartSection = (sectionKey) => {
    setActiveSection(sectionKey);
    setPhase('section');
  };

  const handleAnswer = (questionIdx, value) => {
    setSectionProgress(prev => ({
      ...prev,
      [activeSection]: { ...prev[activeSection], [questionIdx]: value }
    }));
  };

  const handleBackToOverview = () => {
    setPhase('overview');
    setActiveSection(null);
  };

  const handleFinishAll = () => {
    setPhase('results');
  };

  const handleReset = () => {
    setPhase('upload');
    setTestData(null);
    setActiveSection(null);
    setSectionProgress({ quantitative: {}, english: {}, reasoning: {}, computer_science: {}, dsa_random_pool: {} });
  };

  if (phase === 'upload') return <ResumeInputStep onGenerate={handleGenerate} />;

  if (phase === 'overview' && testData) {
    return (
      <TestOverview
        testData={testData}
        sectionProgress={sectionProgress}
        onStartSection={handleStartSection}
        onFinishAll={handleFinishAll}
        onBack={handleReset}
      />
    );
  }

  if (phase === 'section' && testData && activeSection) {
    return (
      <SectionTest
        sectionKey={activeSection}
        questions={testData.sections[activeSection]}
        answers={sectionProgress[activeSection]}
        onAnswer={handleAnswer}
        onBack={handleBackToOverview}
      />
    );
  }

  if (phase === 'results' && testData) {
    return (
      <ResultsScreen
        testData={testData}
        sectionProgress={sectionProgress}
        onReset={handleReset}
      />
    );
  }

  return null;
};

export default MockTestView;
