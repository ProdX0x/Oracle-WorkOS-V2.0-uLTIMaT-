import { User, Task, Sector, SystemConfig, UserRole, TaskStatus, HelpStatus } from '../types';
import { SYSTEM_TASKS, INITIAL_SECTORS } from '../constants';

// Keys for persistence
const KEY_CONFIG = 'oracle_v2_config';
const KEY_USERS = 'oracle_v2_users';
const KEY_TASKS = 'oracle_v2_tasks';
const KEY_SECTORS = 'oracle_v2_sectors';
const KEY_SESSION = 'oracle_v2_session';

// --- MOCK API ---

export const db = {
  // --- AUTH ---
  getSession: (): User | null => {
    const stored = localStorage.getItem(KEY_SESSION);
    return stored ? JSON.parse(stored) : null;
  },

  login: async (email: string): Promise<User> => {
    // Simulating login - in V2 "Invite Only", we just check if user exists
    const users = db.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("Access Denied. Invite only.");
    
    localStorage.setItem(KEY_SESSION, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(KEY_SESSION);
  },

  // --- SYSTEM ---
  getConfig: (): SystemConfig => {
    const stored = localStorage.getItem(KEY_CONFIG);
    return stored ? JSON.parse(stored) : { isInitialized: false, version: '2.0' };
  },

  initializeSystem: async (superAdminEmail: string): Promise<User> => {
    // The "First Run" Logic
    const config: SystemConfig = { isInitialized: true, version: '2.0' };
    localStorage.setItem(KEY_CONFIG, JSON.stringify(config));

    // Create Yoda
    const yoda: User = {
      uid: 'u_yoda',
      name: 'Super Admin (Yoda)',
      email: superAdminEmail,
      role: UserRole.SUPER_ADMIN,
      avatar: 'https://picsum.photos/200'
    };
    
    // Seed initial data
    localStorage.setItem(KEY_USERS, JSON.stringify([yoda]));
    localStorage.setItem(KEY_SECTORS, JSON.stringify(INITIAL_SECTORS));
    localStorage.setItem(KEY_TASKS, JSON.stringify(SYSTEM_TASKS));
    localStorage.setItem(KEY_SESSION, JSON.stringify(yoda));

    return yoda;
  },

  // --- DATA ---
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
  },

  getTasks: (): Task[] => {
    return JSON.parse(localStorage.getItem(KEY_TASKS) || '[]');
  },

  saveTask: async (task: Task): Promise<void> => {
    const tasks = db.getTasks();
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(KEY_TASKS, JSON.stringify(tasks));
  },

  getSectors: (): Sector[] => {
    return JSON.parse(localStorage.getItem(KEY_SECTORS) || '[]');
  }
};