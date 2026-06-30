import {
  HealthRag,
  HealthSnapshotSource,
  ProjectGateStatusValue,
  ProjectPhase,
  ProjectStatus,
  ProjectTier,
} from './enums.model';

/**
 * Project — frontend mirror of the Wave 02 `ProjectResponse` DTO.
 *
 * Field names and types follow the API's camelCase JSON contract exactly so a
 * service can swap mock data for `HttpClient` without any reshaping. Surrogate
 * keys are GUID strings; date fields are ISO-8601 strings as serialized by the
 * API.
 */
export interface Project {
  id: string;
  projectCode?: string | null;
  projectName: string;
  description?: string | null;
  department?: string | null;
  division?: string | null;
  sponsorName?: string | null;
  sponsorEmail?: string | null;
  projectManagerName?: string | null;
  projectManagerEmail?: string | null;
  dcioName?: string | null;
  tier: ProjectTier;
  phase: ProjectPhase;
  gateStatus: ProjectGateStatusValue;
  activeGate?: number | null;
  healthRag: HealthRag;
  healthNarrative?: string | null;
  status: ProjectStatus;
  daysInPhase: number;
  lastStatusReportDate?: string | null;
  nextStatusReportDueDate?: string | null;
  createdAt: string;
  createdByEmail?: string | null;
  updatedAt?: string | null;
  updatedByEmail?: string | null;
}

/** Lightweight registry/list row — mirror of `ProjectListItemResponse`. */
export interface ProjectListItem {
  id: string;
  projectCode?: string | null;
  projectName: string;
  projectManagerName?: string | null;
  division?: string | null;
  tier: ProjectTier;
  phase: ProjectPhase;
  gateStatus: ProjectGateStatusValue;
  healthRag: HealthRag;
  status: ProjectStatus;
  daysInPhase: number;
  lastStatusReportDate?: string | null;
}

/** Mirror of the Wave 02 `ProjectHealthSnapshot` entity. */
export interface ProjectHealthSnapshot {
  id: string;
  projectId: string;
  capturedAt: string;
  overallRag: HealthRag;
  scheduleRag?: HealthRag | null;
  budgetRag?: HealthRag | null;
  scopeRag?: HealthRag | null;
  narrative?: string | null;
  source: HealthSnapshotSource;
  createdByEmail?: string | null;
}

/** Request body for creating a project (mirror of `CreateProjectRequest`). */
export interface CreateProjectRequest {
  projectName: string;
  projectCode?: string | null;
  description?: string | null;
  department?: string | null;
  division?: string | null;
  sponsorName?: string | null;
  sponsorEmail?: string | null;
  projectManagerName?: string | null;
  projectManagerEmail?: string | null;
  dcioName?: string | null;
  tier?: ProjectTier;
  phase?: ProjectPhase;
  status?: ProjectStatus;
  healthRag?: HealthRag;
  healthNarrative?: string | null;
}
