import React from 'react';
import { User } from 'lucide-react';

const ProfileView = ({ selectedStudent, students = [], readinessScore, gapReport, history }) => {
    const studentData = students.find(s => s.id === selectedStudent) || {};

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
                <p className="text-gray-500">View and manage your information.</p>
            </header>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-6 mb-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center">
                        <User size={40} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{studentData.name || selectedStudent}</h2>
                        <p className="text-gray-500">{studentData.id ? `Roll No: ${studentData.id}` : 'Student Portal'} • {studentData.email || 'No email'}</p>
                    </div>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Readiness Score</p>
                    <p className="text-2xl font-bold text-indigo-600">{Math.round(readinessScore)}%</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Target Role</p>
                    <p className="text-2xl font-bold text-gray-900">{gapReport?.best_role_match || 'Analyzing...'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Tests Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{history.length}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Skills Acquired</p>
                    <p className="text-2xl font-bold text-gray-900">{gapReport?.current_skills?.length || 0}</p>
                </div>
            </div>
        </div>
        </div>
    );
};

export default ProfileView;
