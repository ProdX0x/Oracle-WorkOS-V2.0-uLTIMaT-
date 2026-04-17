import { Sector, Task, TaskStatus, HelpStatus, UserRole } from './types';

export const APP_VERSION = "2.0";

export const GLASS_CLASSES = {
  BASE: "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl",
  ACTIVE: "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl ring-1 ring-white/10",
  INPUT: "bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-oracle-purple transition-all",
  BUTTON_PRIMARY: "bg-gradient-to-r from-oracle-blue to-oracle-purple hover:from-blue-500 hover:to-purple-500 text-white font-medium py-2 px-4 rounded-lg shadow-lg shadow-purple-900/20 transition-all active:scale-95",
  BUTTON_SECONDARY: "bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2 px-4 rounded-lg transition-all active:scale-95",
  DANGER: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20",
};

export const INITIAL_SECTORS: Sector[] = [
  { id: 'sec_1', name: 'Engineering', color: 'bg-blue-500' },
  { id: 'sec_2', name: 'Design', color: 'bg-emerald-500' },
  { id: 'sec_3', name: 'Operations', color: 'bg-amber-500' },
];

// Seed data for the "Auto-Evolution" protocol
export const SYSTEM_TASKS: Task[] = [
  {
    id: 'sys_1',
    title: 'Initialize Firestore Database',
    description: 'Connect to the NoSQL cloud database to enable real-time persistence.',
    status: TaskStatus.DONE,
    sectorId: 'sec_1',
    helpStatus: HelpStatus.NONE,
    isSystemTask: true,
    progress: 100,
    impactScore: 100,
    effortScore: 8,
    strategicTheme: 'Infrastructure',
    aiRationale: 'Critical path for V2.0 launch.'
  },
  {
    id: 'sys_2',
    title: 'Secure Cloud Functions',
    description: 'Implement backend validation for Gemini API calls to hide keys.',
    status: TaskStatus.IN_PROGRESS,
    sectorId: 'sec_1',
    helpStatus: HelpStatus.OPEN,
    isSystemTask: true,
    progress: 45,
    impactScore: 90,
    effortScore: 5,
    strategicTheme: 'Security',
    aiRationale: 'Prevents unauthorized API usage and potential cost overruns.'
  }
];