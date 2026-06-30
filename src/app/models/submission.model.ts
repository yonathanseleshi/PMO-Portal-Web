import { ProjectTier, SubmissionStatus, SubmissionType } from './enums.model';

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
}

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
}

/** Status-safe review transition payload — mirror of `UpdateSubmissionStatusRequest`. */
export interface UpdateSubmissionStatusRequest {
  status: SubmissionStatus;
  reviewNotes?: string | null;
  returnedReason?: string | null;
}
