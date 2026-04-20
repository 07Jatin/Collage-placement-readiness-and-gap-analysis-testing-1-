import React, { useState, useEffect } from 'react';
import { Map, ArrowRight, Trophy, Youtube, BookOpen, Play, ExternalLink } from 'lucide-react';

const getEstimatedHours = (skill) => {
    const skillMap = {
        'git': '5-8',
        'data-structures': '20-25',
        'rest-api': '15-18',
        'algorithms': '25-30',
        'python': '20-25',
        'react': '18-22',
        'docker': '12-15',
        'kubernetes': '20-25',
        'aws': '25-35',
        'Quantitative Aptitude': '10-15',
        'English Proficiency': '8-12',
        'Logical Reasoning': '12-16',
        'Computer Science Fundamentals': '15-20',
        'Data Structures and Algorithms': '25-30'
    };
    return skillMap[skill] || '10-15';
};

const getLearningLinks = (skill) => {
    const skillMap = {
        'python': [
            { name: 'Python Fundamentals', url: 'https://www.udemy.com/course/python-for-everybody/', icon: BookOpen, color: 'text-blue-600 bg-blue-50 hover:bg-blue-600 border-blue-100' },
            { name: 'Python on GfG', url: 'https://www.geeksforgeeks.org/python/', icon: ExternalLink, color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-600 border-emerald-100' }
        ],
        'sql': [
            { name: 'SQLZoo Interactive', url: 'https://sqlzoo.net/', icon: Map, color: 'text-orange-600 bg-orange-50 hover:bg-orange-600 border-orange-100' },
            { name: 'SQL on LeetCode', url: 'https://leetcode.com/problemset/database/', icon: ExternalLink, color: 'text-slate-700 bg-slate-50 hover:bg-slate-800 border-slate-200' }
        ],
        'react': [
            { name: 'React Official Docs', url: 'https://react.dev/learn', icon: BookOpen, color: 'text-sky-600 bg-sky-50 hover:bg-sky-600 border-sky-100' },
            { name: 'React UI Patterns', url: 'https://refactoringui.com/', icon: ExternalLink, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-600 border-indigo-100' }
        ],
        'git': [
            { name: 'Learn Git Interactively', url: 'https://learngitbranching.js.org/', icon: Map, color: 'text-red-600 bg-red-50 hover:bg-red-600 border-red-100' },
            { name: 'Git Pocket Pack', url: 'https://git-scm.com/book/en/v2', icon: BookOpen, color: 'text-slate-700 bg-slate-50 hover:bg-slate-800 border-slate-200' }
        ],
        'data-structures': [
            { name: 'GfG DSA Guide', url: 'https://www.geeksforgeeks.org/data-structures/', icon: BookOpen, color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-600 border-emerald-100' },
            { name: 'DSA Visualizer', url: 'https://visualgo.net/', icon: Map, color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-600 border-indigo-100' }
        ],
        'algorithms': [
            { name: 'LeetCode Patterns', url: 'https://leetcode.com/problemset/algorithms/', icon: ExternalLink, color: 'text-amber-600 bg-amber-50 hover:bg-amber-600 border-amber-100' },
            { name: 'Algorithmic Visuals', url: 'https://www.cs.usfca.edu/~galles/visualization/Algorithms.html', icon: Map, color: 'text-rose-600 bg-rose-50 hover:bg-rose-600 border-rose-100' }
        ]
    };

    const defaultLinks = [
        { name: 'GfG Tutorial', url: `https://www.geeksforgeeks.org/${skill.toLowerCase().replace(/ /g, '-')}/`, icon: BookOpen, color: 'text-emerald-700 bg-emerald-50 hover:bg-emerald-600 border-emerald-100' },
        { name: 'Skill Labs', url: `https://www.google.com/search?q=${encodeURIComponent(skill + " best resources")}`, icon: ExternalLink, color: 'text-slate-600 bg-slate-50 hover:bg-slate-600 border-slate-100' }
    ];

    return skillMap[skill.toLowerCase()] || defaultLinks;
};

const SkillMilestone = ({ skill, index, isTestGap, targetRole }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const resources = getLearningLinks(skill);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/youtube/search?query=${encodeURIComponent(skill)}`);
                const data = await res.json();
                setVideos(data.videos || []);
            } catch (err) {
                console.error('Video fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, [skill]);

    return (
        <div className="relative flex items-start group">
            <div className={`z-10 w-14 h-14 rounded-[1.25rem] ${isTestGap ? 'bg-rose-600 shadow-rose-100' : 'bg-indigo-600 shadow-indigo-100'} text-white flex items-center justify-center font-black shadow-lg group-hover:scale-110 transition-transform`}>
                {index + 1}
            </div>
            <div className="ml-8 pt-1 flex-1">
                <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${
                    isTestGap 
                        ? 'bg-rose-50/50 border-rose-100 group-hover:bg-white group-hover:shadow-2xl group-hover:border-rose-200' 
                        : 'bg-slate-50/50 border-slate-100 group-hover:bg-white group-hover:shadow-2xl group-hover:border-indigo-100'
                }`}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">{skill} Mastery</h4>
                            <p className="text-gray-500 font-medium text-sm mt-1">Estimated Completion: {getEstimatedHours(skill)} Hours</p>
                        </div>
                        {isTestGap && (
                            <span className="px-4 py-1.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-rose-200 flex items-center">
                                <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse"></span>
                                Priority Gap
                            </span>
                        )}
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-2xl">
                        {isTestGap 
                            ? `Our engine detected a critical gap in ${skill} based on your recent assessment performance. Follow these curated video paths to reach ${targetRole} readiness.`
                            : `Strengthen your core foundation in ${skill} through these industry-graded learning modules and projects.`
                        }
                    </p>

                    {/* Quick Access Resources */}
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                        {resources.map((link, idx) => {
                            const Icon = link.icon;
                            return (
                                <a 
                                    key={idx} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={`text-[10px] font-black uppercase tracking-widest flex items-center px-4 py-2 rounded-xl border transition-all hover:text-white hover:shadow-lg ${link.color}`}
                                >
                                    <Icon size={12} className="mr-2" /> {link.name} 
                                </a>
                            );
                        })}
                    </div>

                    {/* Video Recommendations */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <Youtube size={18} className="text-red-600" />
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curated Video Masterclasses</h5>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {loading ? (
                                [1, 2].map(i => (
                                    <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse"></div>
                                ))
                            ) : (
                                videos.map((vid, vidIdx) => (
                                    <a 
                                        key={vidIdx} 
                                        href={vid.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group/video relative overflow-hidden rounded-3xl border border-gray-100 bg-white hover:border-indigo-500 transition-all flex items-center p-3 space-x-4 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                    >
                                        <div className="relative w-32 h-20 rounded-2xl overflow-hidden shrink-0">
                                            <img src={vid.thumbnail} alt="Thumbnail" className="w-full h-full object-cover group-hover/video:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                                                <Play size={20} className="text-white fill-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 pr-2">
                                            <p className="text-[11px] font-black leading-tight text-gray-900 group-hover/video:text-indigo-600 transition-colors line-clamp-2">{vid.title}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{vid.channel}</span>
                                                <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">{vid.views}</span>
                                            </div>
                                        </div>
                                    </a>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LearningPathView = ({ gapReport }) => {
    const missingSkills = gapReport?.missing_skills || [];
    const targetRole = gapReport?.target_role || gapReport?.best_role_match || 'Target Role';

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <header className="space-y-2">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                        <Map size={24} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Milestone <span className="text-indigo-600">Roadmap</span></h1>
                        <p className="text-gray-500 font-medium">Synchronizing your skill-set with {targetRole} expectations.</p>
                    </div>
                </div>
            </header>

            <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-16 flex items-center relative z-10">
                    Your Path to Mastery
                    <div className="ml-4 h-px flex-1 bg-gray-100"></div>
                </h3>

                <div className="relative space-y-16">
                    {/* Timeline Line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <div className="w-full h-1/2 bg-gradient-to-b from-indigo-500 to-transparent"></div>
                    </div>

                    {missingSkills.length > 0 ? (
                        missingSkills.map((skill, i) => (
                            <SkillMilestone 
                                key={i} 
                                skill={skill} 
                                index={i} 
                                isTestGap={gapReport.test_gaps?.includes(skill)}
                                targetRole={targetRole}
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-emerald-50/50 rounded-[4rem] border-2 border-dashed border-emerald-100 relative z-10">
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200">
                                <Trophy size={48} className="text-white" />
                            </div>
                            <h3 className="text-3xl font-black text-emerald-900 tracking-tight">Roadmap Converged</h3>
                            <p className="text-emerald-700 font-medium max-w-md mx-auto mt-2">You have eliminated all technical gaps. You are mathematically ready for {targetRole} placement.</p>
                            <button className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200">
                                Proceed to Interview Simulation
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default LearningPathView;
