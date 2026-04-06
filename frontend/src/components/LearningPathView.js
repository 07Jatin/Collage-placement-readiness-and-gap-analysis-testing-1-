import React from 'react';
import { Map, ArrowRight, Trophy, Youtube, BookOpen } from 'lucide-react';

const getLearningLinks = (skill) => [
    { 
        name: 'Watch Free Course', 
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + " full course tutorial")}`, 
        icon: Youtube,
        color: 'text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border-red-100'
    },
    {
        name: 'FreeCodeCamp',
        url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(skill)}`,
        icon: BookOpen,
        color: 'text-slate-700 bg-slate-100 hover:bg-slate-800 hover:text-white border-slate-200'
    }
];

const LearningPathView = ({ gapReport }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Milestone Roadmap</h1>
            <p className="text-gray-500 font-medium">Step-by-step career acceleration plan tailored to your profile.</p>
        </header>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-10 flex items-center">
                <Map size={24} className="mr-3 text-indigo-600" />
                Path to {gapReport?.target_role || gapReport?.best_role_match || 'Target Role'} Expertise
            </h3>

            <div className="relative space-y-12">
                {/* Timeline Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-500 via-indigo-200 to-indigo-50 rounded-full"></div>

                {gapReport?.missing_skills?.length > 0 ? (
                    gapReport.missing_skills.map((skill, i) => {
                        const isTestGap = gapReport.test_gaps?.includes(skill);
                        return (
                            <div key={i} className="relative flex items-start group">
                                <div className={`z-10 w-14 h-14 rounded-[1.25rem] ${isTestGap ? 'bg-rose-600 shadow-rose-100' : 'bg-indigo-600 shadow-indigo-100'} text-white flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform`}>
                                    {i + 1}
                                </div>
                                <div className="ml-8 pt-1 flex-1">
                                    <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${
                                        isTestGap 
                                            ? 'bg-rose-50 border-rose-100 group-hover:bg-white group-hover:shadow-xl group-hover:border-rose-200' 
                                            : 'bg-slate-50 border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:border-indigo-100'
                                    }`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-xl font-bold text-gray-900">{skill} Mastery</h4>
                                            {isTestGap && (
                                                <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    Action Required (Test Result)
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-sm mb-4">
                                            {isTestGap 
                                                ? `Recent test results indicate a need for improvement in ${skill}. Complete this module to bridge the gap.`
                                                : `Complete the technical deep-dive and project-based assessments for ${skill}.`
                                            }
                                        </p>
                                        <div className="flex flex-wrap items-center gap-3">
                                            {getLearningLinks(skill).map((link, idx) => {
                                                const Icon = link.icon;
                                                return (
                                                    <a 
                                                        key={idx} 
                                                        href={link.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className={`text-xs font-black uppercase tracking-wider flex items-center px-4 py-2.5 rounded-xl border transition-all ${link.color}`}
                                                    >
                                                        <Icon size={14} className="mr-2" /> {link.name} 
                                                    </a>
                                                );
                                            })}
                                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest ml-auto">Est. 10-15 Hours</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-16 bg-emerald-50 rounded-[3rem] border-2 border-dashed border-emerald-100">
                        <Trophy size={64} className="mx-auto text-emerald-500 mb-4" />
                        <h3 className="text-2xl font-black text-emerald-900">Roadmap Complete!</h3>
                        <p className="text-emerald-600 font-medium">You are fully prepared for the {gapReport?.target_role || gapReport?.best_role_match || 'Target Role'} track.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default LearningPathView;
