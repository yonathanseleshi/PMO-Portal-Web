import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmoMockService } from '../../core/services/pmo-mock.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-template-library',
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent, PageHeaderComponent],
  templateUrl: './template-library.component.html',
  styleUrl: './template-library.component.css'
})
export class TemplateLibraryComponent {
  pmoService = inject(PmoMockService);

  // Calculator state signals
  showCalculator = signal<boolean>(false);
  budget = signal<number>(0);
  impact = signal<string>('low');
  integration = signal<string>('low');
  calculatedTier = signal<number | null>(null);

  templates = [
    {
      id: 'T-INTAKE',
      name: 'Project Intake Template',
      desc: 'Mandatory form to initiate any County technology project request. Captures general intent, sponsor, and estimated scale.',
      requiredFor: 'All Tiers (1-3)',
      downloadUrl: '#'
    },
    {
      id: 'T-CHARTER',
      name: 'Project Charter Template',
      desc: 'Detailed authorization document specifying project scope, major milestones, key risks, resources, and administrative funding basis.',
      requiredFor: 'Tiers 2 & 3',
      downloadUrl: '#'
    },
    {
      id: 'T-CLOSE',
      name: 'Project Closure Template',
      desc: 'Formal wrap-up packet including user acceptance confirmation, financial reconciliation, and final lessons learned.',
      requiredFor: 'Tiers 2 & 3',
      downloadUrl: '#'
    }
  ];

  constructor() {}

  calculateTier() {
    const cost = this.budget();
    const imp = this.impact();
    const integ = this.integration();

    let tier = 1;

    // Financial trigger
    if (cost > 1000000) {
      tier = 3;
    } else if (cost > 250000) {
      tier = 2;
    }

    // Complexity triggers
    if (imp === 'high' || integ === 'high') {
      tier = Math.max(tier, 3);
    } else if (imp === 'medium' || integ === 'medium') {
      tier = Math.max(tier, 2);
    }

    this.calculatedTier.set(tier);
  }

  resetCalculator() {
    this.budget.set(0);
    this.impact.set('low');
    this.integration.set('low');
    this.calculatedTier.set(null);
  }

  toggleCalculator() {
    this.showCalculator.update(v => !v);
  }
}
