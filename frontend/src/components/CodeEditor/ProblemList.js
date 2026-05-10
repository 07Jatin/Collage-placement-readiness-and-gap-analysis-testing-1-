import React from 'react';

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

export default ProblemList;
