import React, { useState } from 'react';
import {
  calculateVerifiedLevel,
  SKILL_QUIZZES,
  SAMPLE_RESUME
} from '../data/skillData';
import {
  extractTextFromPDF,
  extractTextFromDOCX,
  extractTextFromHTML
} from '../utils/resumeDocumentExtraction';
import {
  applyQuizOutcome,
  buildLocalSkillResults,
  createQuizQuestions,
  enrichBackendSkills
} from '../utils/resumeSkillFlow';

const ResumeUploadView = ({ onProfileUpdate }) => {
  const [step, setStep] = useState('upload'); // upload | results | quiz | complete
  const [resumeText, setResumeText] = useState('');
  const [extractedSkills, setExtractedSkills] = useState({});
  const [activeQuizSkill, setActiveQuizSkill] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [useLLM, setUseLLM] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = async () => {
    setIsExtracting(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/parse_resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: resumeText, use_llm: useLLM })
      });
      
      const data = await response.json();
      setExtractedSkills(enrichBackendSkills(data));
      setStep('results');
    } catch (err) {
      console.error('Extraction error:', err);
      setExtractedSkills(buildLocalSkillResults(resumeText));
      setStep('results');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleStartQuiz = (skillId) => {
    setActiveQuizSkill(skillId);
    setQuizQuestions(createQuizQuestions(skillId));
    setStep('quiz');
  };

  const handleFinishQuiz = (skillId, score, total) => {
    setExtractedSkills((prev) => applyQuizOutcome(prev, skillId, score, total));
    setStep('results');
  };

  const handleComplete = () => {
    setStep('complete');
  };

  const handleReset = () => {
    setStep('upload');
    setResumeText('');
    setExtractedSkills({});
    setActiveQuizSkill(null);
    setQuizQuestions([]);
  };

  const handleUpdateProfile = (verifiedSkillIds) => {
    if (onProfileUpdate) {
      onProfileUpdate(verifiedSkillIds);
    }
    alert(`Profile updated with ${verifiedSkillIds.length} verified skills!`);
  };

  return (
    <div className="pb-12">
      {step === 'upload' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Upload Resume</h2>
          <p className="text-gray-600">Upload your resume file or paste text to extract skills.</p>
          
          <div className="flex space-x-4">
            <button 
              onClick={() => setUseLLM(false)}
              className={`px-4 py-2 rounded ${!useLLM ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Standard Extraction
            </button>
            <button 
              onClick={() => setUseLLM(true)}
              className={`px-4 py-2 rounded ${useLLM ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              AI Analysis
            </button>
          </div>
          
          <div className="space-y-4">
            <input
              type="file"
              accept=".txt,.pdf,.doc,.docx,.html,.htm"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const ext = file.name.split('.').pop().toLowerCase();
                const reader = new FileReader();
                
                reader.onload = async () => {
                  let text = '';
                  if (ext === 'pdf') {
                    text = await extractTextFromPDF(await file.arrayBuffer());
                  } else if (ext === 'doc' || ext === 'docx') {
                    text = await extractTextFromDOCX(await file.arrayBuffer());
                  } else if (ext === 'html' || ext === 'htm') {
                    text = extractTextFromHTML(reader.result);
                  } else {
                    text = reader.result;
                  }
                  setResumeText(text);
                };
                
                if (ext === 'pdf' || ext === 'doc' || ext === 'docx') {
                  reader.readAsArrayBuffer(file);
                } else {
                  reader.readAsText(file);
                }
              }}
              className="w-full p-2 border rounded"
            />
            
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Or paste resume text here..."
              className="w-full p-2 border rounded h-48"
            />
          </div>
          
          <button
            onClick={handleExtract}
            disabled={!resumeText || !resumeText.trim() || isExtracting}
            className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
          >
            {isExtracting ? 'Extracting...' : 'Extract Skills'}
          </button>
        </div>
      )}
      
      {step === 'results' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Extracted Skills</h2>
          <p className="text-gray-600">
            Found {Object.keys(extractedSkills).length} skills. Verify each with a quick quiz.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(extractedSkills).map(([skillId, skillInfo]) => (
              <div key={skillId} className="p-4 border rounded">
                <h3 className="font-bold">{skillId.replace(/-/g, ' ')}</p>
                <p className="text-sm text-gray-500">Confidence: {skillInfo.confidence}%</p>
                
                {skillInfo.status !== 'verified' ? (
                  <button
                    onClick={() => handleStartQuiz(skillId)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded mt-2"
                  >
                    Take Quiz
                  </button>
                ) : (
                  <div className="mt-2">
                    <span className="text-green-600">Verified</span>
                    <span className="ml-2 text-sm">({skillInfo.quizScore} correct)</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Re-upload
            </button>
            <button
              onClick={handleComplete}
              disabled={Object.values(extractedSkills).every(s => s.status !== 'verified')}
              className="ml-4 bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
            >
              View Verified Profile
            </button>
          </div>
        </div>
      )}
      
      {step === 'quiz' && activeQuizSkill && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quiz: {activeQuizSkill.replace(/-/g, ' ')}</h2>
          <p className="text-gray-600">Answer the following questions to verify your skill.</p>
          
          {quizQuestions.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="font-bold">Question {quizQuestions.length > 0 ? 1 : 0} of {quizQuestions.length}</p>
                <p className="text-lg">{quizQuestions[0]?.question || 'Loading...'}</p>
              </div>
              
              {quizQuestions[0]?.options.map((option, index) => (
                <label key={index} className="block mb-2">
                  <input
                    type="radio"
                    name="answer"
                    value={index}
                    onChange={(e) => {
                      // Simple quiz logic - in reality we'd track answers per question
                      // For simplicity, we'll just submit on first answer
                      handleFinishQuiz(activeQuizSkill, index === quizQuestions[0].correct ? 1 : 0, quizQuestions.length);
                    }}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </>
          ) : (
            <p>No quiz available for this skill.</p>
            <button
              onClick={() => handleFinishQuiz(activeQuizSkill, 0, 0)}
              className="bg-indigo-600 text-white px-4 py-2 rounded mt-2"
            >
              Skip Quiz
            </button>
          )}
          
          <button
            onClick={() => setStep('results')}
            className="mt-4 px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Back to Skills
          </button>
        </div>
      )}
      
      {step === 'complete' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Verified Skills</h2>
          <p className="text-gray-600">
            Your skills have been verified through quizzes.
          </p>
          
          <div className="space-y-4">
            {Object.entries(extractedSkills)
              .filter(([, skill]) => skill.status === 'verified')
              .map(([skillId, skillInfo]) => (
                <div key={skillId} className="p-4 border rounded">
                  <h3 className="font-bold">{skillId.replace(/-/g, ' ')}</p>
                  <p className="text-sm text-gray-500">
                    Level: {skillInfo.verifiedLevel?.label || 'Unknown'} 
                    ({skillInfo.quizScore} correct)
                  </p>
                </div>
              ))}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Upload Another
            </button>
            <button
              onClick={handleUpdateProfile}
              className="ml-4 bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700"
            >
              Update Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadView;