import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateStatusReportRequest, StatusReport } from '../../models';

/**
 * StatusReportService — typed access to the Wave 02 `/api/status-reports`
 * contract (scoped by `projectId`).
 *
 * Staged implementation (see {@link environment.useMockData}). Cadence/overdue
 * computation and RAG auto-rollup are deferred to later waves; this service
 * only exposes the contract-stable list/detail/create shapes.
 */
@Injectable({ providedIn: 'root' })
export class StatusReportService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/status-reports`;

  private readonly mockReports: StatusReport[] = [
    {
      id: 'c2000000-0000-4000-8000-000000000001',
      projectId: '8f2a1c00-0001-4a10-9a01-000000000001',
      reportingPeriodStart: '2026-06-01',
      reportingPeriodEnd: '2026-06-15',
      reportDate: '2026-06-15',
      overallRag: 'Green',
      scheduleRag: 'Green',
      budgetRag: 'Green',
      scopeRag: 'Green',
      accomplishments: 'Assessor Office migrated; pilot training complete.',
      nextSteps: 'Schedule mass migration for Public Works.',
      openIssues: 'None reported.',
      decisionsMade: 'Confirmed Phase 2 cutover window.',
      requestedPmoSupport: null,
      submittedByEmail: 'joanna.pereira@venturacounty.gov',
      submittedAt: '2026-06-15T17:00:00Z',
      createdAt: '2026-06-15T17:00:00Z',
    },
    {
      id: 'c2000000-0000-4000-8000-000000000002',
      projectId: '8f2a1c00-0002-4a10-9a01-000000000002',
      reportingPeriodStart: '2026-06-06',
      reportingPeriodEnd: '2026-06-20',
      reportDate: '2026-06-20',
      overallRag: 'Yellow',
      scheduleRag: 'Yellow',
      budgetRag: 'Green',
      scopeRag: 'Green',
      accomplishments: 'Hardware specs finalized; site audits concluded.',
      nextSteps: 'Receive initial dual-pump controllers; begin lab testing.',
      openIssues: 'Hardware delivery delayed by supply-chain backlog.',
      decisionsMade: 'Adjusted integration timeline by three weeks.',
      requestedPmoSupport: 'Escalation support for vendor delivery.',
      submittedByEmail: 'daniel.reyes@venturacounty.gov',
      submittedAt: '2026-06-20T15:30:00Z',
      createdAt: '2026-06-20T15:30:00Z',
    },
  ];

  /** GET /api/status-reports?projectId=... — report history for a project. */
  getStatusReports(projectId: string): Observable<StatusReport[]> {
    if (!environment.useMockData) {
      return this.http.get<StatusReport[]>(this.baseUrl, { params: { projectId } });
    }
    return of(this.mockReports.filter((r) => r.projectId === projectId));
  }

  /** GET /api/status-reports/{id}. */
  getStatusReportById(statusReportId: string): Observable<StatusReport | undefined> {
    if (!environment.useMockData) {
      return this.http.get<StatusReport>(`${this.baseUrl}/${statusReportId}`);
    }
    return of(this.mockReports.find((r) => r.id === statusReportId));
  }

  /** Most recent report for a project (helper for detail/registry previews). */
  getLatestStatusReport(projectId: string): Observable<StatusReport | undefined> {
    const reports = this.mockReports
      .filter((r) => r.projectId === projectId)
      .sort((a, b) => b.reportDate.localeCompare(a.reportDate));
    return of(reports[0]);
  }

  /** POST /api/status-reports — create (write path, contract-stable). */
  createStatusReport(request: CreateStatusReportRequest): Observable<StatusReport> {
    if (!environment.useMockData) {
      return this.http.post<StatusReport>(this.baseUrl, request);
    }
    const created: StatusReport = {
      id: `c2000000-0000-4000-8000-${Date.now().toString().slice(-12)}`,
      ...request,
      submittedByEmail: null,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    return of(created);
  }
}
