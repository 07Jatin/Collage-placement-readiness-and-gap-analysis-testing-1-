import React, { useState } from 'react';

// Import Components
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
import AppSidebar from './components/AppSidebar';
import AppTopbar from './components/AppTopbar';
import { usePlacifyShellData } from './hooks/usePlacifyShellData';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedStudent, setSelectedStudent] = useState('S001');
  const [userRole, setUserRole] = useState('student'); // 'student' or 'admin'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboardTrack, setDashboardTrack] = useState('Software Engineer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const {
    atRiskStudents,
    benchmarkData,
    gapReport,
    history,
    radarData,
    readiness,
    readinessScore,
    refreshGapReport,
    students,
  } = usePlacifyShellData({
    dashboardTrack,
    isAuthenticated,
    selectedStudent,
    setSelectedStudent,
    userRole,
  });

  const handleRoleSwitch = () => {
    const newRole = userRole === 'student' ? 'admin' : 'student';
    setUserRole(newRole);
    setActiveTab(newRole === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('placify_token');
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveTab('dashboard');
    setSelectedStudent('S001'); // Reset to default
  };


  return (
    <div className={`placify-shell min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark' : ''} selection:bg-indigo-100 selection:text-indigo-900`}>
      {!isAuthenticated ? (
        <LoginView 
          setUserRole={setUserRole} 
          setIsAuthenticated={setIsAuthenticated} 
          setActiveTab={setActiveTab} 
          setSelectedStudent={setSelectedStudent} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
        />
      ) : (
        <>
          <AppSidebar
            activeTab={activeTab}
            dashboardTrack={dashboardTrack}
            darkMode={darkMode}
            onLogout={handleLogout}
            onRoleSwitch={handleRoleSwitch}
            setActiveTab={setActiveTab}
            setDarkMode={setDarkMode}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            testActive={activeTab === 'tests'}
            userRole={userRole}
          />


      {/* Main Content */}
      <main className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-72' : 'ml-20'} ${activeTab === 'dsa' ? 'p-3' : 'p-6 md:p-8'}`}>
        <AppTopbar
          dashboardTrack={dashboardTrack}
          selectedStudent={selectedStudent}
          userRole={userRole}
          onRefresh={() => {
            if (userRole === 'admin') {
              setActiveTab('admin');
            } else {
              refreshGapReport();
            }
          }}
        />

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
            <MockTestView 
                selectedStudent={selectedStudent} 
                onTestSubmitted={(result) => refreshGapReport(result)}
                setActiveTab={setActiveTab}
                testHistory={history}
            />
          )}

          {activeTab === 'gap' && <GapAnalysisView gapReport={gapReport} onRefresh={() => refreshGapReport()} selectedStudent={selectedStudent} dashboardTrack={dashboardTrack} />}

          {activeTab === 'learning' && <LearningPathView gapReport={gapReport} />}

          {activeTab === 'dsa' && <CodeEditorView gapReport={gapReport} />}

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
              dashboardTrack={dashboardTrack}
            />
          )}

          {activeTab === 'admin' && (
            <AdminDashboardView 
              atRiskStudents={atRiskStudents} 
              darkMode={darkMode} 
              setActiveTab={setActiveTab}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
              students={students}
            />
          )}

          {activeTab === 'manage_students' && <ManageStudentsView darkMode={darkMode} students={students} />}
        </div>
      </main>
    </>
  )}
</div>
  );
};

export default App;
