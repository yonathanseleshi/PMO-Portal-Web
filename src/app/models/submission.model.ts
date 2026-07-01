import { ClosureOutcome, ProjectTier, SubmissionStatus, SubmissionType } from './enums.model';

/**
 * Submission — frontend mirror of the Wave 02 `SubmissionResponse` DTO.
 *
 * Reference numbers follow the server-generated `SUB-{YYYY}-{MMDD}-{####}`
 * format. The form-detail subtypes (Intake/Charter/Closure) are loaded
 * separately in later waves; only the shared envelope is modeled here.
 */
export interface Submission {
  id: string;
  referenceNumber: string;
  type: SubmissionType;
  templateName?: string | null;
  gateNumber?: number | null;
  projectId?: string | null;
  approvedProjectId?: string | null;
  projectTitle?: string | null;
  submitterName?: string | null;
  submitterEmail?: string | null;
  submitterDepartment?: string | null;
  submitterRole?: string | null;
  description?: string | null;
  priority?: string | null;
  estimatedBudget?: number | null;
  serviceNowTicketNumber?: string | null;
  preliminaryTier?: ProjectTier | null;
  confirmedTier?: ProjectTier | null;
  fileName?: string | null;
  fileUrl?: string | null;
  submittedAt: string;
  status: SubmissionStatus;
  reviewedByEmail?: string | null;
  reviewedAt?: string | null;
  reviewNotes?: string | null;
  returnedReason?: string | null;
  createdAt: string;
  attachmentCount: number;
  /** Reviewer assigned to triage/decide this submission (Wave 05). */
  assignedReviewerEmail?: string | null;
  /** Server-computed age of the submission in days (queue prioritization). */
  ageInDays?: number | null;
}

/**
 * SubmissionResponse — alias for the read/queue/review DTO the API returns.
 * Structurally identical to {@link Submission}; kept as a named type so service
 * signatures read against the contract vocabulary.
 */
export type SubmissionResponse = Submission;

/** Submission attachment metadata — mirror of `AttachmentResponse`. */
export interface SubmissionAttachment {
  id: string;
  submissionId: string;
  fileName: string;
  fileUrl?: string | null;
  contentType?: string | null;
  fileSizeBytes?: number | null;
  sharePointItemId?: string | null;
  documentType?: string | null;
  uploadedByEmail?: string | null;
  uploadedAt: string;
  /** S3 storage metadata (Wave 05 attachment pipeline). */
  s3ObjectKey?: string | null;
  s3BucketName?: string | null;
  s3Region?: string | null;
  storedFileName?: string | null;
  uploadStatus?: string | null;
  isActive?: boolean | null;
}

/** Alias for the attachment DTO the API returns. */
export type AttachmentResponse = SubmissionAttachment;

/** Presigned download descriptor — mirror of the download-url endpoint payload. */
export interface AttachmentDownloadUrl {
  url: string;
  expiresAt: string;
}

/** Status-safe review transition payload — mirror of `UpdateSubmissionStatusRequest`. */
export interface UpdateSubmissionStatusRequest {
  status: SubmissionStatus;
  reviewNotes?: string | null;
  returnedReason?: string | null;
}

/**
 * Review decision payload — mirror of `ReviewSubmissionRequest`.
 *
 * `decision` carries the target status (Under Review / Approved / Returned /
 * Deferred / Rejected). `PendingReview` is never a review outcome.
 */
export interface ReviewSubmissionRequest {
  decision: SubmissionStatus;
  reviewNotes?: string | null;
  returnedReason?: string | null;
  assignedReviewerEmail?: string | null;
}

// --- Typed detail responses (mirror of SubmissionDetailResponse) ------------

/** Fields common to every reviewed detail record. */
export interface SubmissionReviewFields {
  reviewedBy?: string | null;
  reviewDate?: string | null;
  decision?: string | null;
  reviewerNotes?: string | null;
}

export interface IntakeSubmissionDetailResponse {
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
  sponsorAcknowledged?: boolean | null;
}

export interface CharterSubmissionDetailResponse {
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
  tierChanged?: boolean | null;
  governanceNotes?: string | null;
}

export interface ClosureSubmissionDetailResponse {
  projectId?: string | null;
  projectOutcome?: ClosureOutcome | null;
  outcomeDescription?: string | null;
  acceptanceSummary?: string | null;
  operationsTransitionSummary?: string | null;
  benefitsRealizationPlanUrl?: string | null;
  finalSpend?: number | null;
  budgetVariance?: number | null;
  contractCloseoutNotes?: string | null;
  lessonsLearned?: string | null;
  repositoryComplete?: boolean | null;
  closureRecommendation?: string | null;
}

/** Attestation detail + review/decision fields returned by the API. */
export interface AttestationSubmissionDetailResponse extends SubmissionReviewFields {
  projectId?: string | null;
  projectName?: string | null;
  projectTier?: ProjectTier | null;
  department?: string | null;
  division?: string | null;
  executiveSponsor?: string | null;
  pmName?: string | null;
  pmEmail?: string | null;
  submissionDate?: string | null;
  methodology?: string | null;
  planningToolsUsed?: string | null;
  planningArtifactsSummary?: string | null;
  readinessSummary?: string | null;
  notesToPmo?: string | null;
  pmAttestationConfirmed?: boolean | null;
  pmSignatureName?: string | null;
  pmSignatureDate?: string | null;
  gate3ReferenceNumber?: string | null;
  pmoLead?: string | null;
}

/** Full submission detail bundle — mirror of `SubmissionDetailResponse`. */
export interface SubmissionDetailResponse {
  submission: Submission;
  intakeDetail?: IntakeSubmissionDetailResponse | null;
  charterDetail?: CharterSubmissionDetailResponse | null;
  closureDetail?: ClosureSubmissionDetailResponse | null;
  attestationDetail?: AttestationSubmissionDetailResponse | null;
  attachments: SubmissionAttachment[];
}
