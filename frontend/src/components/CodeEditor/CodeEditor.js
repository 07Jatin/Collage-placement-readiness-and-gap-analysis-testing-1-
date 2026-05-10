import React, { useRef } from 'react';

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

export default CodeEditor;
