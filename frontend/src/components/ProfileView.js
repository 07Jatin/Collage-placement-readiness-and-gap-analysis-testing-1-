import React, { useState } from 'react';
import { User, Edit2, Save, X, Award } from 'lucide-react';

const ProfileView = ({ selectedStudent, students = [], readinessScore, gapReport, history = [], dashboardTrack }) => {
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    
    // Safety check: Ensure students is an array before calling .find()
    const studentData = Array.isArray(students) 
        ? students.find(s => (s?.id || s) === selectedStudent) || {}
        : {};

    const initializeForm = () => {
        setFormData({
            name: studentData.name || selectedStudent || 'Student',
            email: studentData.email || '',
            targetRole: gapReport?.target_role || dashboardTrack || ''
        });
        setEditMode(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/students/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: selectedStudent,
                    name: formData.name,
                    email: formData.email,
                    target_role: formData.targetRole
                })
            });
            
            if (response.ok) {
                setEditMode(false);
                window.location.reload(); 
            } else {
                alert('Failed to update profile');
            }
        } catch (err) {
            console.error('Save error:', err);
            alert('Error updating profile');
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        setFormData({});
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const certifications = gapReport?.certifications || [];

    return (
        <div className="space-y-10 animate-in">
            <header className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight flex items-center">
                    <span className="dark:text-white text-slate-900">Student Identity</span>
                    <span className="ml-3 px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                        Profile
                    </span>
                </h1>
                <p className="font-medium text-lg text-slate-500">Managing your professional persona in the ecosystem.</p>
            </header>

            <div className="premium-card p-10 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 border-b border-slate-100 dark:border-white/5 pb-12">
                    <div className="flex items-center space-x-8">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                            <div className="relative w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center border border-white/10 ring-8 ring-indigo-500/5">
                                <User size={48} className="text-indigo-400" />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-black dark:text-white text-slate-900 mb-1">
                                {formData.name || studentData.name || selectedStudent || 'Identity Pending'}
                            </h2>
                            <div className="flex items-center space-x-3 text-slate-500 font-bold text-xs uppercase tracking-widest">
                                <span>{studentData.id || selectedStudent || 'UID-0000'}</span>
                                <span className="opacity-30">•</span>
                                <span className="text-indigo-500">{formData.email || studentData.email || 'NO_ECHO_ADDR'}</span>
                            </div>
                        </div>
                    </div>
                    {!editMode && (
                        <button onClick={initializeForm} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center">
                            <Edit2 size={16} className="mr-2" /> Modify Profile
                        </button>
                    )}
                </div>

                {editMode && (
                    <div className="space-y-8 mb-12 p-8 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Legal Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Encrypted Email Address</label>
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Strategic Target Role</label>
                            <input
                                type="text"
                                value={formData.targetRole || ''}
                                onChange={(e) => handleInputChange('targetRole', e.target.value)}
                                className="w-full px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold"
                            />
                        </div>
                        <div className="flex gap-4 pt-4 justify-end">
                            <button onClick={handleCancel} className="px-6 py-3 text-slate-500 hover:text-slate-900 font-bold transition-colors">
                                Discard
                            </button>
                            <button onClick={handleSave} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                                Sync Changes
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Readiness Score</p>
                        <p className="text-4xl font-black text-indigo-500">{Math.round(readinessScore || 0)}%</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-amber-500/30 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Target Path</p>
                        <p className="text-xl font-black truncate">{formData.targetRole || gapReport?.target_role || dashboardTrack || 'UNASSIGNED'}</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-emerald-500/30 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Assessment Cycles</p>
                        <p className="text-3xl font-black italic">#{history?.length || 0}</p>
                    </div>
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 group hover:border-purple-500/30 transition-all">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Skill Nodes Mastered</p>
                        <p className="text-3xl font-black">{gapReport?.current_skills?.length || 0}</p>
                    </div>
                </div>

                <div className="mt-16 pt-12 border-t border-slate-100 dark:border-white/5">
                    <h3 className="text-2xl font-black mb-8 flex items-center">
                        <Award size={28} className="mr-4 text-amber-500" /> 
                        <span className="dark:text-white text-slate-900">Verified Credentials</span>
                    </h3>
                    {(certifications || []).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {certifications.map((cert, idx) => (
                                <div key={idx} className="p-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[2rem] flex items-center justify-between group hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl transition-all duration-500">
                                    <div>
                                        <p className="font-black text-slate-900 dark:text-white text-lg leading-tight mb-1">{cert?.name || 'Unknown Credential'}</p>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{cert?.issuer || 'Self-Verified'} • {cert?.date || 'Ancient'}</p>
                                    </div>
                                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                        Verified
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] p-20 text-center">
                            <Award size={64} className="mx-auto mb-6 text-slate-300 dark:text-white/10" />
                            <p className="font-black text-2xl dark:text-white/40 text-slate-300">Null Credentials Detected</p>
                            <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">Upload your external certifications to synchronize them with your professional readiness profile.</p>
                            <button className="mt-8 px-10 py-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
                                Append New Credential
                            </button>
                        </div>
                    )}
                </div>
                
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl p-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl p-none"></div>
            </div>
        </div>
    );
};

export default ProfileView;
