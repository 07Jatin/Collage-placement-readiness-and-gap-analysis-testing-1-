import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  Target,
  BookOpen,
  User,
  LogOut,
  Users,
  Code,
  FileUp,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  ClipboardList
} from 'lucide-react';

// Import Mock Data
import { MOCK_QUESTIONS } from './data/questions';

// Import Components
import { SidebarItem } from './components/Common';
import LoginView from './components/LoginView';
import DashboardView from './components/DashboardView';
import MockTestView from './components/MockTestView';
import GapAnalysisView from './components/GapAnalysisView';
import LearningPathView from './components/LearningPathView';
import AdminDashboardView from './components/AdminDashboardView';
import ProfileView from './components/ProfileView';
import CodeEditorView from './components/CodeEditorView';
import ResumeUploadView from './components/ResumeUploadView';
import ManageStudentsView from './components/ManageStudentsView';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [testActive, setTestActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('S001');
  const [testTrack, setTestTrack] = useState('software_engineering');
  const [testQuestions, setTestQuestions] = useState([]);
  const [userRole, setUserRole] = useState('student'); // 'student' or 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [dashboardTrack, setDashboardTrack] = useState('Software Engineer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Backend data states
  const [gapReport, setGapReport] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [skillGaps, setSkillGaps] = useState(null);
  const [students, setStudents] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);

  // Mock history data
  const [history, setHistory] = useState([
    { date: '2024-05-10', score: 65, readiness: 62, track: 'Software Engineer' },
    { date: '2024-05-15', score: 72, readiness: 68, track: 'Software Engineer' },
    { date: '2024-05-20', score: 78, readiness: 75, track: 'Data Scientist' }
  ]);

  // Fetch backend data
  useEffect(() => {
    const fetchGapReport = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/gap_report/${selectedStudent}?role=${encodeURIComponent(dashboardTrack)}`);
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

    const fetchAtRiskStudents = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/admin/at_risk_students');
        const data = await res.json();
        setAtRiskStudents(data.at_risk_students || []);
      } catch (err) {
        console.error('Error fetching at-risk students:', err);
      }
    };

    fetchGapReport();
    fetchReadiness();
    fetchSkillGaps();
    fetchAtRiskStudents();
  }, [selectedStudent, dashboardTrack]);

  // Fetch student list
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/students');
        const data = await res.json();
        setStudents(data);
        if (data.length > 0 && selectedStudent === 'S001') {
            setSelectedStudent(data[0].id);
        }
      } catch (err) {
        console.error('Error fetching students list:', err);
      }
    };
    fetchStudents();
  }, []);

  // Calculated Metrics
  const readinessScore = useMemo(() => {
    if (readiness && readiness.readiness_score_percent !== undefined) {
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

  // Dummy benchmark data
  const benchmarkData = [
    { name: 'Core CS', user: 82, market: 75 },
    { name: 'System Design', user: 65, market: 70 },
    { name: 'Frontend', user: 90, market: 68 },
    { name: 'Backend', user: 72, market: 78 },
    { name: 'DevOps', user: 45, market: 60 }
  ];

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

    const trackName = testTrack === 'data_science' ? 'Data Scientist' : 'Software Engineer';
    setDashboardTrack(trackName);

    // Add to history
    setHistory(prev => [...prev, {
      date: new Date().toISOString().split('T')[0],
      score: result.score,
      readiness: Math.min(100, readinessScore + 5),
      track: trackName
    }]);
  };

  // Login page bypassed - going straight to dashboard

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-300 ${darkMode ? 'dark bg-[#0f1117]' : 'bg-[#f8f9fc]'} selection:bg-indigo-100 selection:text-indigo-900`}>
      {/* Sidebar */}
      <aside
        className={`bg-slate-900 flex flex-col fixed h-full z-20 shadow-2xl transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-80 p-8' : 'w-20 p-4'
          }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-8 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 hover:scale-110 active:scale-95 transition-all z-30"
        >
          {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 active:scale-95 transition-all z-30 ${darkMode ? 'bg-amber-500 shadow-amber-500/30' : 'bg-slate-700 shadow-slate-700/30'
            }`}
        >
          {darkMode ? <Sun size={12} /> : <Moon size={12} />}
        </button>

        {/* Logo */}
        <div className={`flex items-center mb-16 transition-all duration-300 ${sidebarOpen ? 'space-x-4 px-2' : 'justify-center px-0'
          }`}>
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-500/20 shrink-0">
            <Target className="text-white" size={sidebarOpen ? 28 : 22} />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden whitespace-nowrap">
              <span className="text-2xl font-black text-white tracking-tight block">Placify <span className="text-indigo-500">AI</span></span>
              <span className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Next-Gen Alignment</span>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-3">
          {userRole === 'student' ? (
            <>
              <SidebarItem
                icon={LayoutDashboard}
                label="Dashboard"
                active={activeTab === 'dashboard'}
                onClick={() => { setActiveTab('dashboard'); setTestActive(false); }}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={FileText}
                label="Mock Assessments"
                active={activeTab === 'tests' || testActive}
                onClick={() => setActiveTab('tests')}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={TrendingUp}
                label="Gap Visualizer"
                active={activeTab === 'gap'}
                onClick={() => setActiveTab('gap')}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={BookOpen}
                label="Milestone Path"
                active={activeTab === 'learning'}
                onClick={() => setActiveTab('learning')}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={Code}
                label="DSA Coding Lab"
                active={activeTab === 'dsa'}
                onClick={() => setActiveTab('dsa')}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={FileUp}
                label="Resume Analyzer"
                active={activeTab === 'resume'}
                onClick={() => setActiveTab('resume')}
                collapsed={!sidebarOpen}
              />
            </>
          ) : (
            <>
              <SidebarItem
                icon={Users}
                label="Admin Dashboard"
                active={activeTab === 'admin'}
                onClick={() => setActiveTab('admin')}
                collapsed={!sidebarOpen}
              />
              <SidebarItem
                icon={ClipboardList}
                label="Manage Students"
                active={activeTab === 'manage_students'}
                onClick={() => setActiveTab('manage_students')}
                collapsed={!sidebarOpen}
              />
            </>
          )}

          {sidebarOpen && (
            <div className="pt-4 pb-2">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-4">Account</p>
            </div>
          )}
          {!sidebarOpen && <div className="pt-4 border-t border-white/5"></div>}
          <SidebarItem
            icon={User}
            label={userRole === 'admin' ? 'Admin Profile' : 'Student Profile'}
            active={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
            collapsed={!sidebarOpen}
          />
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
          <div className={`bg-white/5 rounded-2xl border border-white/5 flex items-center transition-all duration-300 ${sidebarOpen ? 'p-4 space-x-3' : 'p-3 justify-center'
            }`}>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold shrink-0">
              SJ
            </div>
            {sidebarOpen && (
              <>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{selectedStudent}</p>
                  <p className="text-[10px] text-slate-500">{userRole === 'admin' ? 'Institutional Admin' : 'Premium Plan'}</p>
                </div>
                <LogOut
                  size={14}
                  className="text-slate-500 cursor-pointer hover:text-white transition-colors shrink-0"
                  onClick={() => {
                    setIsAuthenticated(false);
                    setUserRole(null);
                  }}
                />
              </>
            )}
            {!sidebarOpen && (
              <LogOut
                size={14}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-500 cursor-pointer hover:text-white transition-colors"
                onClick={() => {
                  setIsAuthenticated(false);
                  setUserRole(null);
                }}
              />
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-80' : 'ml-20'} ${activeTab === 'dsa' ? 'p-2' : 'p-12'}`}>
        <div className={activeTab === 'dsa' ? '' : 'max-w-7xl mx-auto'}>
          {activeTab === 'dashboard' && (
            <DashboardView
              dashboardTrack={dashboardTrack}
              setDashboardTrack={setDashboardTrack}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              students={students}
              readinessScore={readinessScore}
              readiness={readiness}
              gapReport={gapReport}
              history={history}
              benchmarkData={benchmarkData}
              radarData={radarData}
              setActiveTab={setActiveTab}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'tests' && (
            <MockTestView />
          )}

          {activeTab === 'gap' && <GapAnalysisView gapReport={gapReport} />}

          {activeTab === 'learning' && <LearningPathView gapReport={gapReport} />}

          {activeTab === 'dsa' && <CodeEditorView />}

          {activeTab === 'resume' && <ResumeUploadView onProfileUpdate={(skills) => {
            console.log('Verified skills updated:', skills);
            // Skills feed into gap analysis + readiness calculation
          }} />}

          {activeTab === 'profile' && (
            <ProfileView
              selectedStudent={selectedStudent}
              students={students}
              readinessScore={readinessScore}
              gapReport={gapReport}
              history={history}
            />
          )}

          {activeTab === 'admin' && <AdminDashboardView atRiskStudents={atRiskStudents} darkMode={darkMode} setActiveTab={setActiveTab} />}

          {activeTab === 'manage_students' && <ManageStudentsView darkMode={darkMode} students={students} />}
        </div>
      </main>
    </div>
  );
};

export default App;
