/**
 * Shared domain model types for the data-access services
 * (ProjectsService, SubmissionsService, TemplatesService).
 *
 * These describe the richer governance domain consumed by the registry /
 * templates / submissions feature waves. They are intentionally separate from
 * the prototype shapes in `models/pmo.model.ts`, which back the current
 * dashboard prototype screens.
 */

export type Rag = 'Green' | 'Yellow' | 'Red';
export type Tier = 'T1' | 'T2' | 'T3';
export type ProjectPhase = 'Execute' | 'Plan' | 'Monitor' | 'Closed';

export interface Project {
  id: string;
  name: string;
  pmName: string;
  pmEmail: string;
  sponsor: string;
  dcio?: string;
  division: string;
  tier: Tier;
  phase: ProjectPhase;
  projectStatus: string;
  gateStatus: string;
  scheduleRag: Rag;
  scopeRag: Rag;
  budgetRag: Rag;
  resourcesRag: Rag;
  overallRag: Rag;
  daysInPhase: number;
  statusCadence: string;
  nextStatusReportDueDate: string;
  lastStatusReportDate: string;
  lastUpdated: string;
  lastUpdatedBy: string;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  targetDate: string;
  completedDate?: string;
  status: 'Completed' | 'In Progress' | 'Not Started' | 'Delayed';
  owner: string;
}

export interface RaidItem {
  id: string;
  projectId: string;
  type: 'Risk' | 'Assumption' | 'Issue' | 'Dependency';
  title: string;
  description: string;
  owner: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Closed';
  createdDate: string;
  lastUpdated: string;
}

export interface StatusReport {
  id: string;
  projectId: string;
  projectName: string;
  reportingPeriod: string;
  submittedDate: string;
  submittedBy: string;
  overallStatus: Rag;
  scheduleStatus: Rag;
  scopeStatus: Rag;
  budgetStatus: Rag;
  resourcesStatus: Rag;
  summary: string;
  highlights: string[];
  risks: string[];
  issues: string[];
  nextSteps: string[];
}

export interface PortfolioHealth {
  totalProjects: number;
  projectsByTier: Record<Tier, number>;
  projectsByRag: Record<Rag, number>;
  projectsByPhase: Record<ProjectPhase, number>;
}

export type SubmissionStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Returned'
  | 'Rejected';

export interface Submission {
  id: string;
  referenceNumber: string;
  templateId: string;
  templateName: string;
  submissionType: string;
  submittedBy: string;
  submittedByEmail: string;
  submittedDate: string;
  projectId: string;
  projectName: string;
  status: SubmissionStatus;
  documentUrl: string;
  lastUpdated: string;
  notes?: string;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  version: string;
  lastUpdated: string;
  gate?: string;
  tierApplicability: string;
  description: string;
  templateUrl: string;
  instructionsUrl: string;
  submitEnabled: boolean;
  generatedByPmo?: boolean;
  availableActions?: string[];
}
