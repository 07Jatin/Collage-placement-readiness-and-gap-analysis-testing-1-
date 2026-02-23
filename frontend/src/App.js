import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  LayoutDashboard,
  FileText,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  User,
  LogOut,
  Users,
  Briefcase,
  GraduationCap,
  Activity,
  ShieldCheck,
  Zap,
  Trophy,
  Map,
  BarChart2,
  Plus
} from 'lucide-react';
import { MOCK_QUESTIONS } from './questions';

// --- Constants & Categories ---

const CATEGORIES = {
  QUANTITATIVE: 'Quantitative Aptitude',
  LOGICAL: 'Logical Reasoning',
  TECHNICAL: 'Technical Skills',
  VERBAL: 'Verbal Ability'
};


// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
      }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, subtext, icon: Icon, color }) => {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100'
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {subtext && <p className="text-xs text-gray-400 mt-1 font-medium">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color] || 'bg-gray-50 text-gray-600'}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const SkillRoadmapItem = ({ title, status, desc, icon: Icon }) => (
  <div className="relative flex items-start space-x-6 pb-8 last:pb-0">
    <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-100 last:hidden"></div>
    <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${status === 'completed' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
      status === 'current' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 animate-pulse' :
        'bg-gray-100 text-gray-400'
      }`}>
      <Icon size={18} />
    </div>
    <div className="flex-1 pt-1">
      <h4 className={`font-bold ${status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  </div>
);

// --- Main App ---

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [testActive, setTestActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('S001');
  const [testTrack, setTestTrack] = useState('software_engineering');
  const [testQuestions, setTestQuestions] = useState([]);

  // Backend data states
  const [gapReport, setGapReport] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [skillGaps, setSkillGaps] = useState(null);
  const [students, setStudents] = useState([]);

  // Mock history data (would come from backend in production)
  const [history, setHistory] = useState([
    { date: '2024-05-10', score: 65, readiness: 62 },
    { date: '2024-05-15', score: 72, readiness: 68 },
    { date: '2024-05-20', score: 78, readiness: 75 }
  ]);

  // Fetch backend data
  useEffect(() => {
    const fetchGapReport = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/gap_report/${selectedStudent}`);
        const data = await res.json();
        setGapReport(data);
      } catch (err) {
        console.error('Error fetching gap report:', err);
      }
    };

    const fetchReadiness = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/predict_readiness/${selectedStudent}`);
        const data = await res.json();
        setReadiness(data);
      } catch (err) {
        console.error('Error fetching readiness:', err);
      }
    };

    const fetchSkillGaps = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/admin/skill_gaps');
        const data = await res.json();
        setSkillGaps(data);
      } catch (err) {
        console.error('Error fetching skill gaps:', err);
      }
    };

    fetchGapReport();
    fetchReadiness();
    fetchSkillGaps();
  }, [selectedStudent]);

  // Generate student list
  useEffect(() => {
    const studentList = [];
    for (let i = 1; i <= 12; i++) {
      studentList.push(`S${String(i).padStart(3, '0')}`);
    }
    setStudents(studentList);
  }, []);

  // Calculated Metrics
  const readinessScore = useMemo(() => {
    if (readiness && readiness.readiness_score_percent) {
      return readiness.readiness_score_percent;
    }
    return history[history.length - 1]?.readiness || 0;
  }, [readiness, history]);

  // Radar data based on skill gaps
  const radarData = useMemo(() => {
    if (gapReport && gapReport.missing_skills) {
      const missingCount = gapReport.missing_skills.length;
      const techScore = Math.max(50, 100 - missingCount * 15);
      const quantScore = 70 + Math.random() * 25;
      const logicalScore = 65 + Math.random() * 30;
      const verbalScore = 60 + Math.random() * 30;

      return [
        { subject: 'Technical', A: techScore, full: 100 },
        { subject: 'Quantitative', A: quantScore, full: 100 },
        { subject: 'Logical', A: logicalScore, full: 100 },
        { subject: 'Verbal', A: verbalScore, full: 100 },
        { subject: 'Soft Skills', A: 80, full: 100 },
      ];
    }
    return [
      { subject: 'Technical', A: 85, full: 100 },
      { subject: 'Quantitative', A: 70, full: 100 },
      { subject: 'Logical', A: 75, full: 100 },
      { subject: 'Verbal', A: 65, full: 100 },
      { subject: 'Soft Skills', A: 80, full: 100 },
    ];
  }, [gapReport]);

  // --- Handlers ---

  const startTest = (track) => {
    setActiveTab('tests');
    setTestTrack(track);
    const questions = MOCK_QUESTIONS[track] || [];
    setTestQuestions(questions);
    setTestActive(true);
    setCurrentQuestion(0);
    setUserAnswers({});
    setTestResult(null);
  };

  const handleAnswer = (optionIdx) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestion]: optionIdx }));
  };

  const finishTest = () => {
    let correct = 0;
    const categoryScores = {};

    testQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct) {
        correct++;
        categoryScores[q.category] = (categoryScores[q.category] || 0) + 1;
      }
    });

    const result = {
      total: testQuestions.length,
      correct,
      score: Math.round((correct / testQuestions.length) * 100),
      categoryScores
    };

    setTestResult(result);
    setTestActive(false);
    setActiveTab('dashboard');

    // Add to history
    setHistory(prev => [...prev, {
      date: new Date().toISOString().split('T')[0],
      score: result.score,
      readiness: Math.min(100, readinessScore + 5)
    }]);
  };

  // Dummy benchmark data
  const benchmarkData = [
    { name: 'Core CS', user: 82, market: 75 },
    { name: 'System Design', user: 65, market: 70 },
    { name: 'Frontend', user: 90, market: 68 },
    { name: 'Backend', user: 72, market: 78 },
    { name: 'DevOps', user: 45, market: 60 }
  ];

  // --- View Components ---

  const DashboardView = () => {
    return (
      <div className="space-y-10 animate-in pb-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center">
              Insights <span className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-xl text-sm font-bold">PRO</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg">Predicting your trajectory in the global tech ecosystem.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white px-6 py-4 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center space-x-3">
              <Users size={20} className="text-slate-400" />
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="bg-transparent font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                {students.map((sid) => (
                  <option key={sid} value={sid}>{sid}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Readiness" value={`${Math.round(readinessScore)}%`} subtext={readiness?.predicted_label || "Analyzing..."} icon={Target} color="indigo" />
          <StatCard title="Career Fit" value={gapReport?.best_role_match || "Pending"} subtext={`Match: ${gapReport ? Math.round(gapReport.jaccard_score * 100) : 0}%`} icon={Briefcase} color="amber" />
          <StatCard title="Tests Taken" value={history.length} subtext="Consistency is key" icon={Activity} color="emerald" />
          <StatCard title="Global Rank" value="Top 8%" subtext="Across 12k students" icon={Award} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth & Benchmarks */}
          <div className="lg:col-span-2 space-y-8">
            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <TrendingUp size={24} className="mr-3 text-indigo-600" /> Improvement Vector
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} tickMargin={10} />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={5} dot={{ fill: '#4f46e5', strokeWidth: 3, r: 6, stroke: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                    <Line type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="premium-card p-8">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-bold text-slate-900 flex items-center">
                  <BarChart2 size={24} className="mr-3 text-amber-500" /> Market Alignment Benchmark
                </h3>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={benchmarkData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="user" fill="#6366f1" radius={[6, 6, 0, 0]} name="Your Performance" />
                    <Bar dataKey="market" fill="#e2e8f0" radius={[6, 6, 0, 0]} name="Industry Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar Insights */}
          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <h4 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Skill Radar Profile</h4>
              <div className="h-64 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }} />
                    <Radar name="Proficiency" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-5 pt-8 border-t border-white/5">
                {radarData.slice(0, 3).map((d, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm font-medium">{d.subject}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${d.A}%` }} />
                      </div>
                      <span className="text-xs font-bold w-8">{d.A}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
            </div>

            <div className="premium-card p-8">
              <h4 className="text-slate-900 font-bold mb-6 flex items-center">
                <Zap size={20} className="mr-2 text-rose-500" /> Critical Skills Gap
              </h4>
              <div className="space-y-4">
                {gapReport?.missing_skills?.slice(0, 3).map((skill, i) => (
                  <div key={i} className="flex items-center p-4 bg-rose-50/50 rounded-2xl border border-rose-100/50">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm mr-4 shrink-0">
                      <AlertCircle size={14} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{skill}</p>
                      <p className="text-[10px] text-rose-600 font-bold uppercase tracking-tight">Immediate Action Required</p>
                    </div>
                  </div>
                ))}
                {!gapReport?.missing_skills?.length && (
                  <div className="text-center py-6 bg-emerald-50 rounded-2xl">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-2" />
                    <p className="text-sm font-bold text-emerald-900">Market Profile Matched!</p>
                  </div>
                )}
              </div>
              <button onClick={() => setActiveTab('gap')} className="w-full mt-6 py-3 text-indigo-600 font-bold text-sm bg-indigo-50 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                View Full Gap Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Industry Roadmap Preview */}
        <div className="premium-card p-10 overflow-hidden relative">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-xl space-y-4">
              <h3 className="text-2xl font-black text-slate-900">Bridging the Industry Gap</h3>
              <p className="text-slate-500 font-medium">We've computed a personalized 3-month roadmap based on your current readiness matches.</p>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="avatar" />
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-400">Join 800+ students in this track</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-slate-50 px-8 py-6 rounded-3xl border border-slate-100 text-center">
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">Current Velocity</p>
                <p className="text-3xl font-black text-indigo-600">High</p>
              </div>
              <button
                onClick={() => setActiveTab('learning')}
                className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center group"
              >
                View Detailed Roadmap <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50/50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        </div>
      </div>
    );
  };



  const MockTestView = () => {
    if (testActive) {
      const q = testQuestions[currentQuestion];
      if (!q) return null;

      return (
        <div className="max-w-4xl mx-auto py-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-xl font-bold flex items-center text-indigo-600">
                <BookOpen size={24} className="mr-2" />
                {testTrack.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Assessment
              </h2>
              <p className="text-sm text-gray-500 mt-1">Difficulty Level: {q.difficulty}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">Q {currentQuestion + 1} of {testQuestions.length}</span>
              <div className="w-48 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / testQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-3xl shadow-xl border border-indigo-50 min-h-[400px] relative">
            <div className="absolute top-8 right-8 px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full uppercase tracking-widest">
              {q.category}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-10 leading-relaxed max-w-3xl">
              {q.question}
            </h3>

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
                    className={`w-full py-5 rounded-2xl font-black text-white shadow-xl shadow-${track.color}-100 transition-all hover:scale-[1.03] active:scale-[0.97] bg-${track.id === 'software_engineering' ? 'indigo' : track.id === 'data_science' ? 'emerald' : 'amber'}-600`}
                  >
                    Lauch Assessment
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

  const GapAnalysisView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Competency Analysis</h1>
        <p className="text-gray-500 font-medium">Deep dive into your professional skill matrix vs. industry standards.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center text-gray-900">
              <CheckCircle2 size={24} className="mr-3 text-emerald-500" />
              Mastered Assets
            </h3>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest">
              {gapReport?.current_skills?.length || 0} Skills
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {gapReport?.current_skills?.map((skill) => (
              <div key={skill} className="px-5 py-3 bg-slate-50 border border-slate-100 text-slate-700 rounded-2xl text-sm font-bold flex items-center hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 transition-colors cursor-default">
                <ShieldCheck size={14} className="mr-2" />
                {skill}
              </div>
            ))}
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center text-gray-900">
              <AlertCircle size={24} className="mr-3 text-rose-500" />
              Growth Opportunities
            </h3>
            <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-black uppercase tracking-widest">
              {gapReport?.missing_skills?.length || 0} Deficits
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {gapReport?.missing_skills?.length > 0 ? (
              gapReport.missing_skills.map((skill) => (
                <div key={skill} className="px-5 py-3 bg-rose-50/50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-bold flex items-center hover:bg-rose-100 transition-colors cursor-default">
                  <Zap size={14} className="mr-2" />
                  {skill}
                </div>
              ))
            ) : (
              <div className="w-full py-8 text-center bg-emerald-50 rounded-3xl border border-emerald-100">
                <Trophy size={40} className="mx-auto text-emerald-500 mb-3" />
                <p className="text-emerald-900 font-bold">Industry Standard Met!</p>
                <p className="text-emerald-600 text-xs mt-1">You possess all required competencies.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Alignment Distribution */}
      <div className="premium-card p-10">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="h-64 w-64 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Mastered', value: gapReport?.current_skills?.length || 0 },
                    { name: 'Missing', value: gapReport?.missing_skills?.length || 0 }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-black text-slate-900">Skill Composition Analysis</h3>
            <p className="text-slate-500 font-medium">Your profile is currently <span className="text-emerald-600 font-bold">{Math.round(((gapReport?.current_skills?.length || 0) / ((gapReport?.current_skills?.length || 0) + (gapReport?.missing_skills?.length || 0))) * 100)}%</span> complete based on job market requirements for {gapReport?.best_role_match}.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Current Assets</p>
                <p className="text-2xl font-black text-emerald-900">{gapReport?.current_skills?.length || 0}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-rose-600 mb-1">Deficit Area</p>
                <p className="text-2xl font-black text-rose-900">{gapReport?.missing_skills?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-indigo-950 p-10 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <p className="text-indigo-300 font-black uppercase tracking-widest text-xs">Primary Market Goal</p>
              <h3 className="text-4xl font-black leading-tight">
                Targeting: <span className="text-indigo-400">{gapReport?.best_role_match}</span>
              </h3>
              <div className="flex items-center space-x-6">
                <div className="flex flex-col">
                  <span className="text-3xl font-black">{Math.round(gapReport?.jaccard_score * 100)}%</span>
                  <span className="text-indigo-300 text-xs font-bold uppercase">Affinity Match</span>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black">High</span>
                  <span className="text-indigo-300 text-xs font-bold uppercase">Market Demand</span>
                </div>
              </div>
            </div>
            <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center p-4 border border-white/10 shadow-inner">
              <Briefcase size={80} className="text-indigo-400 opacity-60" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <Award size={22} className="mr-2 text-amber-500" />
            Certifications
          </h3>
          <div className="space-y-4">
            {gapReport?.recommended_certifications?.map((cert, i) => (
              <div key={i} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer">
                <p className="font-bold text-gray-900 text-sm group-hover:text-indigo-900">{cert}</p>
                <div className="flex items-center mt-2 text-[10px] font-black uppercase tracking-tighter text-indigo-400">
                  Verify Credentials <ChevronRight size={10} className="ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const LearningPathView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="space-y-1">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Milestone Roadmap</h1>
        <p className="text-gray-500 font-medium">Step-by-step career acceleration plan tailored to your profile.</p>
      </header>

      <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
        <h3 className="text-xl font-black text-gray-900 mb-10 flex items-center">
          <Map size={24} className="mr-3 text-indigo-600" />
          Path to {gapReport?.best_role_match || 'Target Role'} Expertise
        </h3>

        <div className="relative space-y-12">
          {/* Timeline Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-500 via-indigo-200 to-indigo-50 rounded-full"></div>

          {gapReport?.missing_skills?.length > 0 ? (
            gapReport.missing_skills.map((skill, i) => (
              <div key={i} className="relative flex items-start group">
                <div className={`z-10 w-14 h-14 rounded-[1.25rem] bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                  {i + 1}
                </div>
                <div className="ml-8 pt-1 flex-1">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:border-indigo-100 transition-all duration-300">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{skill} Mastery</h4>
                    <p className="text-gray-500 text-sm mb-4">Complete the technical deep-dive and project-based assessments for {skill}.</p>
                    <div className="flex items-center space-x-4">
                      <button className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                        Start Module <ArrowRight size={14} className="ml-2" />
                      </button>
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Est. 12 Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-emerald-50 rounded-[3rem] border-2 border-dashed border-emerald-100">
              <Trophy size={64} className="mx-auto text-emerald-500 mb-4" />
              <h3 className="text-2xl font-black text-emerald-900">Roadmap Complete!</h3>
              <p className="text-emerald-600 font-medium">You are fully prepared for the {gapReport?.best_role_match} track.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
        <p className="text-gray-500">View and manage your information.</p>
      </header>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center space-x-6 mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
            <User size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{selectedStudent}</h2>
            <p className="text-gray-500">Computer Science Student</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Readiness Score</p>
            <p className="text-2xl font-bold text-indigo-600">{Math.round(readinessScore)}%</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Target Role</p>
            <p className="text-2xl font-bold text-gray-900">{gapReport?.best_role_match || 'Analyzing...'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Tests Completed</p>
            <p className="text-2xl font-bold text-gray-900">{history.length}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-1">Skills Acquired</p>
            <p className="text-2xl font-bold text-gray-900">{gapReport?.current_skills?.length || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar - Fixed for better UX */}
      <aside className="w-80 bg-slate-900 flex flex-col p-8 fixed h-full z-20 shadow-2xl">
        <div className="flex items-center space-x-4 mb-16 px-2">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Target className="text-white" size={28} />
          </div>
          <div>
            <span className="text-2xl font-black text-white tracking-tight block">Placify <span className="text-indigo-500">AI</span></span>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Alignment</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeTab === 'dashboard'}
            onClick={() => { setActiveTab('dashboard'); setTestActive(false); }}
          />
          <SidebarItem
            icon={FileText}
            label="Mock Assessments"
            active={activeTab === 'tests' || testActive}
            onClick={() => setActiveTab('tests')}
          />
          <SidebarItem
            icon={TrendingUp}
            label="Gap Visualizer"
            active={activeTab === 'gap'}
            onClick={() => setActiveTab('gap')}
          />
          <SidebarItem
            icon={BookOpen}
            label="Milestone Path"
            active={activeTab === 'learning'}
            onClick={() => setActiveTab('learning')}
          />
          <div className="pt-4 pb-2">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-4">Account</p>
          </div>
          <SidebarItem
            icon={User}
            label="Student Profile"
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
              SJ
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{selectedStudent}</p>
              <p className="text-[10px] text-slate-500">Premium Plan</p>
            </div>
            <LogOut size={14} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content with padding for fixed sidebar */}
      <main className="flex-1 ml-80 p-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'tests' && <MockTestView />}
          {activeTab === 'gap' && <GapAnalysisView />}
          {activeTab === 'learning' && <LearningPathView />}
          {activeTab === 'profile' && <ProfileView />}
        </div>
      </main>
    </div>
  );
};

export default App;
