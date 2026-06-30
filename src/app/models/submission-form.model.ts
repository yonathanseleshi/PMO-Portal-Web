import { ClosureOutcome, ProjectTier, SubmissionType } from './enums.model';

/**
 * Submission form payloads — frontend mirrors of the Wave 02 backend contracts.
 *
 * The shared envelope ({@link CreateSubmissionRequest}) mirrors the .NET
 * `CreateSubmissionRequest` DTO exactly. The per-gate detail payloads mirror the
 * Wave 02 detail entities (`IntakeSubmissionDetail`, `CharterSubmissionDetail`,
 * `ClosureSubmissionDetail`). Wave 02 does not yet expose a combined create DTO
 * carrying the detail fields, so the composed `Create*SubmissionRequest`
 * interfaces below are the stable, backend-aligned shapes Wave 05 will bind to.
 *
 * Field names use the camelCase form the API emits/accepts via
 * `JsonStringEnumConverter` + default System.Text.Json camelCasing.
 */

// --- Shared envelope (mirror of CreateSubmissionRequest DTO) ----------------

export interface CreateSubmissionRequest {
  type: SubmissionType;
  templateId?: string | null;
  templateName?: string | null;
  gateNumber?: number | null;
  projectId?: string | null;
  projectTitle?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
  submitterDepartment?: string | null;
  submitterRole?: string | null;
  description?: string | null;
  priority?: string | null;
  estimatedBudget?: number | null;
  serviceNowTicketNumber?: string | null;
  autoTriggerIndicators?: string | null;
  preliminaryTier?: ProjectTier | null;
  fileName?: string | null;
  fileUrl?: string | null;
}

// --- Gate 1 Intake detail (mirror of IntakeSubmissionDetail) ----------------

export interface IntakeSubmissionDetailRequest {
  businessNeed?: string | null;
  objectives?: string | null;
  inScope?: string | null;
  outOfScope?: string | null;
  expectedBenefits?: string | null;
  knownRisks?: string | null;
  constraints?: string | null;
  dependencies?: string | null;
  targetStartDate?: string | null;
  targetEndDate?: string | null;
  resourceNotes?: string | null;
  autoTriggerNotes?: string | null;
  expectedCharterNeeds?: string | null;
  sponsorName?: string | null;
  sponsorEmail?: string | null;
  sponsorAcknowledged?: boolean;
}

// --- Gate 2 Charter detail (mirror of CharterSubmissionDetail) --------------

export interface CharterSubmissionDetailRequest {
  projectId?: string | null;
  purpose?: string | null;
  background?: string | null;
  objectives?: string | null;
  successCriteria?: string | null;
  inScope?: string | null;
  outOfScope?: string | null;
  majorDeliverables?: string | null;
  governanceStructure?: string | null;
  assumptions?: string | null;
  constraints?: string | null;
  risks?: string | null;
  dependencies?: string | null;
  resourceRequirements?: string | null;
  romLow?: number | null;
  romLikely?: number | null;
  romHigh?: number | null;
  fundingSource?: string | null;
  fundingStatus?: string | null;
  timelineSummary?: string | null;
  businessJustification?: string | null;
  feasibilityNotes?: string | null;
  tierChanged?: boolean;
  governanceNotes?: string | null;
}

// --- Gate 5 Closure detail (mirror of ClosureSubmissionDetail) --------------

export interface ClosureSubmissionDetailRequest {
  projectId?: string | null;
  projectOutcome?: ClosureOutcome;
  outcomeDescription?: string | null;
  acceptanceSummary?: string | null;
  operationsTransitionSummary?: string | null;
  benefitsRealizationPlanUrl?: string | null;
  finalSpend?: number | null;
  budgetVariance?: number | null;
  contractCloseoutNotes?: string | null;
  lessonsLearned?: string | null;
  repositoryComplete?: boolean;
  closureRecommendation?: string | null;
}

// --- Composed create requests (envelope + detail) ---------------------------

export interface CreateIntakeSubmissionRequest extends CreateSubmissionRequest {
  type: 'Intake';
  detail: IntakeSubmissionDetailRequest;
}

export interface CreateCharterSubmissionRequest extends CreateSubmissionRequest {
  type: 'Charter';
  detail: CharterSubmissionDetailRequest;
}

export interface CreateClosureSubmissionRequest extends CreateSubmissionRequest {
  type: 'Closure';
  detail: ClosureSubmissionDetailRequest;
}

export type CreateAnySubmissionRequest =
  | CreateIntakeSubmissionRequest
  | CreateCharterSubmissionRequest
  | CreateClosureSubmissionRequest;

// --- Tier Calculator (frontend-only; mirrors TierTrigger / TierDefinition) --

/** A governance trigger question shown in the Tier Calculator. */
export interface TierTriggerOption {
  key: string;
  label: string;
  description: string;
}

/** Output of the Tier Calculator. The PMO confirms the official tier. */
export interface TierRecommendation {
  tier: ProjectTier;
  title: string;
  explanation: string;
  firedTriggers: string[];
}
