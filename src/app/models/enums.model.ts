/**
 * Domain enumerations for the PMO Portal frontend.
 *
 * These are the authoritative typed mirrors of the Wave 02 backend enums
 * (`Models/Enums.cs`). The .NET API serializes enums as their member NAME
 * (via `JsonStringEnumConverter`), so every value below matches the exact
 * string the API emits/accepts. Treat this file as the single source of truth
 * for governance status vocabulary on the client.
 */

// --- Identity & Access -----------------------------------------------------

/** Backend portal role vocabulary (`PortalRole`). */
export type PortalRole =
  | 'Unauthenticated'
  | 'ReadOnly'
  | 'ProjectManager'
  | 'GovernanceBoard'
  | 'PMOAnalyst'
  | 'PMOLead';

/** How a RoleAssignment was derived (`RoleSource`). */
export type RoleSource = 'Inferred' | 'Explicit' | 'EntraGroup' | 'ProjectOwnership';

// --- Portfolio & Projects --------------------------------------------------

export type ProjectTier = 'Tier1' | 'Tier2' | 'Tier3';

export type ProjectPhase =
  | 'Intake'
  | 'Initiation'
  | 'Planning'
  | 'Execution'
  | 'ReleaseReadiness'
  | 'Closure'
  | 'Closed';

/** Project-level rollup of the active gate state (`ProjectGateStatusValue`). */
export type ProjectGateStatusValue =
  | 'NotStarted'
  | 'PendingReview'
  | 'UnderReview'
  | 'Approved'
  | 'Returned'
  | 'Deferred'
  | 'Rejected'
  | 'Closed';

/** RAG health vocabulary (`HealthRag`). Note: backend uses "Yellow", not "Amber". */
export type HealthRag = 'Green' | 'Yellow' | 'Red';

export type ProjectStatus = 'Upcoming' | 'Active' | 'OnHold' | 'Completed' | 'Cancelled';

/** Origin of a ProjectHealthSnapshot data point (`HealthSnapshotSource`). */
export type HealthSnapshotSource = 'StatusReport' | 'ManualUpdate' | 'GateReview' | 'System';

// --- Governance Lifecycle --------------------------------------------------

/** Per-project status of an individual governance gate (`GateStatus`). */
export type GateStatus =
  | 'NotStarted'
  | 'PendingSubmission'
  | 'Submitted'
  | 'UnderReview'
  | 'Approved'
  | 'Returned'
  | 'Deferred'
  | 'Rejected'
  | 'Skipped';

/** Formal decision recorded against a gate review (`GateDecision`). */
export type GateDecision =
  | 'Approve'
  | 'ApproveWithConditions'
  | 'Defer'
  | 'Reject'
  | 'Go'
  | 'NoGo'
  | 'Accept'
  | 'AcceptWithExceptions'
  | 'HoldClosure';

// --- Submissions & Forms ---------------------------------------------------

export type SubmissionType = 'Intake' | 'Charter' | 'Attestation' | 'Closure';

export type SubmissionStatus =
  | 'PendingReview'
  | 'UnderReview'
  | 'Approved'
  | 'Returned'
  | 'Deferred'
  | 'Rejected';

export type ClosureOutcome = 'Successful' | 'PartiallySuccessful' | 'Cancelled' | 'OnHold';

// ---------------------------------------------------------------------------
// Display helpers (UI-only; do not change the wire values above)
// ---------------------------------------------------------------------------

/** Human-readable tier labels. */
export const TIER_LABELS: Record<ProjectTier, string> = {
  Tier1: 'Tier 1',
  Tier2: 'Tier 2',
  Tier3: 'Tier 3',
};

/** Human-readable phase labels. */
export const PHASE_LABELS: Record<ProjectPhase, string> = {
  Intake: 'Intake',
  Initiation: 'Initiation',
  Planning: 'Planning',
  Execution: 'Execution',
  ReleaseReadiness: 'Release Readiness',
  Closure: 'Closure',
  Closed: 'Closed',
};

/** Maps a backend HealthRag value to the design-system badge tone. */
export const RAG_TONE: Record<HealthRag, 'success' | 'warning' | 'danger'> = {
  Green: 'success',
  Yellow: 'warning',
  Red: 'danger',
};

/** Human-readable submission type labels. */
export const SUBMISSION_TYPE_LABELS: Record<SubmissionType, string> = {
  Intake: 'Intake',
  Charter: 'Charter',
  Attestation: 'Planning Complete Attestation',
  Closure: 'Closure',
};

/** Human-readable submission status labels (governance vocabulary). */
export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  PendingReview: 'Pending Review',
  UnderReview: 'Under Review',
  Approved: 'Approved',
  Returned: 'Returned',
  Deferred: 'Deferred',
  Rejected: 'Rejected',
};

/** Maps a submission status to the design-system badge tone. */
export const SUBMISSION_STATUS_TONE: Record<SubmissionStatus, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
  PendingReview: 'warning',
  UnderReview: 'info',
  Approved: 'success',
  Returned: 'danger',
  Deferred: 'default',
  Rejected: 'danger',
};
