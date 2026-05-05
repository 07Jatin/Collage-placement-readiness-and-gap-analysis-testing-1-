import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Play, CheckCircle2, XCircle, ChevronRight, ChevronDown, ChevronUp,
    ThumbsUp, ThumbsDown, Star, Globe, RotateCcw,
    Copy, Check, Maximize2, Minimize2, Settings, BookOpen, Send, ListChecks
} from 'lucide-react';
import { DSA_PROBLEMS, LANG_LABELS } from '../data/dsaProblems';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Code Editor with Line Numbers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CodeEditor = ({ code, onChange, language, fontSize = 13 }) => {
    const textareaRef = useRef(null);
    const lineNumbersRef = useRef(null);
    const lines = code.split('\n');

    const handleScroll = () => {
        if (lineNumbersRef.current && textareaRef.current) {
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            const newCode = code.substring(0, start) + '    ' + code.substring(end);
            onChange(newCode);
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4;
            }, 0);
        }
    };

    return (
        <div className="flex h-full font-mono bg-[#1e1e1e] overflow-hidden" style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}>
            {/* Line Numbers */}
            <div
                ref={lineNumbersRef}
                className="select-none text-right pr-4 pl-4 py-4 text-[#858585] bg-[#1e1e1e] overflow-hidden shrink-0 border-r border-[#333]"
                style={{ minWidth: '50px' }}
            >
                {lines.map((_, i) => (
                    <div key={i} style={{ height: `${fontSize * 1.6}px` }}>{i + 1}</div>
                ))}
            </div>
            {/* Editor */}
            <textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => onChange(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-[#d4d4d4] py-4 pl-4 pr-4 resize-none focus:outline-none overflow-auto"
                spellCheck="false"
                style={{
                    tabSize: 4,
                    caretColor: '#fff',
                    lineHeight: '1.6',
                    fontSize: `${fontSize}px`,
                }}
            />
        </div>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Problem List Sidebar (like LeetCode problem selector)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const ProblemList = ({ problems, selected, onSelect, isOpen, onToggle }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#282828] border border-[#404040] rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-[#404040]">
                <p className="text-xs font-bold text-[#858585] uppercase tracking-wider">Problem List</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
                {problems.map((p, idx) => {
                    const diffColor = p.difficulty === 'Easy' ? 'text-[#00b8a3]' :
                        p.difficulty === 'Medium' ? 'text-[#ffc01e]' : 'text-[#ff375f]';
                    return (
                        <button
                            key={p.id}
                            onClick={() => { onSelect(p); onToggle(); }}
                            className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#333] transition-colors ${selected.id === p.id ? 'bg-[#333]' : ''}`}
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-[#858585] text-xs w-5">{idx + 1}.</span>
                                <span className={`text-sm ${selected.id === p.id ? 'text-white font-semibold' : 'text-[#eff1f6]'}`}>{p.title}</span>
                            </div>
                            <span className={`text-xs font-medium ${diffColor}`}>{p.difficulty}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Main Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const CodeEditorView = ({ gapReport = null, selectedStudent = 'S001' }) => {
    const [selectedProblem, setSelectedProblem] = useState(DSA_PROBLEMS[0]);
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState(DSA_PROBLEMS[0].defaultCode['python']);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState(null);
    const [leftTab] = useState('description');
    const [bottomTab, setBottomTab] = useState('testcase');
    const [showProblemList, setShowProblemList] = useState(false);
    const [isFetchingDynamic, setIsFetchingDynamic] = useState(false);
    const [splitPosition, setSplitPosition] = useState(45); // percentage
    const [bottomPanelHeight, setBottomPanelHeight] = useState(200);
    const [isBottomOpen, setIsBottomOpen] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [fontSize, setFontSize] = useState(13);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const containerRef = useRef(null);
    const isDragging = useRef(false);
    const isDraggingBottom = useRef(false);

    const handleProblemChange = (prob) => {
        setSelectedProblem(prob);
        setCode(prob.defaultCode[language] || prob.defaultCode['python']);
        setOutput("");
        setResults(null);
        setBottomTab('testcase');
    };

    const fetchDynamicLeetcode = async () => {
        setIsFetchingDynamic(true);
        try {
            // Priority 1: Use the backend recommendation engine (factors in gaps + history)
            const response = await fetch(`http://127.0.0.1:8000/api/dsa/recommendation/${selectedStudent}`);
            const data = await response.json();
            
            if (data.error) {
                // Priority 2: Fallback to client-side gap mapping
                let skillToSearch = "Array";
                if (gapReport && gapReport.missing_skills && gapReport.missing_skills.length > 0) {
                    const skillMap = {
                        'Linked List': 'Linked List',
                        'Array': 'Array',
                        'Binary Tree': 'Tree',
                        'Strings': 'String',
                        'Hash Table': 'Hash Table'
                    };
                    const mappedSkill = gapReport.missing_skills[0];
                    skillToSearch = skillMap[mappedSkill] || "Array";
                }
                
                const fallbackRes = await fetch(`http://127.0.0.1:8000/api/dsa/dynamic/${skillToSearch}`);
                const fallbackData = await fallbackRes.json();
                
                if (fallbackData.error) {
                    alert("Failed to fetch: " + fallbackData.error);
                    return;
                }
                setSelectedProblem(fallbackData);
                setCode(fallbackData.defaultCode[language] || fallbackData.defaultCode['python'] || "");
            } else {
                setSelectedProblem(data);
                setCode(data.defaultCode[language] || data.defaultCode['python'] || "");
            }
            
            setOutput("Personalized gap problem loaded from LeetCode. Synthetic verification active.");
            setResults(null);
            setBottomTab('testcase');
        } catch (e) {
            alert("API Error: " + e.message);
        } finally {
            setIsFetchingDynamic(false);
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        if (selectedProblem.defaultCode && selectedProblem.defaultCode[newLang]) {
            setCode(selectedProblem.defaultCode[newLang]);
        }
    };

    const handleReset = () => {
        const defCode = selectedProblem.defaultCode[language] || "";
        if (code !== defCode) {
            setCode(defCode);
            setOutput("");
            setResults(null);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFullscreen = () => {
        if (!isFullscreen) {
            containerRef.current?.requestFullscreen?.();
        } else {
            document.exitFullscreen?.();
        }
        setIsFullscreen(!isFullscreen);
    };

    // Listen for fullscreen exit via Escape key
    useEffect(() => {
        const onFsChange = () => {
            if (!document.fullscreenElement) setIsFullscreen(false);
        };
        document.addEventListener('fullscreenchange', onFsChange);
        return () => document.removeEventListener('fullscreenchange', onFsChange);
    }, []);

    const handleRunCode = async () => {
        setIsRunning(true);
        setOutput("⏳ Compiling and running...");
        setResults(null);
        setBottomTab('result');
        setIsBottomOpen(true);

        try {
            const response = await fetch('http://127.0.0.1:8000/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    problem_id: selectedProblem.id,
                    language: language,
                    isDynamic: selectedProblem.isDynamic || false
                }),
                signal: AbortSignal.timeout(15000)
            });

            if (response.ok) {
                const data = await response.json();
                setOutput(data.output || data.error || "Execution finished.");
                if (data.results) setResults(data.results);
            } else {
                const errData = await response.json().catch(() => ({}));
                setOutput(`❌ Server Error (${response.status}):\n${errData.detail || 'Unknown error'}`);
            }
        } catch (err) {
            if (err.name === 'TimeoutError') {
                setOutput("⏱️ Time Limit Exceeded.\nYour code took too long to execute.");
            } else {
                setOutput(
                    "❌ Backend server is not running.\n\n" +
                    "To start the compiler, open a NEW terminal and run:\n\n" +
                    '  cd "c:\\Users\\Jatin\\Desktop\\final project"\n' +
                    "  .\\.venv\\Scripts\\activate\n" +
                    "  uvicorn backend.main:app --reload\n\n" +
                    "Then click Run again."
                );
            }
        } finally {
            setIsRunning(false);
        }
    };

    // Horizontal drag handler
    const handleMouseDown = useCallback((e) => {
        isDragging.current = true;
        e.preventDefault();
    }, []);

    // Bottom panel drag handler
    const handleBottomMouseDown = useCallback((e) => {
        isDraggingBottom.current = true;
        e.preventDefault();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDragging.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const pos = ((e.clientX - rect.left) / rect.width) * 100;
                setSplitPosition(Math.max(25, Math.min(70, pos)));
            }
            if (isDraggingBottom.current && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const newHeight = rect.bottom - e.clientY;
                setBottomPanelHeight(Math.max(100, Math.min(400, newHeight)));
            }
        };
        const handleMouseUp = () => {
            isDragging.current = false;
            isDraggingBottom.current = false;
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const diffColor = selectedProblem.difficulty === 'Easy' ? 'text-[#00b8a3]' :
        selectedProblem.difficulty === 'Medium' ? 'text-[#ffc01e]' : 'text-[#ff375f]';

    return (
        <div ref={containerRef} className="flex gap-0 animate-in rounded-xl overflow-hidden border border-[#333] shadow-2xl" style={{ background: '#1a1a1a', height: 'calc(100vh - 20px)' }}>

            {/* ════════════════════════════════════════════ */}
            {/* LEFT PANEL - Problem Description */}
            {/* ════════════════════════════════════════════ */}
            <div className="flex flex-col h-full overflow-hidden" style={{ width: `${splitPosition}%` }}>

                {/* Header */}
                <div className="flex items-center bg-[#282828] border-b border-[#333] px-4 shrink-0">
                    <div className="flex items-center space-x-1.5 px-2 py-2.5 text-xs font-medium text-white border-b-2 border-white">
                        <BookOpen size={13} />
                        <span>Description</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ background: '#1a1a1a' }}>
                    {leftTab === 'description' && (
                        <div className="p-6 space-y-6">
                            {/* Title + Difficulty */}
                            <div>
                                <div className="relative flex justify-between items-start">
                                    <div>
                                        <button
                                            onClick={() => setShowProblemList(!showProblemList)}
                                            className="flex items-center space-x-2 mb-2 group"
                                        >
                                            <h1 className="text-xl font-bold text-white">
                                                {selectedProblem.isDynamic ? <Globe size={18} className="inline mr-2 text-[#00b8a3]" /> : null}
                                                {selectedProblem.id}. {selectedProblem.title}
                                            </h1>
                                            <ChevronDown size={16} className="text-[#858585] group-hover:text-white transition-colors" />
                                        </button>
                                        <ProblemList
                                            problems={DSA_PROBLEMS}
                                            selected={selectedProblem}
                                            onSelect={handleProblemChange}
                                            isOpen={showProblemList}
                                            onToggle={() => setShowProblemList(false)}
                                        />
                                    </div>
                                    <button
                                        onClick={fetchDynamicLeetcode}
                                        disabled={isFetchingDynamic}
                                        className="flex shrink-0 items-center space-x-1.5 bg-[#404040] text-[#eff1f6] px-3 py-1.5 rounded hover:bg-[#555] transition-colors"
                                    >
                                        {isFetchingDynamic ? (
                                            <div className="w-3 h-3 border-2 border-[#858585] border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <RotateCcw size={13} />
                                        )}
                                        <span className="text-xs font-semibold">{isFetchingDynamic ? 'Fetching...' : 'Fetch Random Gap'}</span>
                                    </button>
                                </div>
                                <div className="flex items-center space-x-4 mt-2">
                                    <span className={`text-sm font-medium ${diffColor}`}>{selectedProblem.difficulty}</span>
                                    <div className="flex items-center space-x-1 text-[#858585]">
                                        <ThumbsUp size={14} />
                                        <span className="text-xs">{selectedProblem.likes}</span>
                                    </div>
                                    <div className="flex items-center space-x-1 text-[#858585]">
                                        <ThumbsDown size={14} />
                                        <span className="text-xs">{selectedProblem.dislikes}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div
                                className="text-[#eff1f6] text-sm leading-relaxed prose-invert"
                                dangerouslySetInnerHTML={{ __html: selectedProblem.description.replace(/\n/g, '<br/>') }}
                                style={{ lineHeight: '1.8' }}
                            />

                            {/* Examples */}
                            <div className="space-y-5">
                                {selectedProblem.examples.map((ex, i) => (
                                    <div key={i}>
                                        <p className="text-sm font-bold text-white mb-2">Example {i + 1}:</p>
                                        <div className="bg-[#282828] rounded-lg p-4 border-l-2 border-[#404040] space-y-1">
                                            <p className="text-sm text-[#eff1f6]">
                                                <span className="font-semibold text-[#858585]">Input: </span>
                                                <code className="text-[#d4d4d4]">{ex.input}</code>
                                            </p>
                                            <p className="text-sm text-[#eff1f6]">
                                                <span className="font-semibold text-[#858585]">Output: </span>
                                                <code className="text-[#d4d4d4]">{ex.output}</code>
                                            </p>
                                            {ex.explanation && (
                                                <p className="text-sm text-[#eff1f6]">
                                                    <span className="font-semibold text-[#858585]">Explanation: </span>
                                                    {ex.explanation}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Constraints */}
                            <div>
                                <p className="text-sm font-bold text-white mb-3">Constraints:</p>
                                <ul className="space-y-1.5">
                                    {selectedProblem.constraints.map((c, i) => (
                                        <li key={i} className="text-sm text-[#eff1f6] flex items-start">
                                            <span className="text-[#858585] mr-2 mt-0.5">•</span>
                                            <span dangerouslySetInnerHTML={{ __html: `<code class="text-xs bg-[#282828] px-1.5 py-0.5 rounded text-[#d4d4d4]">${c}</code>` }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Acceptance Rate */}
                            <div className="text-xs text-[#858585] pt-4 border-t border-[#333]">
                                Accepted: {selectedProblem.acceptance}
                            </div>

                            {/* Bottom stats bar */}
                            <div className="flex items-center space-x-6 text-[#858585] pb-4">
                                <div className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                                    <ThumbsUp size={14} /> <span className="text-xs">{selectedProblem.likes}</span>
                                </div>
                                <div className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                                    <ThumbsDown size={14} /> <span className="text-xs">{selectedProblem.dislikes}</span>
                                </div>
                                <div className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
                                    <Star size={14} /> <span className="text-xs">Favorite</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ════════════════════════════════════════════ */}
            {/* DIVIDER (draggable) */}
            {/* ════════════════════════════════════════════ */}
            <div
                className="w-[5px] bg-[#333] hover:bg-[#555] cursor-col-resize flex items-center justify-center transition-colors shrink-0 group"
                onMouseDown={handleMouseDown}
            >
                <div className="w-[3px] h-8 rounded-full bg-[#555] group-hover:bg-[#888] transition-colors"></div>
            </div>

            {/* ════════════════════════════════════════════ */}
            {/* RIGHT PANEL - Code Editor */}
            {/* ════════════════════════════════════════════ */}
            <div className="flex flex-col h-full overflow-hidden" style={{ width: `${100 - splitPosition}%` }}>

                {/* Editor Top Bar */}
                <div className="flex items-center justify-between bg-[#282828] border-b border-[#333] px-3 py-2 shrink-0">
                    <div className="flex items-center space-x-2">
                        {/* Language Selector */}
                        <div className="flex items-center bg-[#333] rounded-md px-2.5 py-1.5 space-x-1.5">
                            <Globe size={12} className="text-[#858585]" />
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-transparent text-xs text-[#eff1f6] focus:outline-none cursor-pointer font-medium"
                            >
                                {Object.entries(LANG_LABELS).map(([k, v]) => (
                                    <option key={k} value={k} className="bg-[#282828]">{v}</option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="text-[#858585]" />
                        </div>
                        <span className="text-xs text-[#858585] px-2">|</span>
                        <span className="text-xs text-[#858585] font-medium">Auto</span>
                    </div>
                    <div className="flex items-center space-x-1 relative">
                        {/* Reset */}
                        <button onClick={handleReset} className="p-1.5 rounded hover:bg-[#404040] text-[#858585] hover:text-white transition-colors" title="Reset to default code">
                            <RotateCcw size={14} />
                        </button>

                        {/* Copy with feedback */}
                        <button onClick={handleCopy} className={`p-1.5 rounded transition-colors ${copied ? 'text-[#00b8a3] bg-[#00b8a3]/10' : 'text-[#858585] hover:bg-[#404040] hover:text-white'}`} title={copied ? 'Copied!' : 'Copy code'}>
                            {copied ? <Check size={14} /> : <Copy size={14} />}
                        </button>

                        {/* Settings dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className={`p-1.5 rounded transition-colors ${showSettings ? 'text-white bg-[#404040]' : 'text-[#858585] hover:bg-[#404040] hover:text-white'}`}
                                title="Editor settings"
                            >
                                <Settings size={14} />
                            </button>
                            {showSettings && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-[#282828] border border-[#404040] rounded-lg shadow-2xl z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-[#404040]">
                                        <p className="text-xs font-bold text-white">Editor Settings</p>
                                    </div>
                                    <div className="p-3 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#eff1f6]">Font Size</span>
                                            <div className="flex items-center space-x-2 bg-[#333] rounded-md px-1">
                                                <button
                                                    onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                                                    className="text-[#858585] hover:text-white px-1.5 py-0.5 text-sm font-bold"
                                                >−</button>
                                                <span className="text-xs text-white font-mono w-5 text-center">{fontSize}</span>
                                                <button
                                                    onClick={() => setFontSize(Math.min(22, fontSize + 1))}
                                                    className="text-[#858585] hover:text-white px-1.5 py-0.5 text-sm font-bold"
                                                >+</button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#eff1f6]">Tab Size</span>
                                            <span className="text-xs text-[#858585] bg-[#333] px-2 py-0.5 rounded">4 spaces</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-[#eff1f6]">Theme</span>
                                            <span className="text-xs text-[#858585] bg-[#333] px-2 py-0.5 rounded">Dark</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Fullscreen */}
                        <button onClick={handleFullscreen} className="p-1.5 rounded hover:bg-[#404040] text-[#858585] hover:text-white transition-colors" title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                        </button>
                    </div>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                    <CodeEditor code={code} onChange={setCode} language={language} fontSize={fontSize} />
                </div>

                {/* Bottom Panel Divider */}
                <div
                    className="h-[4px] bg-[#333] hover:bg-[#555] cursor-row-resize shrink-0 transition-colors"
                    onMouseDown={handleBottomMouseDown}
                ></div>

                {/* Bottom Panel - Testcase / Result */}
                <div className="shrink-0 flex flex-col overflow-hidden bg-[#1a1a1a]" style={{ height: isBottomOpen ? `${bottomPanelHeight}px` : '36px' }}>
                    {/* Bottom Tabs */}
                    <div className="flex items-center justify-between bg-[#282828] border-b border-[#333] px-2 shrink-0">
                        <div className="flex items-center">
                            <button
                                onClick={() => { setBottomTab('testcase'); setIsBottomOpen(true); }}
                                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 ${bottomTab === 'testcase' && isBottomOpen
                                    ? 'text-white border-white'
                                    : 'text-[#858585] border-transparent hover:text-[#eff1f6]'
                                    }`}
                            >
                                <ListChecks size={13} />
                                <span>Testcase</span>
                            </button>
                            <button
                                onClick={() => { setBottomTab('result'); setIsBottomOpen(true); }}
                                className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 ${bottomTab === 'result' && isBottomOpen
                                    ? 'text-white border-white'
                                    : 'text-[#858585] border-transparent hover:text-[#eff1f6]'
                                    }`}
                            >
                                <ChevronRight size={13} />
                                <span>Test Result</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsBottomOpen(!isBottomOpen)}
                                className="p-1 rounded hover:bg-[#404040] text-[#858585] hover:text-white transition-colors"
                            >
                                {isBottomOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                            </button>
                        </div>
                    </div>

                    {/* Bottom Content */}
                    {isBottomOpen && (
                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {bottomTab === 'testcase' && (
                                <div className="space-y-3">
                                    {selectedProblem.testCases.map((tc, i) => (
                                        <div key={i} className="space-y-2">
                                            <p className="text-xs font-bold text-white">Case {i + 1}</p>
                                            <div className="bg-[#282828] rounded-lg p-3">
                                                <p className="text-xs text-[#858585] mb-1">Input:</p>
                                                <code className="text-xs text-[#d4d4d4] font-mono">{tc.input}</code>
                                            </div>
                                            <div className="bg-[#282828] rounded-lg p-3">
                                                <p className="text-xs text-[#858585] mb-1">Expected:</p>
                                                <code className="text-xs text-[#d4d4d4] font-mono">{tc.expected}</code>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {bottomTab === 'result' && (
                                <div className="space-y-3">
                                    {results ? (
                                        <>
                                            {/* Summary */}
                                            <div className="flex items-center space-x-3">
                                                {results.every(r => r.passed) ? (
                                                    <div className="flex items-center space-x-6">
                                                        <div className="flex items-center space-x-2">
                                                            <CheckCircle2 size={18} className="text-[#00b8a3]" />
                                                            <span className="text-lg font-bold text-[#00b8a3]">Accepted</span>
                                                        </div>
                                                        <button
                                                            onClick={fetchDynamicLeetcode}
                                                            className="flex items-center space-x-1 border border-[#00b8a3] text-[#00b8a3] px-3 py-1 rounded-full text-xs font-bold hover:bg-[#00b8a3] hover:text-[#1a1a1a] transition-all"
                                                        >
                                                            <span>Next Challenge</span>
                                                            <ChevronRight size={14} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center space-x-2">
                                                        <XCircle size={18} className="text-[#ff375f]" />
                                                        <span className="text-lg font-bold text-[#ff375f]">Wrong Answer</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Individual Results */}
                                            <div className="flex flex-wrap gap-2">
                                                {results.map((res, i) => (
                                                    <div key={i} className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 ${res.passed ? 'bg-[#00b8a3]/15 text-[#00b8a3]' : 'bg-[#ff375f]/15 text-[#ff375f]'}`}>
                                                        {res.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                                        <span>Case {i + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Output */}
                                            <div className="bg-[#282828] rounded-lg p-3">
                                                <pre className="text-xs text-[#d4d4d4] font-mono whitespace-pre-wrap">{output}</pre>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-[#858585] text-sm flex items-center space-x-2">
                                            {isRunning ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-[#858585] border-t-white rounded-full animate-spin"></div>
                                                    <span>Running test cases...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronRight size={14} />
                                                    <span>Click "Run" or "Submit" to see results</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Bar */}
                    <div className="flex items-center justify-between bg-[#282828] border-t border-[#333] px-4 py-2 shrink-0">
                        <div className="text-[10px] text-[#858585]">
                            Saved <span className="ml-6">Ln 1, Col 1</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#333] text-white hover:bg-[#404040] transition-colors disabled:opacity-50 flex items-center space-x-1.5"
                            >
                                <Play size={12} />
                                <span>Run</span>
                            </button>
                            <button
                                onClick={handleRunCode}
                                disabled={isRunning}
                                className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#00b8a3] text-white hover:bg-[#00a693] transition-colors disabled:opacity-50 flex items-center space-x-1.5"
                            >
                                <Send size={12} />
                                <span>Submit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodeEditorView;
