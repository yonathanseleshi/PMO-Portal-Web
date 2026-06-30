import { HealthRag } from './enums.model';

/**
 * StatusReport — frontend mirror of the Wave 02 `StatusReportResponse` DTO.
 *
 * Submitting a status report writes a `ProjectHealthSnapshot` and updates the
 * project's `lastStatusReportDate` on the server (see Wave 02 summary §2.5);
 * the report itself does not auto-overwrite the project's current RAG.
 */
export interface StatusReport {
  id: string;
  projectId: string;
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  reportDate: string;
  overallRag: HealthRag;
  scheduleRag?: HealthRag | null;
  budgetRag?: HealthRag | null;
  scopeRag?: HealthRag | null;
  accomplishments?: string | null;
  nextSteps?: string | null;
  openIssues?: string | null;
  decisionsMade?: string | null;
  requestedPmoSupport?: string | null;
  submittedByEmail?: string | null;
  submittedAt: string;
  createdAt: string;
}

/** Request body for submitting a status report — mirror of `CreateStatusReportRequest`. */
export interface CreateStatusReportRequest {
  projectId: string;
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  reportDate: string;
  overallRag: HealthRag;
  scheduleRag?: HealthRag | null;
  budgetRag?: HealthRag | null;
  scopeRag?: HealthRag | null;
  accomplishments?: string | null;
  nextSteps?: string | null;
  openIssues?: string | null;
  decisionsMade?: string | null;
  requestedPmoSupport?: string | null;
}
