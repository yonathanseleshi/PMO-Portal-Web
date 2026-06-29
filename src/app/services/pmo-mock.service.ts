import { Injectable, computed, inject, signal } from '@angular/core';
import { Project, StatusReport, Submission, UserSession } from '../models/pmo.model';
import { AuthService } from './auth/auth';

@Injectable({
  providedIn: 'root'
})
export class PmoMockService {
  private auth = inject(AuthService);

  /**
   * Authentication state is owned by {@link AuthService}. These members remain
   * as backward-compatible bridges so existing role-aware feature screens
   * (which expect a simple `{ username, role: 'pmo' | 'pm' }` shape) continue
   * to work against the canonical session.
   */
  isLoggedIn = computed<boolean>(() => this.auth.isLoggedIn());

  // Derived from the canonical AuthService session. PMO Lead / PMO Analyst map
  // to 'pmo'; all other roles map to 'pm' for legacy UI conditionals.
  currentUser = computed<UserSession>(() => {
    const session = this.auth.session();
    if (!session) {
      return { username: '', role: 'pm' };
    }
    return {
      username: session.displayName,
      role: this.auth.isPMOUser() ? 'pmo' : 'pm'
    };
  });

  logout() {
    this.auth.logout().subscribe();
  }

  // Master projects database
  projects = signal<Project[]>([
    {
      id: 'PRJ-2026-0001',
      name: 'County-wide Microsoft 365 Migration',
      description: 'Transitioning all County departments to a unified Microsoft 365 cloud tenant to improve collaboration and security compliance.',
      manager: 'Mark',
      tier: 3,
      phase: 'G4',
      status: 'On Track',
      ragStatus: 'Green',
      lastStatusReportDate: '2026-06-15',
      budget: 1200000,
      spent: 850000,
      startDate: '2025-09-01',
      endDate: '2026-12-15',
      subprojects: ['VCMC Tenant Merge', 'Assessor Office Migration', 'Public Works Setup'],
      milestones: [
        { id: 'M1', name: 'Tenant Preparation & Discovery', date: '2025-11-15', status: 'Completed' },
        { id: 'M2', name: 'Pilot Migration Group', date: '2026-02-10', status: 'Completed' },
        { id: 'M3', name: 'Phase 1 Production Migration', date: '2026-05-30', status: 'Completed' },
        { id: 'M4', name: 'Phase 2 Live Deployment', date: '2026-09-15', status: 'In Progress' },
        { id: 'M5', name: 'Post-Migration Support Handoff', date: '2026-12-01', status: 'Not Started' }
      ]
    },
    {
      id: 'PRJ-2026-0002',
      name: 'Sewer Sump Telemetry Modernization',
      description: 'Upgrading the underwater sump pump monitoring and telemetry network for Wastewater & Stormwater Management.',
      manager: 'Joanna',
      tier: 2,
      phase: 'G3',
      status: 'At Risk',
      ragStatus: 'Amber',
      lastStatusReportDate: '2026-06-20',
      budget: 450000,
      spent: 310000,
      startDate: '2026-01-10',
      endDate: '2026-10-30',
      subprojects: ['Telemetry HW Procure', 'Scada System Config'],
      milestones: [
        { id: 'M1', name: 'Hardware Specifications', date: '2026-02-28', status: 'Completed' },
        { id: 'M2', name: 'Wastewater Site Audits', date: '2026-04-15', status: 'Completed' },
        { id: 'M3', name: 'First Dual-Pump Controller Dev', date: '2026-07-20', status: 'In Progress' },
        { id: 'M4', name: 'Release to Support Team', date: '2026-10-15', status: 'Not Started' }
      ]
    },
    {
      id: 'PRJ-2026-0003',
      name: 'VCMC Electronic Health Record Upgrade',
      description: 'Major software upgrade and vendor migration for the Ventura County Medical Center EHR system to support modern compliance.',
      manager: 'Mark',
      tier: 3,
      phase: 'G2',
      status: 'Critical',
      ragStatus: 'Red',
      lastStatusReportDate: '2026-06-18',
      budget: 2500000,
      spent: 980000,
      startDate: '2025-11-01',
      endDate: '2027-03-31',
      subprojects: ['EMR Patient Database Migration', 'Caregiver Training Portal'],
      milestones: [
        { id: 'M1', name: 'Initial Charter & Funding', date: '2025-12-15', status: 'Completed' },
        { id: 'M2', name: 'Requirements & SOW', date: '2026-04-30', status: 'In Progress' },
        { id: 'M3', name: 'Test Environment Deployment', date: '2026-11-15', status: 'Not Started' },
        { id: 'M4', name: 'User Acceptance Testing (UAT)', date: '2027-03-01', status: 'Not Started' }
      ]
    },
    {
      id: 'PRJ-2026-0004',
      name: 'ITS Datacenter Power Distribution Upgrade',
      description: 'Upgrading the redundant power distribution units (PDUs) and backup generator switches in the main ITS datacenter.',
      manager: 'Steve',
      tier: 1,
      phase: 'G5',
      status: 'Approved',
      ragStatus: 'Green',
      lastStatusReportDate: '2026-06-10',
      budget: 150000,
      spent: 145000,
      startDate: '2026-03-01',
      endDate: '2026-06-30',
      subprojects: [],
      milestones: [
        { id: 'M1', name: 'Engineering Review', date: '2026-03-15', status: 'Completed' },
        { id: 'M2', name: 'Equipment Delivery', date: '2026-04-20', status: 'Completed' },
        { id: 'M3', name: 'Testing and Acceptance', date: '2026-06-10', status: 'Completed' }
      ]
    },
    {
      id: 'PRJ-2026-0005',
      name: 'Fire Department Dispatch Replacement',
      description: 'Replacing legacy CAD/dispatch terminals with next-generation high-reliability systems and emergency GIS mapping.',
      manager: 'Joanna',
      tier: 3,
      phase: 'G1',
      status: 'In Review',
      ragStatus: 'Green',
      lastStatusReportDate: '2026-06-01',
      budget: 1800000,
      spent: 50000,
      startDate: '2026-05-15',
      endDate: '2027-08-31',
      subprojects: ['MDT Terminal Deployment', 'Dispatch Radio Upgrade'],
      milestones: [
        { id: 'M1', name: 'Project Intake Approval', date: '2026-06-10', status: 'Completed' },
        { id: 'M2', name: 'Project Charter Sign-off', date: '2026-08-15', status: 'In Progress' }
      ]
    }
  ]);

  // Master status reports database
  statusReports = signal<StatusReport[]>([
    {
      id: 'REP-001',
      projectId: 'PRJ-2026-0001',
      reportDate: '2026-06-15',
      overallStatus: 'On Track',
      summary: 'Project is progressing successfully. Pilot migrations are complete with high satisfaction rates.',
      keyAchievements: ['Migrated Assessor Office successfully', 'Pilot group training completed'],
      nextSteps: ['Schedule mass migration for Public Works', 'Deploy mail routing coexistence updates'],
      issues: ['None reported']
    },
    {
      id: 'PRJ-2026-0002-R1',
      projectId: 'PRJ-2026-0002',
      reportDate: '2026-06-20',
      overallStatus: 'At Risk',
      summary: 'Vendor hardware delays have impacted our hardware integration timeline by 3 weeks.',
      keyAchievements: ['Finalized hardware specifications', 'Concluded physical wastewater site audits'],
      nextSteps: ['Receive initial dual-pump controllers', 'Initiate lab-testing framework'],
      issues: ['Hardware delivery postponed due to supply-chain backlogs', 'Testing resources constraint']
    }
  ]);

  // Master submissions database
  submissions = signal<Submission[]>([
    {
      id: 'SUB-2026-0615-0042',
      projectName: 'Aviation Dept. Lease Management System',
      type: 'Intake',
      submittedBy: 'David Miller',
      submissionDate: '2026-06-15',
      status: 'Pending',
      details: 'Requesting a unified portal to manage airport hanger leases and tenant billing for Camarillo Airport.',
      price: 240000
    },
    {
      id: 'SUB-2026-0618-0091',
      name: 'Animal Services License Portal',
      projectName: 'Animal Services License Portal',
      type: 'Charter',
      submittedBy: 'Steve',
      submissionDate: '2026-06-18',
      status: 'Approved',
      details: 'Project Charter for upgrading the public-facing animal licensing and pet vaccine tracking portal.',
      price: 95000
    } as any,
    {
      id: 'SUB-2026-0622-0112',
      projectName: 'Library RFID Cataloging Initiative',
      type: 'Closure',
      submittedBy: 'Joanna',
      submissionDate: '2026-06-22',
      status: 'Pending',
      details: 'Closure report for RFID tag implementation across all Ventura County libraries.',
      price: 180000
    }
  ]);

  // Announcements database
  announcements = signal([
    {
      title: 'Lean PMO Portal Phase 1 Launched',
      date: '2026-06-20',
      summary: 'The new Ventura County ITS Project Management Portal is now live for internal testing and pilot groups.'
    },
    {
      title: 'FY 26/27 Template Standardization',
      date: '2026-06-18',
      summary: 'All project requests must now use the standardized Intake and Charter forms available in the Template Library.'
    }
  ]);

  // Newsletters
  newsletters = signal([
    {
      title: 'PMO Insider - June 2026',
      date: '2026-06-01',
      summary: 'Learn about the 5-Gate governance model, meet our team, and explore the new PMO Copilot AI assistant.'
    }
  ]);

  // Podcasts
  podcasts = signal([
    {
      title: 'Episode 4: Mastering G4 Release Readiness',
      duration: '18 min',
      speaker: 'Mark (PMO Lead)',
      date: '2026-06-15'
    },
    {
      title: 'Episode 3: Understanding Project Tiers',
      duration: '12 min',
      speaker: 'Joanna (PMO Analyst)',
      date: '2026-06-05'
    }
  ]);

  constructor() {}

  // Operations
  updateProjectHealth(projectId: string, rag: 'Green' | 'Yellow' | 'Red') {
    this.projects.update(projects =>
      projects.map(p => (p.id === projectId ? { ...p, health: rag } : p))
    );
  }

  updateProjectPhase(projectId: string, phase: 'G1' | 'G2' | 'G3' | 'G4' | 'G5', gate: number) {
    if (gate) {
      // Used to avoid unused parameter warning while preserving method signature
    }
    this.projects.update(projects =>
      projects.map(p => (p.id === projectId ? { ...p, phase } : p))
    );
  }

  addStatusReport(report: StatusReport) {
    this.statusReports.update(reports => [report, ...reports]);
    // update project's last report date
    this.projects.update(projects =>
      projects.map(p => (p.id === report.projectId ? { ...p, lastStatusReportDate: report.reportDate, ragStatus: report.overallStatus as any } : p))
    );
  }

  processSubmission(submissionId: string, status: 'Approved' | 'Returned') {
    this.submissions.update(subs =>
      subs.map(s => (s.id === submissionId ? { ...s, status } : s))
    );
  }

  addProject(project: Project) {
    this.projects.update(projects => [...projects, project]);
  }
}
