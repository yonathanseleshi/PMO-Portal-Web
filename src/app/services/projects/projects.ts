import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Milestone, PortfolioHealth, Project, RaidItem, StatusReport } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private mockProjects: Project[] = [
    {
      id: 'proj-001',
      name: 'Infrastructure Modernization',
      pmName: 'Jane Rodriguez',
      pmEmail: 'jane.rodriguez@venturacounty.gov',
      sponsor: 'Mark Hoskins',
      dcio: 'IT Services Director',
      division: 'Infrastructure',
      tier: 'T1',
      phase: 'Execute',
      projectStatus: 'In-Flight',
      gateStatus: 'Gate3',
      scheduleRag: 'Green',
      scopeRag: 'Green',
      budgetRag: 'Yellow',
      resourcesRag: 'Green',
      overallRag: 'Yellow',
      daysInPhase: 45,
      statusCadence: 'Weekly',
      nextStatusReportDueDate: '2026-05-25',
      lastStatusReportDate: '2026-05-18',
      lastUpdated: '2026-05-19',
      lastUpdatedBy: 'jane.rodriguez@venturacounty.gov'
    },
    {
      id: 'proj-002',
      name: 'HR System Implementation',
      pmName: 'Jane Rodriguez',
      pmEmail: 'jane.rodriguez@venturacounty.gov',
      sponsor: 'Terry Theobald',
      division: 'Human Resources',
      tier: 'T2',
      phase: 'Plan',
      projectStatus: 'In-Flight',
      gateStatus: 'Gate2',
      scheduleRag: 'Green',
      scopeRag: 'Green',
      budgetRag: 'Green',
      resourcesRag: 'Yellow',
      overallRag: 'Green',
      daysInPhase: 32,
      statusCadence: 'Bi-Weekly',
      nextStatusReportDueDate: '2026-05-31',
      lastStatusReportDate: '2026-05-17',
      lastUpdated: '2026-05-19',
      lastUpdatedBy: 'jane.rodriguez@venturacounty.gov'
    },
    {
      id: 'proj-003',
      name: 'Portal Enhancement Phase 2',
      pmName: 'Michael Chen',
      pmEmail: 'michael.chen@venturacounty.gov',
      sponsor: 'Mark Hoskins',
      division: 'Information Technology',
      tier: 'T3',
      phase: 'Monitor',
      projectStatus: 'In-Flight',
      gateStatus: 'Gate4',
      scheduleRag: 'Yellow',
      scopeRag: 'Green',
      budgetRag: 'Green',
      resourcesRag: 'Green',
      overallRag: 'Yellow',
      daysInPhase: 12,
      statusCadence: 'Monthly',
      nextStatusReportDueDate: '2026-06-15',
      lastStatusReportDate: '2026-05-15',
      lastUpdated: '2026-05-18',
      lastUpdatedBy: 'michael.chen@venturacounty.gov'
    },
    {
      id: 'proj-004',
      name: 'Data Warehouse Migration',
      pmName: 'Sarah Miller',
      pmEmail: 'sarah.miller@venturacounty.gov',
      sponsor: 'Pat Patterson',
      division: 'Data Services',
      tier: 'T1',
      phase: 'Execute',
      projectStatus: 'In-Flight',
      gateStatus: 'Gate3',
      scheduleRag: 'Red',
      scopeRag: 'Yellow',
      budgetRag: 'Red',
      resourcesRag: 'Yellow',
      overallRag: 'Red',
      daysInPhase: 78,
      statusCadence: 'Weekly',
      nextStatusReportDueDate: '2026-05-24',
      lastStatusReportDate: '2026-05-16',
      lastUpdated: '2026-05-19',
      lastUpdatedBy: 'sarah.miller@venturacounty.gov'
    }
  ];

  private readonly mockRaidItems: RaidItem[] = [
    {
      id: 'raid-001',
      projectId: 'proj-001',
      type: 'Risk',
      title: 'Vendor lead time on critical hardware',
      description: 'Network appliances may miss planned deployment window.',
      owner: 'Jane Rodriguez',
      priority: 'High',
      status: 'In Progress',
      createdDate: '2026-05-01',
      lastUpdated: '2026-05-18'
    },
    {
      id: 'raid-002',
      projectId: 'proj-001',
      type: 'Issue',
      title: 'Firewall rule dependency with Security team',
      description: 'Production go-live requires cross-division approval.',
      owner: 'Michael Chen',
      priority: 'Medium',
      status: 'Open',
      createdDate: '2026-05-12',
      lastUpdated: '2026-05-19'
    }
  ];

  private readonly mockMilestones: Milestone[] = [
    {
      id: 'ms-001',
      projectId: 'proj-001',
      name: 'Gate 3 planning package approved',
      targetDate: '2026-05-10',
      completedDate: '2026-05-09',
      status: 'Completed',
      owner: 'PMO Office'
    },
    {
      id: 'ms-002',
      projectId: 'proj-001',
      name: 'Wave 1 deployment readiness',
      targetDate: '2026-06-14',
      status: 'In Progress',
      owner: 'Jane Rodriguez'
    }
  ];

  private readonly mockStatusReports: StatusReport[] = [
    {
      id: 'sr-001',
      projectId: 'proj-001',
      projectName: 'Infrastructure Modernization',
      reportingPeriod: '2026-05-11 to 2026-05-18',
      submittedDate: '2026-05-18',
      submittedBy: 'Jane Rodriguez',
      overallStatus: 'Yellow',
      scheduleStatus: 'Green',
      scopeStatus: 'Green',
      budgetStatus: 'Yellow',
      resourcesStatus: 'Green',
      summary: 'Deployment sequencing adjusted to absorb procurement lead-time risk.',
      highlights: ['Core environment passed readiness checks.'],
      risks: ['Hardware vendor shipment timing remains constrained.'],
      issues: ['Firewall rule approvals pending from security governance.'],
      nextSteps: ['Finalize cutover communication package.']
    }
  ];

  /**
   * Get all projects
   */
  getProjects(): Observable<Project[]> {
    // TODO(api): Replace with HttpClient GET /api/projects
    return of(this.mockProjects);
  }

  /**
   * Get projects for PM (by email match)
   */
  getProjectsForPM(pmEmail: string): Observable<Project[]> {
    const projects = this.mockProjects.filter((p) => p.pmEmail === pmEmail);
    return of(projects);
  }

  /**
   * Get projects by current user context
   */
  getProjectsForUser(userEmail: string, role: string): Observable<Project[]> {
    if (role === 'PROJECT_MANAGER') {
      return this.getProjectsForPM(userEmail);
    }
    return of(this.mockProjects);
  }

  /**
   * Get project by ID
   */
  getProject(projectId: string): Observable<Project | undefined> {
    const project = this.mockProjects.find((p) => p.id === projectId);
    return of(project);
  }

  /**
   * API-aligned alias for project lookup
   */
  getProjectById(projectId: string): Observable<Project | undefined> {
    // TODO(api): Replace with HttpClient GET /api/projects/{projectId}
    return this.getProject(projectId);
  }

  /**
   * Get portfolio health summary
   */
  getPortfolioHealth(): Observable<PortfolioHealth> {
    const health: PortfolioHealth = {
      totalProjects: this.mockProjects.length,
      projectsByTier: {
        T1: this.mockProjects.filter((p) => p.tier === 'T1').length,
        T2: this.mockProjects.filter((p) => p.tier === 'T2').length,
        T3: this.mockProjects.filter((p) => p.tier === 'T3').length
      },
      projectsByRag: {
        Green: this.mockProjects.filter((p) => p.overallRag === 'Green').length,
        Yellow: this.mockProjects.filter((p) => p.overallRag === 'Yellow').length,
        Red: this.mockProjects.filter((p) => p.overallRag === 'Red').length
      },
      projectsByPhase: {
        Execute: this.mockProjects.filter((p) => p.phase === 'Execute').length,
        Plan: this.mockProjects.filter((p) => p.phase === 'Plan').length,
        Monitor: this.mockProjects.filter((p) => p.phase === 'Monitor').length,
        Closed: this.mockProjects.filter((p) => p.phase === 'Closed').length
      }
    };
    return of(health);
  }

  /**
   * Get registry KPI rollup
   */
  getProjectRegistryKpis(): Observable<{
    totalProjects: number;
    tier1: number;
    tier2: number;
    tier3: number;
    overdueReports: number;
  }> {
    const overdueReports = this.mockProjects.filter((project) => {
      if (!project.lastStatusReportDate) {
        return true;
      }

      const daysSinceReport =
          (Date.now() - new Date(project.lastStatusReportDate).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceReport > 14;
    }).length;

    return of({
      totalProjects: this.mockProjects.length,
      tier1: this.mockProjects.filter((p) => p.tier === 'T1').length,
      tier2: this.mockProjects.filter((p) => p.tier === 'T2').length,
      tier3: this.mockProjects.filter((p) => p.tier === 'T3').length,
      overdueReports
    });
  }

  /**
   * Project RAID preview rows
   */
  getProjectRaidPreview(projectId: string): Observable<RaidItem[]> {
    // TODO(api): Replace with HttpClient GET /api/projects/{projectId}/raid
    return of(this.mockRaidItems.filter((item) => item.projectId === projectId));
  }

  /**
   * Project milestone preview rows
   */
  getProjectMilestones(projectId: string): Observable<Milestone[]> {
    // TODO(api): Replace with HttpClient GET /api/projects/{projectId}/milestones
    return of(this.mockMilestones.filter((item) => item.projectId === projectId));
  }

  /**
   * Latest submitted status report
   */
  getLatestStatusReport(projectId: string): Observable<StatusReport | undefined> {
    // TODO(api): Replace with HttpClient GET /api/projects/{projectId}/status-reports/latest
    const report = this.mockStatusReports.find((item) => item.projectId === projectId);
    return of(report);
  }

  /**
   * Update project health (mock)
   */
  updateHealth(projectId: string, updates: Partial<Project>): Observable<Project | undefined> {
    const project = this.mockProjects.find((p) => p.id === projectId);
    if (project) {
      Object.assign(project, updates);
    }
    return of(project);
  }
}
