import React from 'react';
import { Map, ArrowRight, Trophy } from 'lucide-react';

const LearningPathView = ({ gapReport }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <header className="space-y-1">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Milestone Roadmap</h1>
            <p className="text-gray-500 font-medium">Step-by-step career acceleration plan tailored to your profile.</p>
        </header>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-10 flex items-center">
                <Map size={24} className="mr-3 text-indigo-600" />
                Path to {gapReport?.best_role_match || 'Target Role'} Expertise
            </h3>

            <div className="relative space-y-12">
                {/* Timeline Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-1 bg-gradient-to-b from-indigo-500 via-indigo-200 to-indigo-50 rounded-full"></div>

                {gapReport?.missing_skills?.length > 0 ? (
                    gapReport.missing_skills.map((skill, i) => (
                        <div key={i} className="relative flex items-start group">
                            <div className={`z-10 w-14 h-14 rounded-[1.25rem] bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform`}>
                                {i + 1}
                            </div>
                            <div className="ml-8 pt-1 flex-1">
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl group-hover:border-indigo-100 transition-all duration-300">
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">{skill} Mastery</h4>
                                    <p className="text-gray-500 text-sm mb-4">Complete the technical deep-dive and project-based assessments for {skill}.</p>
                                    <div className="flex items-center space-x-4">
                                        <button className="text-indigo-600 text-xs font-black uppercase tracking-widest flex items-center bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                            Start Module <ArrowRight size={14} className="ml-2" />
                                        </button>
                                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Est. 12 Hours</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-emerald-50 rounded-[3rem] border-2 border-dashed border-emerald-100">
                        <Trophy size={64} className="mx-auto text-emerald-500 mb-4" />
                        <h3 className="text-2xl font-black text-emerald-900">Roadmap Complete!</h3>
                        <p className="text-emerald-600 font-medium">You are fully prepared for the {gapReport?.best_role_match} track.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default LearningPathView;
