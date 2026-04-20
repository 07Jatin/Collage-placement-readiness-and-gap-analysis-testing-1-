import {
  BookOpen,
  ClipboardList,
  Code,
  FileText,
  FileUp,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';


export const studentNavigation = [
  { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard' },
  { icon: FileText, label: 'Mock Assessments', key: 'tests' },
  { icon: TrendingUp, label: 'Gap Visualizer', key: 'gap' },
  { icon: BookOpen, label: 'Milestone Path', key: 'learning' },
  { icon: Code, label: 'DSA Coding Lab', key: 'dsa' },
  { icon: FileUp, label: 'Resume Analyzer', key: 'resume' },
];


export const adminNavigation = [
  { icon: Users, label: 'Admin Dashboard', key: 'admin' },
  { icon: ClipboardList, label: 'Manage Students', key: 'manage_students' },
];


export const accountNavigation = {
  switchRole: {
    student: { icon: ShieldCheck, label: 'Switch to Admin' },
    admin: { icon: User, label: 'Back to Student' },
  },
  profile: { icon: User, label: 'Profile Settings', key: 'profile' },
};
