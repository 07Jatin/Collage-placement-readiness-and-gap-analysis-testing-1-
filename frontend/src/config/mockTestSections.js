import { BookOpen, Brain, Code, BarChart3, Zap } from 'lucide-react';

export const SECTION_META = {
  quantitative: { label: 'Quantitative Aptitude', icon: BarChart3, color: 'indigo', count: 25, time: 30 },
  english: { label: 'English Proficiency', icon: BookOpen, color: 'emerald', count: 25, time: 25 },
  reasoning: { label: 'Logical Reasoning', icon: Brain, color: 'violet', count: 30, time: 35 },
  computer_science: { label: 'Computer Science', icon: Code, color: 'amber', count: 15, time: 20 },
  dsa_random_pool: { label: 'DSA Challenge Pool', icon: Zap, color: 'rose', count: 6, time: 30 },
};

export const SECTION_ORDER = [
  'quantitative',
  'english',
  'reasoning',
  'computer_science',
  'dsa_random_pool'
];
