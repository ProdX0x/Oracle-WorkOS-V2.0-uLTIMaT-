export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN', // Yoda
  ADMIN = 'ADMIN',             // Jedi
  MEMBER = 'MEMBER',           // Padawan
  VISITOR = 'VISITOR'          // Observer
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  sectorId?: string;
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE'
}

export enum HelpStatus {
  NONE = 'NONE',
  OPEN = 'OPEN', // SOS
  TARGETED = 'TARGETED'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  sectorId: string;
  assigneeId?: string;
  helpStatus: HelpStatus;
  impactScore?: number; // 0-100
  effortScore?: number; // 0-10
  strategicTheme?: string;
  aiRationale?: string;
  isSystemTask?: boolean; // For Auto-Evolution
  progress?: number; // For system tasks
}

export interface Sector {
  id: string;
  name: string;
  color: string; // Tailwind color class helper
  managerId?: string;
}

export interface SystemConfig {
  isInitialized: boolean;
  version: string;
}