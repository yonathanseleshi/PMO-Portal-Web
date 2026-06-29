import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Submission, SubmissionStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SubmissionsService {
  private mockSubmissions: Submission[] = [
    {
      id: 'sub-001',
      referenceNumber: 'SUB-2026-0515-0001',
      templateId: 'PMO-TPL-001',
      templateName: 'Project Intake',
      submissionType: 'Intake',
      submittedBy: 'Jane Rodriguez',
      submittedByEmail: 'jane.rodriguez@venturacounty.gov',
      submittedDate: '2026-05-15',
      projectId: 'proj-001',
      projectName: 'Infrastructure Modernization',
      status: 'Approved',
      documentUrl:
          'https://sharepoint.venturacounty.gov/teams/pmo/Submissions/SUB-2026-0515-0001.pdf',
      lastUpdated: '2026-05-16',
      notes: 'Tier 1 classification confirmed at Gate 1 approval.'
    },
    {
      id: 'sub-002',
      referenceNumber: 'SUB-2026-0512-0002',
      templateId: 'PMO-TPL-002',
      templateName: 'Project Charter',
      submissionType: 'Project Charter',
      submittedBy: 'Jane Rodriguez',
      submittedByEmail: 'jane.rodriguez@venturacounty.gov',
      submittedDate: '2026-05-12',
      projectId: 'proj-002',
      projectName: 'HR System Implementation',
      status: 'Under Review',
      documentUrl:
          'https://sharepoint.venturacounty.gov/teams/pmo/Submissions/SUB-2026-0512-0002.pdf',
      lastUpdated: '2026-05-18'
    },
    {
      id: 'sub-003',
      referenceNumber: 'SUB-2026-0510-0003',
      templateId: 'PMO-TPL-001',
      templateName: 'Project Intake',
      submissionType: 'Intake',
      submittedBy: 'Michael Chen',
      submittedByEmail: 'michael.chen@venturacounty.gov',
      submittedDate: '2026-05-10',
      projectId: 'proj-003',
      projectName: 'Portal Enhancement Phase 2',
      status: 'Approved',
      documentUrl:
          'https://sharepoint.venturacounty.gov/teams/pmo/Submissions/SUB-2026-0510-0003.pdf',
      lastUpdated: '2026-05-11'
    }
  ];

  /**
   * Get all submissions (PMO only)
   */
  getSubmissions(): Observable<Submission[]> {
    // TODO(api): Replace with HttpClient GET /api/submissions
    return of(this.mockSubmissions);
  }

  /**
   * Get submissions by status
   */
  getSubmissionsByStatus(status: SubmissionStatus): Observable<Submission[]> {
    const filtered = this.mockSubmissions.filter((s) => s.status === status);
    return of(filtered);
  }

  /**
   * Get submission by reference number
   */
  getSubmissionByRef(refNumber: string): Observable<Submission | undefined> {
    const submission = this.mockSubmissions.find((s) => s.referenceNumber === refNumber);
    return of(submission);
  }

  /**
   * API-aligned submission lookup
   */
  getSubmissionById(submissionId: string): Observable<Submission | undefined> {
    // TODO(api): Replace with HttpClient GET /api/submissions/{submissionId}
    const submission = this.mockSubmissions.find((s) => s.id === submissionId);
    return of(submission);
  }

  /**
   * Update submission status (mock)
   */
  updateSubmissionStatus(
      submissionId: string,
      status: SubmissionStatus,
      notes?: string
  ): Observable<Submission | undefined> {
    const submission = this.mockSubmissions.find((s) => s.id === submissionId);
    if (submission) {
      submission.status = status;
      if (notes) {
        submission.notes = notes;
      }
      submission.lastUpdated = new Date().toISOString().split('T')[0];
    }
    return of(submission);
  }
}
