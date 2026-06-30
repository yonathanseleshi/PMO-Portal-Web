import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Submission, SubmissionStatus, UpdateSubmissionStatusRequest } from '../../models';

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

  private readonly mockSubmissions: Submission[] = [
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

  /** GET /api/submissions — PMO queue. */
  getSubmissions(): Observable<Submission[]> {
    if (!environment.useMockData) {
      return this.http.get<Submission[]>(this.baseUrl);
    }
    return of(this.mockSubmissions);
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
}
