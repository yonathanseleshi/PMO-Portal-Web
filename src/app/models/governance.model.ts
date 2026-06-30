import { GateDecision, GateStatus } from './enums.model';

/**
 * ProjectGateStatus — frontend mirror of the Wave 02 `ProjectGateStatusResponse`
 * DTO. A project is seeded with five gate-status rows (G1–G5) on creation
 * (Wave 02 summary §2.5), so the governance stepper always has data to read.
 */
export interface ProjectGateStatus {
  id: string;
  projectId: string;
  gateId: string;
  gateNumber: number;
  gateCode?: string | null;
  gateName?: string | null;
  status: GateStatus;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  decisionAt?: string | null;
  decision?: GateDecision | null;
  decisionByEmail?: string | null;
  decisionNotes?: string | null;
  gateDecisionRecordReferenceId?: string | null;
  evidenceUrl?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

/** Baseline gate update payload — mirror of `UpdateProjectGateStatusRequest`. */
export interface UpdateProjectGateStatusRequest {
  status: GateStatus;
  decision?: GateDecision | null;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  decisionAt?: string | null;
  decisionByEmail?: string | null;
  decisionNotes?: string | null;
  gateDecisionRecordReferenceId?: string | null;
  evidenceUrl?: string | null;
}
