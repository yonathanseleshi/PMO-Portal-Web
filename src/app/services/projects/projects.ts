import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project, ProjectListItem } from '../../models';
import { PortfolioHealth, ProjectRegistryKpis } from '../models';

/**
 * ProjectsService — typed access to the Wave 02 `/api/projects` contract.
 *
 * Staged implementation: each method constructs the real endpoint URL and, when
 * `environment.useMockData` is false, issues the actual `HttpClient` call.
 * Until backend integration is enabled it returns contract-shaped mock data, so
 * swapping to live data is a flag flip — no caller or model changes required.
 */
@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/projects`;

  // --- Contract-shaped mock data (mirrors ProjectResponse) ------------------
  private readonly mockProjects: Project[] = [
    {
      id: '8f2a1c00-0001-4a10-9a01-000000000001',
      projectCode: 'PRJ-2026-0001',
      projectName: 'County-wide Microsoft 365 Migration',
      description: 'Unified Microsoft 365 cloud tenant for all County departments.',
      department: 'Information Technology Services',
      division: 'Enterprise Infrastructure',
      sponsorName: 'Mark Hoskins',
      sponsorEmail: 'mark.hoskins@venturacounty.gov',
      projectManagerName: 'Joanna Pereira',
      projectManagerEmail: 'joanna.pereira@venturacounty.gov',
      dcioName: 'ITS Director',
      tier: 'Tier3',
      phase: 'Execution',
      gateStatus: 'Approved',
      activeGate: 4,
      healthRag: 'Green',
      healthNarrative: 'Phase 2 deployment tracking to plan.',
      status: 'Active',
      daysInPhase: 45,
      lastStatusReportDate: '2026-06-15',
      nextStatusReportDueDate: '2026-06-29',
      createdAt: '2025-09-01T00:00:00Z',
      createdByEmail: 'joanna.pereira@venturacounty.gov',
      updatedAt: '2026-06-15T00:00:00Z',
      updatedByEmail: 'joanna.pereira@venturacounty.gov',
    },
    {
      id: '8f2a1c00-0002-4a10-9a01-000000000002',
      projectCode: 'PRJ-2026-0002',
      projectName: 'Sewer Sump Telemetry Modernization',
      description: 'Upgrade of the sump pump monitoring and telemetry network.',
      department: 'Public Works Agency',
      division: 'Watershed Protection',
      sponsorName: 'Terry Theobald',
      sponsorEmail: 'terry.theobald@venturacounty.gov',
      projectManagerName: 'Daniel Reyes',
      projectManagerEmail: 'daniel.reyes@venturacounty.gov',
      dcioName: null,
      tier: 'Tier2',
      phase: 'Planning',
      gateStatus: 'UnderReview',
      activeGate: 3,
      healthRag: 'Yellow',
      healthNarrative: 'Vendor hardware delays impacting integration timeline.',
      status: 'Active',
      daysInPhase: 32,
      lastStatusReportDate: '2026-06-20',
      nextStatusReportDueDate: '2026-07-04',
      createdAt: '2026-01-10T00:00:00Z',
      createdByEmail: 'daniel.reyes@venturacounty.gov',
      updatedAt: '2026-06-20T00:00:00Z',
      updatedByEmail: 'daniel.reyes@venturacounty.gov',
    },
    {
      id: '8f2a1c00-0003-4a10-9a01-000000000003',
      projectCode: 'PRJ-2026-0003',
      projectName: 'VCMC Electronic Health Record Upgrade',
      description: 'EHR system upgrade and vendor migration for the Medical Center.',
      department: 'Health Care Agency',
      division: 'Ventura County Medical Center',
      sponsorName: 'Pat Patterson',
      sponsorEmail: 'pat.patterson@venturacounty.gov',
      projectManagerName: 'Sarah Miller',
      projectManagerEmail: 'sarah.miller@venturacounty.gov',
      dcioName: 'HCA DCIO',
      tier: 'Tier3',
      phase: 'Initiation',
      gateStatus: 'PendingReview',
      activeGate: 2,
      healthRag: 'Red',
      healthNarrative: 'Scope and budget pressure pending charter approval.',
      status: 'Active',
      daysInPhase: 78,
      lastStatusReportDate: '2026-06-18',
      nextStatusReportDueDate: '2026-06-25',
      createdAt: '2025-11-01T00:00:00Z',
      createdByEmail: 'sarah.miller@venturacounty.gov',
      updatedAt: '2026-06-18T00:00:00Z',
      updatedByEmail: 'sarah.miller@venturacounty.gov',
    },
    {
      id: '8f2a1c00-0004-4a10-9a01-000000000004',
      projectCode: 'PRJ-2026-0004',
      projectName: 'ITS Datacenter Power Distribution Upgrade',
      description: 'Redundant PDU and backup generator switch upgrade.',
      department: 'Information Technology Services',
      division: 'Enterprise Infrastructure',
      sponsorName: 'Mark Hoskins',
      sponsorEmail: 'mark.hoskins@venturacounty.gov',
      projectManagerName: 'Steve Alvarez',
      projectManagerEmail: 'steve.alvarez@venturacounty.gov',
      dcioName: null,
      tier: 'Tier1',
      phase: 'Closure',
      gateStatus: 'Approved',
      activeGate: 5,
      healthRag: 'Green',
      healthNarrative: 'Testing and acceptance complete; preparing closure.',
      status: 'Active',
      daysInPhase: 12,
      lastStatusReportDate: '2026-06-10',
      nextStatusReportDueDate: '2026-06-24',
      createdAt: '2026-03-01T00:00:00Z',
      createdByEmail: 'steve.alvarez@venturacounty.gov',
      updatedAt: '2026-06-10T00:00:00Z',
      updatedByEmail: 'steve.alvarez@venturacounty.gov',
    },
    {
      id: '8f2a1c00-0005-4a10-9a01-000000000005',
      projectCode: 'PRJ-2026-0005',
      projectName: 'Fire Department Dispatch Replacement',
      description: 'Replacement of legacy CAD/dispatch terminals and GIS mapping.',
      department: 'Fire Protection District',
      division: 'Emergency Communications',
      sponsorName: 'Chief R. Daniels',
      sponsorEmail: 'r.daniels@venturacounty.gov',
      projectManagerName: 'Joanna Pereira',
      projectManagerEmail: 'joanna.pereira@venturacounty.gov',
      dcioName: null,
      tier: 'Tier3',
      phase: 'Intake',
      gateStatus: 'PendingReview',
      activeGate: 1,
      healthRag: 'Green',
      healthNarrative: 'Intake under PMO review.',
      status: 'Upcoming',
      daysInPhase: 8,
      lastStatusReportDate: '2026-06-01',
      nextStatusReportDueDate: '2026-06-15',
      createdAt: '2026-05-15T00:00:00Z',
      createdByEmail: 'joanna.pereira@venturacounty.gov',
      updatedAt: '2026-06-01T00:00:00Z',
      updatedByEmail: 'joanna.pereira@venturacounty.gov',
    },
  ];

  private toListItem(p: Project): ProjectListItem {
    return {
      id: p.id,
      projectCode: p.projectCode,
      projectName: p.projectName,
      projectManagerName: p.projectManagerName,
      division: p.division,
      tier: p.tier,
      phase: p.phase,
      gateStatus: p.gateStatus,
      healthRag: p.healthRag,
      status: p.status,
      daysInPhase: p.daysInPhase,
      lastStatusReportDate: p.lastStatusReportDate,
    };
  }

  /** GET /api/projects — registry list rows. */
  getProjects(): Observable<ProjectListItem[]> {
    if (!environment.useMockData) {
      return this.http.get<ProjectListItem[]>(this.baseUrl);
    }
    return of(this.mockProjects.map((p) => this.toListItem(p)));
  }

  /** GET /api/projects/{id} — full project. */
  getProjectById(projectId: string): Observable<Project | undefined> {
    if (!environment.useMockData) {
      return this.http.get<Project>(`${this.baseUrl}/${projectId}`);
    }
    return of(this.mockProjects.find((p) => p.id === projectId));
  }

  /**
   * Projects the current user may see. PMO/Governance Board get the full
   * portfolio; Project Managers are scoped to projects they manage. The .NET
   * API remains the authoritative access-control boundary.
   */
  getProjectsForUser(userEmail: string, isPortfolioWide: boolean): Observable<ProjectListItem[]> {
    if (!environment.useMockData) {
      const url = isPortfolioWide ? this.baseUrl : `${this.baseUrl}/my`;
      return this.http.get<ProjectListItem[]>(url);
    }
    const source = isPortfolioWide
      ? this.mockProjects
      : this.mockProjects.filter((p) => p.projectManagerEmail === userEmail);
    return of(source.map((p) => this.toListItem(p)));
  }

  /** Portfolio health rollup for dashboard / registry summary bars. */
  getPortfolioHealth(): Observable<PortfolioHealth> {
    const tiers: PortfolioHealth['projectsByTier'] = { Tier1: 0, Tier2: 0, Tier3: 0 };
    const rags: PortfolioHealth['projectsByRag'] = { Green: 0, Yellow: 0, Red: 0 };
    const phases: PortfolioHealth['projectsByPhase'] = {
      Intake: 0, Initiation: 0, Planning: 0, Execution: 0, ReleaseReadiness: 0, Closure: 0, Closed: 0,
    };
    for (const p of this.mockProjects) {
      tiers[p.tier]++;
      rags[p.healthRag]++;
      phases[p.phase]++;
    }
    return of({ totalProjects: this.mockProjects.length, projectsByTier: tiers, projectsByRag: rags, projectsByPhase: phases });
  }

  /** Registry KPI rollup (overdue = no report in > 14 days). */
  getRegistryKpis(): Observable<ProjectRegistryKpis> {
    const overdueReports = this.mockProjects.filter((p) => {
      if (!p.lastStatusReportDate) return true;
      const days = (Date.now() - new Date(p.lastStatusReportDate).getTime()) / (1000 * 60 * 60 * 24);
      return days > 14;
    }).length;
    return of({
      totalProjects: this.mockProjects.length,
      tier1: this.mockProjects.filter((p) => p.tier === 'Tier1').length,
      tier2: this.mockProjects.filter((p) => p.tier === 'Tier2').length,
      tier3: this.mockProjects.filter((p) => p.tier === 'Tier3').length,
      overdueReports,
    });
  }
}
