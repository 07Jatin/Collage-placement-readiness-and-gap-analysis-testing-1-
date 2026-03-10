import React, { useState } from 'react';
import {
    Upload, FileText, CheckCircle2, XCircle, ChevronRight,
    Zap, Shield, Award, ArrowRight, ArrowLeft, RotateCcw,
    Sparkles, Target, AlertCircle, ClipboardPaste, FileUp, Send
} from 'lucide-react';
import {
    extractSkillsFromText,
    SKILL_QUIZZES,
    SKILL_KEYWORDS,
    calculateVerifiedLevel,
    buildExtendedQuiz,
    SAMPLE_RESUME
} from '../data/skillData';
import {
    extractTextFromPDF,
    extractTextFromDOCX,
    extractTextFromHTML
} from '../utils/resumeDocumentExtraction';

// ━━━━━━━━━━━━━━━━━━━━━━━━━ STEP 1: Upload ━━━━━━━━━━━━━━━━━━━━━━━━━

const UploadStep = ({ resumeText, setResumeText, onExtract, useLLM, setUseLLM, isExtracting }) => {
    const [dragOver, setDragOver] = useState(false);
    const [fileName, setFileName] = useState('');
    const [parseStatus, setParseStatus] = useState(''); // '', 'parsing', 'done', 'error'

    const handleFileRead = async (file) => {
        setFileName(file.name);
        const ext = file.name.split('.').pop().toLowerCase();

        setParseStatus('parsing');

        if (ext === 'pdf') {
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
        } else if (ext === 'doc' || ext === 'docx') {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const text = await extractTextFromDOCX(arrayBuffer);
                if (text.trim()) {
                    setResumeText(text);
                    setParseStatus('done');
                } else {
                    setParseStatus('error');
                    setResumeText('');
                }
            } catch (err) {
                console.error('Error reading DOC:', err);
                setParseStatus('error');
            }
        } else if (ext === 'html' || ext === 'htm') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = extractTextFromHTML(e.target.result);
                if (text.trim()) {
                    setResumeText(text);
                    setParseStatus('done');
                } else {
                    setParseStatus('error');
                    setResumeText('');
                }
            };
            reader.readAsText(file);
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                setResumeText(e.target.result);
                setParseStatus('done');
            };
            reader.readAsText(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileRead(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) handleFileRead(file);
    };

    const loadSample = () => {
        setParseStatus('');
        setResumeText(SAMPLE_RESUME);
        setFileName('sample_resume.txt');
    };

    return (
        <div className="space-y-8 animate-in">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
                    <div className="relative inline-flex p-5 rounded-[2rem] bg-white border border-slate-100 shadow-xl text-indigo-600">
                        <Upload size={40} />
                    </div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Upload Your Resume</h2>
                <p className="text-slate-500 font-medium text-lg max-w-xl mx-auto">
                    We'll extract your skills using a <span className="text-indigo-600 font-bold">Hybrid Engine</span> (Regex + LLM).
                    Then validate each skill with a quick quiz.
                </p>
            </div>

            {/* AI Toggle */}
            <div className="flex justify-center">
                <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100 inline-flex items-center space-x-2">
                    <button 
                        onClick={() => setUseLLM(false)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!useLLM ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Standard Extraction
                    </button>
                    <button 
                        onClick={() => {
                            setUseLLM(true);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center ${useLLM ? 'bg-indigo-600 shadow-lg shadow-indigo-100 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Sparkles size={14} className="mr-2" /> Deep AI Analysis (Mistral-7B)
                    </button>
                </div>
            </div>

            {/* Upload Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Drag & Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`relative rounded-[2.5rem] border-2 border-dashed p-12 text-center transition-all duration-300 cursor-pointer ${dragOver
                            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                            : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                        }`}
                >
                    <input
                        type="file"
                        accept=".txt,.pdf,.doc,.docx,.html,.htm"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-4">
                        <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-colors ${dragOver ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>
                            <FileUp size={32} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 text-lg">
                                {fileName ? fileName : 'Drop your resume here'}
                            </p>
                            <p className="text-sm text-slate-400 mt-1">Supports .txt, .pdf, .doc, .docx, .html</p>
                        </div>
                        {parseStatus === 'parsing' && (
                            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold">
                                <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mr-2"></div> Extracting text from document...
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

                {/* Text Paste Area */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center">
                            <ClipboardPaste size={14} className="mr-2" /> Or paste content
                        </label>
                        <button
                            onClick={loadSample}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center"
                        >
                            <Sparkles size={12} className="mr-1" /> Load Sample Resume
                        </button>
                    </div>
                    <textarea
                        value={resumeText}
                        onChange={(e) => setResumeText(e.target.value)}
                        placeholder="Paste your resume text here..."
                        className="w-full h-[280px] p-6 rounded-2xl bg-white border border-slate-100 text-slate-700 font-medium text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all custom-scrollbar"
                    />
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-6">How It Works</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { step: "1", title: "Upload", desc: "Paste or upload your resume text" },
                            { step: "2", title: "Extract", desc: "Keyword regex matching against 170+ patterns" },
                            { step: "3", title: "Verify", desc: "Quick 3-question quiz per skill" },
                            { step: "4", title: "Score", desc: "Verified skills → Readiness engine" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">
                                    {item.step}
                                </div>
                                <div>
                                    <p className="font-bold text-white">{item.title}</p>
                                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Extract Button */}
            <div className="flex justify-center">
                <button
                    onClick={onExtract}
                    disabled={!resumeText || !resumeText.trim() || isExtracting}
                    className="bg-indigo-600 text-white px-16 py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:hover:scale-100 flex items-center"
                >
                    {isExtracting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                            Analyzing Resume...
                        </>
                    ) : (
                        <>
                            <Zap size={22} className="mr-3" /> Extract Skills
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━ STEP 2: Results ━━━━━━━━━━━━━━━━━━━━━━━━━

const ResultsStep = ({ skills, setSkills, onStartQuiz, onBack, onComplete }) => {
    const skillEntries = Object.entries(skills);
    const verified = skillEntries.filter(([, s]) => s.status === 'verified');
    const unverified = skillEntries.filter(([, s]) => s.status !== 'verified');

    return (
        <div className="space-y-8 animate-in">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
                        <FileText size={28} className="mr-3 text-indigo-600" /> Extracted Skills
                    </h2>
                    <p className="text-slate-500 font-medium">
                        Found <span className="text-indigo-600 font-bold">{skillEntries.length} skills</span> in your resume.
                        Verify them with quick quizzes.
                    </p>
                </div>
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-400 hover:text-slate-700 font-bold transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" /> Re-upload
                </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-6">
                <div className="premium-card p-6 text-center">
                    <p className="text-3xl font-black text-indigo-600">{skillEntries.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Detected</p>
                </div>
                <div className="premium-card p-6 text-center">
                    <p className="text-3xl font-black text-emerald-600">{verified.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified</p>
                </div>
                <div className="premium-card p-6 text-center">
                    <p className="text-3xl font-black text-amber-600">{unverified.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending</p>
                </div>
            </div>

            {/* Skill Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {skillEntries.map(([skillId, skillInfo]) => (
                    <div key={skillId} className={`premium-card p-6 relative overflow-hidden transition-all ${skillInfo.status === 'verified' ? 'ring-2 ring-emerald-500/30' : ''
                        }`}>
                        {skillInfo.status === 'verified' && (
                            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                                ✓ {skillInfo.verifiedLevel?.label}
                            </div>
                        )}

                        <div className="flex items-center space-x-3 mb-4">
                            <span className="text-2xl">{skillInfo.icon}</span>
                            <div>
                                <p className="font-bold text-slate-900 capitalize">{skillId.replace(/-/g, ' ')}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{skillInfo.category}</p>
                            </div>
                        </div>

                        {/* Confidence Bar */}
                        <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-slate-500">
                                    {skillInfo.status === 'verified' ? 'Verified Level' : 'Resume Confidence'}
                                </span>
                                <span className="font-black text-slate-700">
                                    {skillInfo.status === 'verified'
                                        ? `${skillInfo.verifiedLevel?.adjustedConfidence}%`
                                        : `${skillInfo.confidence}%`}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${skillInfo.status === 'verified'
                                            ? skillInfo.verifiedLevel?.color === 'emerald' ? 'bg-emerald-500'
                                                : skillInfo.verifiedLevel?.color === 'blue' ? 'bg-blue-500'
                                                    : skillInfo.verifiedLevel?.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                                            : 'bg-indigo-500'
                                        }`}
                                    style={{
                                        width: `${skillInfo.status === 'verified'
                                            ? skillInfo.verifiedLevel?.adjustedConfidence
                                            : skillInfo.confidence}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Matched Keywords */}
                        <div className="flex flex-wrap gap-1 mb-4">
                            {skillInfo.matchedKeywords.slice(0, 4).map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100">
                                    {kw}
                                </span>
                            ))}
                            {skillInfo.matchedKeywords.length > 4 && (
                                <span className="px-2 py-0.5 text-slate-400 text-[10px] font-bold">
                                    +{skillInfo.matchedKeywords.length - 4} more
                                </span>
                            )}
                        </div>

                        {/* Quiz Button */}
                        {skillInfo.status !== 'verified' ? (
                            <button
                                onClick={() => onStartQuiz(skillId)}
                                className="w-full py-3 rounded-xl font-bold text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-40 flex items-center justify-center"
                            >
                                <Shield size={14} className="mr-2" /> Verify with Quiz
                            </button>
                        ) : (
                            <div className="flex items-center justify-center py-3 text-emerald-600">
                                <CheckCircle2 size={16} className="mr-2" />
                                <span className="text-sm font-bold">
                                    Quiz Score: {skillInfo.quizScore}/{SKILL_QUIZZES[skillId]?.length || 3}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {skillEntries.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                    <AlertCircle size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-bold text-lg">No skills detected</p>
                    <p className="text-sm mt-1">Try uploading a different resume or use the sample.</p>
                </div>
            )}

            {/* Bottom Action */}
            {verified.length > 0 && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={onComplete}
                        className="bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center"
                    >
                        <Award size={22} className="mr-3" /> View Verified Profile ({verified.length} skills)
                        <ArrowRight size={20} className="ml-3" />
                    </button>
                </div>
            )}
        </div>
    );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━ STEP 3: Quiz ━━━━━━━━━━━━━━━━━━━━━━━━━

const QuizStep = ({ skillId, skills, questions, onFinishQuiz, onBack }) => {
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);

    const skill = skills[skillId];

    const handleAnswer = (optIdx) => {
        setAnswers(prev => ({ ...prev, [currentQ]: optIdx }));
    };

    const finishQuiz = () => {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) correct++;
        });
        setShowResult(true);
        // Short delay for the reveal animation
        setTimeout(() => {
            onFinishQuiz(skillId, correct, questions.length);
        }, 2500);
    };

    if (showResult) {
        let correct = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) correct++;
        });
        const level = calculateVerifiedLevel(correct, questions.length);

        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 animate-in py-12">
                <div className={`w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${level.color === 'emerald' ? 'bg-emerald-500 shadow-emerald-200' :
                        level.color === 'blue' ? 'bg-blue-500 shadow-blue-200' :
                            level.color === 'amber' ? 'bg-amber-500 shadow-amber-200' : 'bg-rose-500 shadow-rose-200'
                    }`}>
                    {correct === questions.length ? <Award size={48} className="text-white" /> :
                        correct > 0 ? <Shield size={48} className="text-white" /> :
                            <XCircle size={48} className="text-white" />}
                </div>
                <div className="space-y-2">
                    <p className="text-5xl font-black text-slate-900">{correct}/{questions.length}</p>
                    <p className={`text-xl font-bold ${level.color === 'emerald' ? 'text-emerald-600' :
                            level.color === 'blue' ? 'text-blue-600' :
                                level.color === 'amber' ? 'text-amber-600' : 'text-rose-600'
                        }`}>{level.label}</p>
                    <p className="text-slate-500 font-medium capitalize">{skillId.replace(/-/g, ' ')} Verification</p>
                </div>

                {/* Answer Review */}
                <div className="space-y-3 text-left">
                    {questions.map((q, idx) => (
                        <div key={idx} className={`p-4 rounded-2xl border ${answers[idx] === q.correct
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'bg-rose-50 border-rose-200'
                            }`}>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-700 flex-1 mr-4">{q.question}</span>
                                {answers[idx] === q.correct
                                    ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
                                    : <XCircle size={20} className="text-rose-500 shrink-0" />
                                }
                            </div>
                            {answers[idx] !== q.correct && (
                                <p className="text-xs text-slate-500 mt-2 pl-1">💡 {q.explanation}</p>
                            )}
                        </div>
                    ))}
                </div>

                <p className="text-slate-400 text-sm font-medium animate-pulse">
                    Returning to skills dashboard...
                </p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center space-y-8 animate-in py-12">
                <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-xl bg-rose-500 shadow-rose-200">
                    <XCircle size={48} className="text-white" />
                </div>
                <div className="space-y-4">
                    <h3 className="text-3xl font-black text-slate-900">Verification Required</h3>
                    <p className="text-slate-500 font-medium">
                        We do not currently have a quiz available for <span className="font-bold text-slate-800 capitalize">{skillId.replace(/-/g, ' ')}</span>.
                        This skill cannot be auto-verified and must be reviewed manually or added to the quiz bank.
                    </p>
                </div>
                <button
                    onClick={() => onFinishQuiz(skillId, 0, 0)}
                    className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                >
                    Return to Skills Dashboard
                </button>
            </div>
        );
    }

    const q = questions[currentQ];

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in">
            {/* Quiz Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-400 hover:text-slate-700 font-bold transition-colors"
                >
                    <ArrowLeft size={18} className="mr-2" /> Back to Skills
                </button>
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">{skill?.icon}</span>
                    <span className="font-black text-slate-900 capitalize text-lg">{skillId.replace(/-/g, ' ')}</span>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black">
                        Verification Quiz ({questions.length || 25} Questions)
                    </span>
                    <button
                        onClick={finishQuiz}
                        disabled={Object.keys(answers).length === 0}
                        className="flex items-center bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-40 shadow-lg"
                    >
                        <Send size={16} className="mr-2" /> Submit Quiz
                    </button>
                </div>
            </div>

            {/* Question Card */}
            <div className="premium-card p-10 relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                        style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <div className="pt-4 space-y-8">
                    <div className="flex justify-between items-center">
                        <span className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-black">
                            Question {currentQ + 1} of {questions.length}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-900 leading-snug">{q.question}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                className={`group text-left p-5 rounded-2xl border-2 transition-all duration-200 ${answers[currentQ] === i
                                        ? 'border-indigo-600 bg-indigo-50/80 shadow-md ring-1 ring-indigo-600/20'
                                        : 'border-slate-100 hover:border-indigo-200 hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-center">
                                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center mr-4 text-sm font-bold transition-colors ${answers[currentQ] === i
                                            ? 'bg-indigo-600 text-white shadow'
                                            : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                        }`}>
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className={`font-medium transition-colors ${answers[currentQ] === i ? 'text-indigo-900 font-semibold' : 'text-slate-600'
                                        }`}>
                                        {opt}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center px-2">
                <button
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(prev => prev - 1)}
                    className="px-6 py-3 text-slate-500 font-bold disabled:opacity-30 hover:text-indigo-600 transition-colors"
                >
                    Previous
                </button>
                {currentQ === questions.length - 1 ? (
                    <button
                        onClick={finishQuiz}
                        disabled={Object.keys(answers).length < questions.length}
                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-40"
                    >
                        Submit Answers
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentQ(prev => prev + 1)}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center hover:bg-black transition-all"
                    >
                        Next <ChevronRight size={18} className="ml-2" />
                    </button>
                )}
            </div>
        </div>
    );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━ STEP 4: Complete ━━━━━━━━━━━━━━━━━━━━━━━━━

const CompleteStep = ({ skills, onReset, onUpdateProfile }) => {
    const skillEntries = Object.entries(skills);
    const verified = skillEntries.filter(([, s]) => s.status === 'verified');
    const verifiedSkillIds = verified.map(([id]) => id);

    const expertCount = verified.filter(([, s]) => s.verifiedLevel?.level === 'expert').length;
    const proficientCount = verified.filter(([, s]) => s.verifiedLevel?.level === 'proficient').length;
    const avgConfidence = verified.length > 0
        ? Math.round(verified.reduce((sum, [, s]) => sum + (s.verifiedLevel?.adjustedConfidence || 0), 0) / verified.length)
        : 0;

    return (
        <div className="space-y-10 animate-in">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex p-5 rounded-[2rem] bg-emerald-50 text-emerald-600 shadow-xl shadow-emerald-100">
                    <Award size={40} />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verified Skill Profile</h2>
                <p className="text-slate-500 font-medium text-lg">
                    Your skills have been validated through assessments. This feeds into the readiness engine.
                </p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="premium-card p-6 text-center">
                    <p className="text-3xl font-black text-emerald-600">{verified.length}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Skills</p>
                </div>
                <div className="premium-card p-6 text-center">
                    <p className="text-3xl font-black text-indigo-600">{avgConfidence}%</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Avg. Confidence</p>
                </div>
                <div className="premium-card p-6 text-center">
                    <p className="text-3xl font-black text-amber-600">{expertCount}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Expert Level</p>
                </div>
                <div className="premium-card p-6 text-center">
                    <p className="text-3xl font-black text-blue-600">{proficientCount}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Proficient</p>
                </div>
            </div>

            {/* Verified Skills List */}
            <div className="premium-card p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <Shield size={22} className="mr-3 text-emerald-600" /> Verified Skill Breakdown
                </h3>
                <div className="space-y-4">
                    {verified.sort((a, b) => (b[1].verifiedLevel?.adjustedConfidence || 0) - (a[1].verifiedLevel?.adjustedConfidence || 0))
                        .map(([skillId, skillInfo]) => (
                            <div key={skillId} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 hover:bg-white transition-colors">
                                <div className="flex items-center space-x-4">
                                    <span className="text-xl">{skillInfo.icon}</span>
                                    <div>
                                        <p className="font-bold text-slate-900 capitalize">{skillId.replace(/-/g, ' ')}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{skillInfo.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${skillInfo.verifiedLevel?.color === 'emerald' ? 'bg-emerald-500' :
                                                    skillInfo.verifiedLevel?.color === 'blue' ? 'bg-blue-500' :
                                                        'bg-amber-500'
                                                }`}
                                            style={{ width: `${skillInfo.verifiedLevel?.adjustedConfidence}%` }}
                                        />
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${skillInfo.verifiedLevel?.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                            skillInfo.verifiedLevel?.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                                'bg-amber-50 text-amber-600'
                                        }`}>
                                        {skillInfo.verifiedLevel?.label}
                                    </span>
                                    <span className="text-sm font-bold text-slate-700 w-10 text-right">
                                        {skillInfo.quizScore}/{SKILL_QUIZZES[skillId]?.length || 3}
                                    </span>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Pipeline Explanation */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400">How This Feeds Into Readiness</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="font-bold text-indigo-400 mb-2">1. Jaccard Similarity</p>
                            <p className="text-sm text-slate-400">
                                Verified skills are matched against market-required skills, producing an accurate match percentage.
                            </p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="font-bold text-emerald-400 mb-2">2. RandomForest Prediction</p>
                            <p className="text-sm text-slate-400">
                                CGPA + Projects + <span className="text-white font-bold">Verified Skill Match %</span> → Readiness Score.
                            </p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                            <p className="font-bold text-amber-400 mb-2">3. Gap Analysis</p>
                            <p className="text-sm text-slate-400">
                                Missing skills are computed from verified profile, not just resume claims.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pb-8">
                <button
                    onClick={() => onUpdateProfile(verifiedSkillIds)}
                    className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center"
                >
                    <Target size={20} className="mr-3" /> Update Profile & Recalculate Readiness
                </button>
                <button
                    onClick={onReset}
                    className="bg-white text-slate-600 px-10 py-5 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center"
                >
                    <RotateCcw size={18} className="mr-3" /> Upload Another Resume
                </button>
            </div>
        </div>
    );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━ MAIN COMPONENT ━━━━━━━━━━━━━━━━━━━━━━━━━

const ResumeUploadView = ({ onProfileUpdate }) => {
    const [step, setStep] = useState('upload');           // upload | results | quiz | complete
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
            
            // Map backend data to frontend format, adding icons from skillData
            const enrichedSkills = {};
            if (data.skills) {
                Object.entries(data.skills).forEach(([id, info]) => {
                    const frontendSkillInfo = SKILL_KEYWORDS[id] || { icon: "🛠️", category: info.category };
                    enrichedSkills[id] = {
                        ...info,
                        icon: frontendSkillInfo.icon,
                        verifiedLevel: null,
                        quizScore: null,
                        skillId: id, // Ensure id is preserved
                        matchedKeywords: info.matched_keywords || [id]
                    };
                });
            }
            
            setExtractedSkills(enrichedSkills);
            setStep('results');
        } catch (err) {
            console.error('Extraction error:', err);
            // Fallback to local extraction if backend fails
            const skills = extractSkillsFromText(resumeText);
            setExtractedSkills(skills);
            setStep('results');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleStartQuiz = (skillId) => {
        setActiveQuizSkill(skillId);
        setQuizQuestions(buildExtendedQuiz(skillId, 25));
        setStep('quiz');
    };

    const handleFinishQuiz = (skillId, score, total) => {
        const level = calculateVerifiedLevel(score, total);
        setExtractedSkills(prev => ({
            ...prev,
            [skillId]: {
                ...prev[skillId],
                status: total > 0 ? 'verified' : 'unverified',
                verifiedLevel: total > 0 ? level : null,
                quizScore: total > 0 ? score : null
            }
        }));
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
        alert(`✅ Profile updated with ${verifiedSkillIds.length} verified skills!\n\nYour readiness score will now be recalculated using verified skills instead of resume claims.`);
    };

    return (
        <div className="pb-12">
            {step === 'upload' && (
                <UploadStep
                    resumeText={resumeText}
                    setResumeText={setResumeText}
                    onExtract={handleExtract}
                    useLLM={useLLM}
                    setUseLLM={setUseLLM}
                    isExtracting={isExtracting}
                />
            )}
            {step === 'results' && (
                <ResultsStep
                    skills={extractedSkills}
                    setSkills={setExtractedSkills}
                    onStartQuiz={handleStartQuiz}
                    onBack={() => setStep('upload')}
                    onComplete={handleComplete}
                />
            )}
            {step === 'quiz' && activeQuizSkill && (
                <QuizStep
                    skillId={activeQuizSkill}
                    skills={extractedSkills}
                    questions={quizQuestions}
                    onFinishQuiz={handleFinishQuiz}
                    onBack={() => setStep('results')}
                />
            )}
            {step === 'complete' && (
                <CompleteStep
                    skills={extractedSkills}
                    onReset={handleReset}
                    onUpdateProfile={handleUpdateProfile}
                />
            )}
        </div>
    );
};

export default ResumeUploadView;
