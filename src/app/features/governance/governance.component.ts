import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-governance',
  imports: [CommonModule, CardComponent, BadgeComponent, PageHeaderComponent],
  templateUrl: './governance.component.html',
  styleUrl: './governance.component.css'
})
export class GovernanceComponent {
  committees = [
    {
      name: 'Technology Governance Committee (TGC)',
      authority: 'Approval of all Tier 3 Capital projects (> $1M) & strategic IT roadmap alignments.',
      schedule: 'First Tuesday of every month, 10:00 AM PST',
      members: ['ITS Director', 'County Executive Officer (CEO)', 'Chief Financial Officer (CFO)']
    },
    {
      name: 'Project Review Committee (PRC)',
      authority: 'Approval of all Tier 2 Operations projects ($250k - $1M) & G3 Stage Approvals.',
      schedule: 'Every alternate Thursday, 1:30 PM PST',
      members: ['PMO Division Manager', 'IT Security Lead', 'Enterprise Architect']
    }
  ];

  gates = [
    {
      code: 'G1',
      name: 'Intake & Feasibility Decision',
      evidence: 'Project Request form with high-level business alignment, departmental sign-off, and approximate budget estimates.',
      output: 'Authorized Intake status or redirection to SaaS catalogue.'
    },
    {
      code: 'G2',
      name: 'Charter Authorization',
      evidence: 'Completed Project Charter document specifying core scope, high-level timeline, immediate funding, and designated PM.',
      output: 'Designated funding code setup and PM assigned.'
    },
    {
      code: 'G3',
      name: 'Planning & Design Approval',
      evidence: 'Detailed Project Plan, completed Risk Register (RAID), full procurement specifications, and approved vendor contract.',
      output: 'Authorization to begin build/implementation.'
    },
    {
      code: 'G4',
      name: 'Release Readiness Verification',
      evidence: 'User Acceptance Testing (UAT) sign-offs, production rollback playbook, IT service desk hand-off logs, and user training records.',
      output: 'Go-Live approval window set.'
    },
    {
      code: 'G5',
      name: 'Acceptance & Official Close',
      evidence: 'Final closure report, financial reconciliation statements, operational sign-off from IT Support, and lessons learned database entries.',
      output: 'Closure of project code and final retrospective.'
    }
  ];

  constructor() {}
}
