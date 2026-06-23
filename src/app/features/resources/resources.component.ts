import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../../shared/components/card/card.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-resources',
  imports: [CommonModule, CardComponent, PageHeaderComponent],
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.css'
})
export class ResourcesComponent {
  standards = [
    {
      title: 'VCSecure CyberSecurity Compliance Standard',
      category: 'Security',
      desc: 'All project intake requests must undergo a formal Security Review. Integrations with external SaaS require single-sign-on (SSO) integration via Okta.',
      updated: 'March 2026'
    },
    {
      title: 'Cloud First Procurement Directive',
      category: 'Procurement',
      desc: 'County of Ventura mandates that cloud-based Software-as-a-Service (SaaS) is prioritized for all new technology requests. On-prem deployments require a strategic exemption from TGC.',
      updated: 'January 2026'
    },
    {
      title: 'Disaster Recovery & Business Continuity',
      category: 'Operations',
      desc: 'All Tier 3 applications must maintain high-availability configurations across dual regions with a documented Recovery Point Objective (RPO) under 4 hours.',
      updated: 'May 2026'
    }
  ];

  faq = [
    {
      q: 'How long does G1 Intake approval typically take?',
      a: 'If details are fully prepared, G1 Intake evaluations are processed by the PMO within 5-7 business days.'
    },
    {
      q: 'Can I combine G2 and G3 gates for minor projects?',
      a: 'Yes, for Tier 1 lightweight projects, you can combine G2 Charter and G3 Planning into a single review checkpoint with PMO approval.'
    },
    {
      q: 'What is the standard frequency for project Status Reports?',
      a: 'Status Reports must be filed bi-weekly. Active Tier 3 projects require reporting every alternate Friday.'
    }
  ];

  constructor() {}
}
