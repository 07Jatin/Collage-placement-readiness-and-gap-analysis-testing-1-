import React, { useState } from 'react';
import { generatePlacementTest } from '../utils/resumeTestGenerator';

import StartTestStep from './MockTest/StartTestStep';
import TestOverview from './MockTest/TestOverview';
import SectionTest from './MockTest/SectionTest';
import ResultsScreen from './MockTest/ResultsScreen';

// --- Main Component ---
const MockTestView = ({ selectedStudent, onTestSubmitted, setActiveTab, testHistory = [] }) => {
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

  const handleSubmitEarly = () => {
    // Go back to overview and then submit
    setPhase('overview');
    setActiveSection(null);
    // The overview will show the submit button
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

  if (phase === 'upload') return <StartTestStep onGenerate={handleGenerate} />;

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
        onSubmitEarly={handleSubmitEarly}
      />
    );
  }

  if (phase === 'results' && testData) {
    return (
      <ResultsScreen
        testData={testData}
        sectionProgress={sectionProgress}
        onReset={handleReset}
        selectedStudent={selectedStudent}
        onTestSubmitted={onTestSubmitted}
        setActiveTab={setActiveTab}
        testHistory={testHistory}
      />
    );
  }

  return null;
};

export default MockTestView;
