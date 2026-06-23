export interface Project {
  id: string;
  name: string;
  description: string;
  manager: string;
  tier: 1 | 2 | 3;
  phase: 'G1' | 'G2' | 'G3' | 'G4' | 'G5';
  status: 'Approved' | 'In Review' | 'Deferred' | 'Returned' | 'On Track' | 'At Risk' | 'Critical';
  ragStatus: 'Green' | 'Amber' | 'Red';
  lastStatusReportDate: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  subprojects: string[];
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  date: string;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Delayed';
}

export interface StatusReport {
  id: string;
  projectId: string;
  reportDate: string;
  overallStatus: string;
  summary: string;
  keyAchievements: string[];
  nextSteps: string[];
  issues: string[];
}

export interface Submission {
  id: string;
  projectName: string;
  type: 'Intake' | 'Charter' | 'Closure';
  submittedBy: string;
  submissionDate: string;
  status: 'Pending' | 'Approved' | 'Returned';
  details: string;
  price?: number;
}

export interface ProjectHealthSnapshot {
  id: string;
  projectId: string;
  timestamp: string;
  metric: string;
  value: number;
}

export interface UserSession {
  username: string;
  role: 'pmo' | 'pm';
}
