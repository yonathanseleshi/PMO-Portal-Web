import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TemplatesService } from '../../services/templates/templates';
import { TemplateDefinition } from '../../models';
import {
  BadgeComponent,
  CardComponent,
  PageHeaderComponent,
  TierCalculatorComponent,
} from '../../shared/components';

/**
 * Template Library (PAGE-TEMPLATE-001) — central, self-service catalogue of PMO
 * templates with search, gate/tier filtering, per-template actions (Details,
 * Instructions, Start Submission, Download), and an embedded Tier Calculator.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-template-library',
  imports: [CommonModule, FormsModule, RouterLink, CardComponent, BadgeComponent, PageHeaderComponent, TierCalculatorComponent],
  templateUrl: './template-library.component.html',
  styleUrl: './template-library.component.css',
})
export class TemplateLibraryComponent {
  private templatesService = inject(TemplatesService);

  /** Native submission routes by template id (Intake/Charter/Attestation/Closure). */
  private readonly submissionRoutes: Record<string, string> = {
    'PMO-TPL-001': '/submissions/new/intake',
    'PMO-TPL-002': '/submissions/new/charter',
    'PMO-TPL-007': '/submissions/new/attestation',
    'PMO-TPL-004': '/submissions/new/closure',
  };

  readonly templates = signal<TemplateDefinition[]>([]);
  readonly search = signal('');
  readonly gateFilter = signal('all');
  readonly tierFilter = signal('all');
  readonly showCalculator = signal(false);

  readonly gateOptions = computed(() => {
    const gates = new Set<string>();
    for (const t of this.templates()) {
      if (t.gate) gates.add(t.gate);
    }
    return [...gates].sort();
  });

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const gate = this.gateFilter();
    const tier = this.tierFilter();
    return this.templates().filter((t) => {
      const matchesTerm =
        !term ||
        t.name.toLowerCase().includes(term) ||
        t.id.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term);
      const matchesGate = gate === 'all' || t.gate === gate;
      const matchesTier = tier === 'all' || t.tierApplicability.includes(tier);
      return matchesTerm && matchesGate && matchesTier;
    });
  });

  constructor() {
    this.templatesService.getTemplates().subscribe((t) => this.templates.set(t));
  }

  submissionRouteFor(template: TemplateDefinition): string | null {
    return template.submitEnabled ? (this.submissionRoutes[template.id] ?? null) : null;
  }

  toggleCalculator(): void {
    this.showCalculator.update((v) => !v);
  }

  resetFilters(): void {
    this.search.set('');
    this.gateFilter.set('all');
    this.tierFilter.set('all');
  }
}
