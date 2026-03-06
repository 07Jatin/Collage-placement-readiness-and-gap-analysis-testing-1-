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
  Code
} from 'lucide-react';

// Import Mock Data
import { MOCK_QUESTIONS } from './questions';

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

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [testActive, setTestActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('S001');
  const [testTrack, setTestTrack] = useState('software_engineering');
  const [testQuestions, setTestQuestions] = useState([]);
  const [userRole, setUserRole] = useState(null); // 'student' or 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardTrack, setDashboardTrack] = useState('Software Engineer');

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

  if (!isAuthenticated) {
    return (
      <LoginView
        setUserRole={setUserRole}
        setIsAuthenticated={setIsAuthenticated}
        setActiveTab={setActiveTab}
        setSelectedStudent={setSelectedStudent}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
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
          {userRole === 'student' ? (
            <>
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
              <SidebarItem
                icon={Code}
                label="DSA Coding Lab"
                active={activeTab === 'dsa'}
                onClick={() => setActiveTab('dsa')}
              />
            </>
          ) : (
            <SidebarItem
              icon={Users}
              label="Admin Dashboard"
              active={activeTab === 'admin'}
              onClick={() => setActiveTab('admin')}
            />
          )}

          <div className="pt-4 pb-2">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest px-4">Account</p>
          </div>
          <SidebarItem
            icon={User}
            label={userRole === 'admin' ? 'Admin Profile' : 'Student Profile'}
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
              <p className="text-[10px] text-slate-500">{userRole === 'admin' ? 'Institutional Admin' : 'Premium Plan'}</p>
            </div>
            <LogOut
              size={14}
              className="text-slate-500 cursor-pointer hover:text-white transition-colors"
              onClick={() => {
                setIsAuthenticated(false);
                setUserRole(null);
              }}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-12 min-h-screen">
        <div className="max-w-7xl mx-auto">
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
            />
          )}

          {activeTab === 'tests' && (
            <MockTestView
              testActive={testActive}
              currentQuestion={currentQuestion}
              setCurrentQuestion={setCurrentQuestion}
              testQuestions={testQuestions}
              userAnswers={userAnswers}
              handleAnswer={handleAnswer}
              finishTest={finishTest}
              startTest={startTest}
            />
          )}

          {activeTab === 'gap' && <GapAnalysisView gapReport={gapReport} />}

          {activeTab === 'learning' && <LearningPathView gapReport={gapReport} />}

          {activeTab === 'dsa' && <CodeEditorView />}

          {activeTab === 'profile' && (
            <ProfileView
              selectedStudent={selectedStudent}
              readinessScore={readinessScore}
              gapReport={gapReport}
              history={history}
            />
          )}

          {activeTab === 'admin' && <AdminDashboardView atRiskStudents={atRiskStudents} />}
        </div>
      </main>
    </div>
  );
};

export default App;
