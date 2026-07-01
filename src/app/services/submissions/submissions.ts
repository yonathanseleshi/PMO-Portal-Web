import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AttachmentDownloadUrl,
  CreateAnySubmissionRequest,
  ReviewSubmissionRequest,
  Submission,
  SubmissionAttachment,
  SubmissionDetailResponse,
  SubmissionStatus,
  SubmissionType,
  UpdateSubmissionStatusRequest,
} from '../../models';

/** Filters accepted by the read/queue endpoints. */
export interface SubmissionQueueFilters {
  status?: SubmissionStatus | null;
  type?: SubmissionType | null;
  reviewer?: string | null;
  maxAgeDays?: number | null;
}

/**
 * SubmissionsService — typed access to the Wave 02 `/api/submissions` contract.
 *
 * Staged implementation (see {@link environment.useMockData}). Review/decision
 * business logic (assign reviewer, approve→create project, etc.) is intentionally
 * out of Wave 03 scope; only the contract-stable status transition is wired.
 */
@Injectable({ providedIn: 'root' })
export class SubmissionsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/submissions`;

  private mockSubmissions: Submission[] = [
    {
      id: 'b1000000-0000-4000-8000-000000000001',
      referenceNumber: 'SUB-2026-0615-0042',
      type: 'Intake',
      templateName: 'Project Intake',
      gateNumber: 1,
      projectId: null,
      approvedProjectId: null,
      projectTitle: 'Aviation Dept. Lease Management System',
      submitterName: 'David Miller',
      submitterEmail: 'david.miller@venturacounty.gov',
      submitterDepartment: 'Airports',
      submitterRole: 'Division Manager',
      description: 'Unified portal to manage airport hangar leases and tenant billing.',
      priority: 'Medium',
      estimatedBudget: 240000,
      serviceNowTicketNumber: 'INC0456712',
      preliminaryTier: 'Tier2',
      confirmedTier: null,
      fileName: 'aviation-intake.pdf',
      fileUrl: 'https://sharepoint.venturacounty.gov/teams/pmo/Submissions/SUB-2026-0615-0042.pdf',
      submittedAt: '2026-06-15T16:20:00Z',
      status: 'PendingReview',
      reviewedByEmail: null,
      reviewedAt: null,
      reviewNotes: null,
      returnedReason: null,
      createdAt: '2026-06-15T16:20:00Z',
      attachmentCount: 1,
    },
    {
      id: 'b1000000-0000-4000-8000-000000000002',
      referenceNumber: 'SUB-2026-0618-0091',
      type: 'Charter',
      templateName: 'Project Charter',
      gateNumber: 2,
      projectId: '8f2a1c00-0002-4a10-9a01-000000000002',
      approvedProjectId: '8f2a1c00-0002-4a10-9a01-000000000002',
      projectTitle: 'Animal Services License Portal',
      submitterName: 'Steve Alvarez',
      submitterEmail: 'steve.alvarez@venturacounty.gov',
      submitterDepartment: 'Animal Services',
      submitterRole: 'Project Manager',
      description: 'Charter for upgrading the public-facing animal licensing portal.',
      priority: 'High',
      estimatedBudget: 95000,
      serviceNowTicketNumber: null,
      preliminaryTier: 'Tier2',
      confirmedTier: 'Tier2',
      fileName: 'animal-services-charter.pdf',
      fileUrl: 'https://sharepoint.venturacounty.gov/teams/pmo/Submissions/SUB-2026-0618-0091.pdf',
      submittedAt: '2026-06-18T09:05:00Z',
      status: 'Approved',
      reviewedByEmail: 'joanna.pereira@venturacounty.gov',
      reviewedAt: '2026-06-19T14:00:00Z',
      reviewNotes: 'Charter complete; tier confirmed at Gate 2.',
      returnedReason: null,
      createdAt: '2026-06-18T09:05:00Z',
      attachmentCount: 2,
    },
    {
      id: 'b1000000-0000-4000-8000-000000000003',
      referenceNumber: 'SUB-2026-0622-0112',
      type: 'Closure',
      templateName: 'Project Closure',
      gateNumber: 5,
      projectId: '8f2a1c00-0004-4a10-9a01-000000000004',
      approvedProjectId: '8f2a1c00-0004-4a10-9a01-000000000004',
      projectTitle: 'Library RFID Cataloging Initiative',
      submitterName: 'Joanna Pereira',
      submitterEmail: 'joanna.pereira@venturacounty.gov',
      submitterDepartment: 'Library Services',
      submitterRole: 'Project Manager',
      description: 'Closure report for RFID tag implementation across County libraries.',
      priority: 'Low',
      estimatedBudget: 180000,
      serviceNowTicketNumber: null,
      preliminaryTier: 'Tier2',
      confirmedTier: 'Tier2',
      fileName: 'library-rfid-closure.pdf',
      fileUrl: 'https://sharepoint.venturacounty.gov/teams/pmo/Submissions/SUB-2026-0622-0112.pdf',
      submittedAt: '2026-06-22T11:40:00Z',
      status: 'UnderReview',
      reviewedByEmail: 'daniel.reyes@venturacounty.gov',
      reviewedAt: null,
      reviewNotes: null,
      returnedReason: null,
      createdAt: '2026-06-22T11:40:00Z',
      attachmentCount: 1,
    },
  ];

  /** GET /api/submissions — PMO queue (optionally filtered). */
  getSubmissions(filters?: SubmissionQueueFilters): Observable<Submission[]> {
    if (!environment.useMockData) {
      return this.http.get<Submission[]>(this.baseUrl, { params: this.toParams(filters) });
    }
    return of(this.applyFilters(this.mockSubmissions, filters));
  }

  /**
   * GET /api/submissions/queue — the triage queue with age-based prioritization.
   * Mirrors {@link getSubmissions} but hits the dedicated queue endpoint and
   * supports a `maxAgeDays` filter.
   */
  getQueue(filters?: SubmissionQueueFilters): Observable<Submission[]> {
    if (!environment.useMockData) {
      return this.http.get<Submission[]>(`${this.baseUrl}/queue`, { params: this.toParams(filters) });
    }
    const withAge = this.mockSubmissions.map((s) => ({ ...s, ageInDays: this.ageInDays(s.submittedAt) }));
    let result = this.applyFilters(withAge, filters);
    if (filters?.maxAgeDays != null) {
      result = result.filter((s) => (s.ageInDays ?? 0) <= filters.maxAgeDays!);
    }
    return of(result);
  }

  /** Build query params from the queue filters (omitting empty values). */
  private toParams(filters?: SubmissionQueueFilters): HttpParams {
    let params = new HttpParams();
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.type) params = params.set('type', filters.type);
    if (filters?.reviewer) params = params.set('reviewer', filters.reviewer);
    if (filters?.maxAgeDays != null) params = params.set('maxAgeDays', String(filters.maxAgeDays));
    return params;
  }

  /** Client-side filtering over the mock set (mirrors the server filters). */
  private applyFilters(source: Submission[], filters?: SubmissionQueueFilters): Submission[] {
    return source.filter((s) => {
      if (filters?.status && s.status !== filters.status) return false;
      if (filters?.type && s.type !== filters.type) return false;
      if (filters?.reviewer && s.assignedReviewerEmail !== filters.reviewer) return false;
      return true;
    });
  }

  private ageInDays(submittedAt: string): number {
    const ms = Date.now() - new Date(submittedAt).getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  }

  /** GET /api/submissions filtered by status (client-side over the mock set). */
  getSubmissionsByStatus(status: SubmissionStatus): Observable<Submission[]> {
    return of(this.mockSubmissions.filter((s) => s.status === status));
  }

  /** GET /api/submissions/{id}. */
  getSubmissionById(submissionId: string): Observable<Submission | undefined> {
    if (!environment.useMockData) {
      return this.http.get<Submission>(`${this.baseUrl}/${submissionId}`);
    }
    return of(this.mockSubmissions.find((s) => s.id === submissionId));
  }

  /**
   * Receipt of the most recently created submission, used by the confirmation
   * screen (PAGE-SUBMISSION-004) after a form is submitted. A signal so the
   * receipt page can read it without threading the value through navigation
   * state. Cleared after it is consumed.
   */
  private readonly lastCreated = signal<Submission | null>(null);
  readonly lastReceipt = this.lastCreated.asReadonly();

  /**
   * POST /api/submissions — create a native submission (Intake/Charter/Closure).
   *
   * Wave 04 builds the contract-aligned request and, in mock mode, fabricates a
   * server-shaped {@link Submission} (including a `SUB-{YYYY}-{MMDD}-{####}`
   * reference number) so the receipt and PMO queue can render. Wave 05 wires the
   * real POST plus attachment upload orchestration.
   */
  createSubmission(request: CreateAnySubmissionRequest): Observable<Submission> {
    if (!environment.useMockData) {
      // Route to the per-type endpoint (/submissions/{type-lowercase}); the API
      // accepts the composed envelope + detail payload.
      const url = `${this.baseUrl}/${request.type.toLowerCase()}`;
      return this.http.post<Submission>(url, request).pipe(tap((s) => this.lastCreated.set(s)));
    }

    const submission = this.buildMockSubmission(request);
    this.mockSubmissions = [submission, ...this.mockSubmissions];
    // Simulate a brief network round-trip so the form's pending state is visible.
    return of(submission).pipe(
      delay(450),
      tap((s) => this.lastCreated.set(s)),
    );
  }

  /** Consume + clear the stored receipt (call once the receipt page has read it). */
  consumeReceipt(): Submission | null {
    const receipt = this.lastCreated();
    this.lastCreated.set(null);
    return receipt;
  }

  private gateForType(type: SubmissionType): number {
    switch (type) {
      case 'Intake':
        return 1;
      case 'Charter':
        return 2;
      case 'Attestation':
        return 3;
      case 'Closure':
        return 5;
    }
  }

  /** Build a server-shaped Submission from a create request (mock mode only). */
  private buildMockSubmission(request: CreateAnySubmissionRequest): Submission {
    const now = new Date();
    return {
      id: `local-${now.getTime()}`,
      referenceNumber: this.generateReferenceNumber(now),
      type: request.type,
      templateName: request.templateName ?? null,
      gateNumber: request.gateNumber ?? this.gateForType(request.type),
      projectId: request.projectId ?? null,
      approvedProjectId: null,
      projectTitle: request.projectTitle ?? null,
      submitterName: request.submitterName ?? null,
      submitterEmail: request.submitterEmail ?? null,
      submitterDepartment: request.submitterDepartment ?? null,
      submitterRole: request.submitterRole ?? null,
      description: request.description ?? null,
      priority: request.priority ?? null,
      estimatedBudget: request.estimatedBudget ?? null,
      serviceNowTicketNumber: request.serviceNowTicketNumber ?? null,
      preliminaryTier: request.preliminaryTier ?? null,
      confirmedTier: null,
      fileName: request.fileName ?? null,
      fileUrl: null,
      submittedAt: now.toISOString(),
      status: 'PendingReview',
      reviewedByEmail: null,
      reviewedAt: null,
      reviewNotes: null,
      returnedReason: null,
      createdAt: now.toISOString(),
      attachmentCount: request.fileName ? 1 : 0,
    };
  }

  /** Mirrors the server format `SUB-{YYYY}-{MMDD}-{####}` (mock sequence). */
  private generateReferenceNumber(now: Date): string {
    const yyyy = now.getFullYear();
    const mmdd = `${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const seq = String((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) % 10000).padStart(4, '0');
    return `SUB-${yyyy}-${mmdd}-${seq}`;
  }

  /** PUT /api/submissions/{id}/status — contract-stable transition only. */
  updateSubmissionStatus(
    submissionId: string,
    request: UpdateSubmissionStatusRequest,
  ): Observable<Submission | undefined> {
    if (!environment.useMockData) {
      return this.http.put<Submission>(`${this.baseUrl}/${submissionId}/status`, request);
    }
    const submission = this.mockSubmissions.find((s) => s.id === submissionId);
    if (submission) {
      submission.status = request.status;
      submission.reviewNotes = request.reviewNotes ?? submission.reviewNotes;
      submission.returnedReason = request.returnedReason ?? submission.returnedReason;
    }
    return of(submission);
  }

  // --------------------------------------------------------------------------
  // Review & detail (Wave 05)
  // --------------------------------------------------------------------------

  /** POST /api/submissions/{id}/review — record a review decision. */
  reviewSubmission(submissionId: string, request: ReviewSubmissionRequest): Observable<Submission | undefined> {
    if (!environment.useMockData) {
      return this.http.post<Submission>(`${this.baseUrl}/${submissionId}/review`, request);
    }
    const submission = this.mockSubmissions.find((s) => s.id === submissionId);
    if (submission) {
      submission.status = request.decision;
      submission.reviewNotes = request.reviewNotes ?? submission.reviewNotes;
      submission.returnedReason = request.returnedReason ?? submission.returnedReason;
      submission.assignedReviewerEmail = request.assignedReviewerEmail ?? submission.assignedReviewerEmail;
      submission.reviewedAt = request.decision === 'UnderReview' ? submission.reviewedAt : new Date().toISOString();
    }
    return of(submission);
  }

  /** GET /api/submissions/{id}/detail — full submission + typed detail + attachments. */
  getSubmissionDetail(submissionId: string): Observable<SubmissionDetailResponse | undefined> {
    if (!environment.useMockData) {
      return this.http.get<SubmissionDetailResponse>(`${this.baseUrl}/${submissionId}/detail`);
    }
    const submission = this.mockSubmissions.find((s) => s.id === submissionId);
    if (!submission) return of(undefined);
    return of({ submission, attachments: this.mockAttachmentsFor(submission) });
  }

  // --------------------------------------------------------------------------
  // Attachments (Wave 05)
  // --------------------------------------------------------------------------

  /** GET /api/submissions/{id}/attachments. */
  getAttachments(submissionId: string): Observable<SubmissionAttachment[]> {
    if (!environment.useMockData) {
      return this.http.get<SubmissionAttachment[]>(`${this.baseUrl}/${submissionId}/attachments`);
    }
    const submission = this.mockSubmissions.find((s) => s.id === submissionId);
    return of(submission ? this.mockAttachmentsFor(submission) : []);
  }

  /**
   * POST /api/submissions/{id}/attachments/upload — multipart upload of a single
   * file (field name `file`, optional `documentType`).
   */
  uploadAttachment(
    submissionId: string,
    file: File,
    documentType?: string | null,
  ): Observable<SubmissionAttachment> {
    if (!environment.useMockData) {
      const form = new FormData();
      form.append('file', file, file.name);
      if (documentType) form.append('documentType', documentType);
      return this.http.post<SubmissionAttachment>(`${this.baseUrl}/${submissionId}/attachments/upload`, form);
    }
    const attachment: SubmissionAttachment = {
      id: `att-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      submissionId,
      fileName: file.name,
      contentType: file.type || null,
      fileSizeBytes: file.size,
      documentType: documentType ?? null,
      uploadedByEmail: null,
      uploadedAt: new Date().toISOString(),
      uploadStatus: 'Completed',
      isActive: true,
    };
    return of(attachment).pipe(delay(200));
  }

  /** GET /api/submissions/{id}/attachments/{attachmentId}/download-url. */
  getAttachmentDownloadUrl(submissionId: string, attachmentId: string): Observable<AttachmentDownloadUrl> {
    if (!environment.useMockData) {
      return this.http.get<AttachmentDownloadUrl>(
        `${this.baseUrl}/${submissionId}/attachments/${attachmentId}/download-url`,
      );
    }
    return of({
      url: `https://sharepoint.venturacounty.gov/teams/pmo/Submissions/${attachmentId}`,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    }).pipe(delay(150));
  }

  /** Fabricate contract-shaped attachment metadata for a mock submission. */
  private mockAttachmentsFor(submission: Submission): SubmissionAttachment[] {
    if (!submission.attachmentCount) return [];
    return Array.from({ length: submission.attachmentCount }, (_, i) => ({
      id: `${submission.id}-att-${i + 1}`,
      submissionId: submission.id,
      fileName: submission.fileName ?? `${submission.referenceNumber}-${i + 1}.pdf`,
      contentType: 'application/pdf',
      fileSizeBytes: 128000,
      documentType: submission.type,
      uploadedByEmail: submission.submitterEmail,
      uploadedAt: submission.submittedAt,
      uploadStatus: 'Completed',
      isActive: true,
    }));
  }
}
