import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { BadgeComponent } from '../badge/badge.component';
import { ProjectTier, TIER_LABELS } from '../../../models/enums.model';
import { TierRecommendation, TierTriggerOption } from '../../../models/submission-form.model';

/**
 * pmo-tier-calculator — guided governance-tier estimator (PAGE-GOV-002).
 *
 * Mirrors the governance model: any Tier-1 trigger ({@link TIER_TRIGGERS}, sourced
 * from the Data Model Inventory §13.4) forces Tier 1 (the highest oversight). With
 * no triggers, an estimated cost threshold separates Tier 2 from Tier 3. The PMO
 * always confirms the official tier — this is a planning aid only.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-tier-calculator',
  imports: [CommonModule, CardComponent, BadgeComponent],
  template: `
    <pmo-card [topBorder]="'accent'">
      <div class="flex items-start justify-between mb-4 border-b border-slate-100 pb-3 gap-4">
        <div>
          <h3 class="text-base font-extrabold text-[#0f2d52] m-0">Tier Calculator</h3>
          <p class="text-[12px] text-slate-500 font-medium m-0 mt-1">
            Answer the governance triggers below to estimate the oversight level your project requires.
          </p>
        </div>
        <button (click)="reset()" class="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer shrink-0">Reset</button>
      </div>

      <!-- Tier trigger checklist -->
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Does the project involve any of the following?</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-5">
        @for (trigger of triggers; track trigger.key) {
          <label class="flex items-start gap-2.5 cursor-pointer select-none py-1">
            <input
              type="checkbox"
              [checked]="selected().has(trigger.key)"
              (change)="toggle(trigger.key)"
              class="mt-0.5 w-4 h-4 rounded border-[#dde2e8] text-[#1e5fa5] focus:ring-[#1e5fa5] cursor-pointer"
            />
            <span class="text-[13px] text-slate-700 leading-snug">
              {{ trigger.label }}
              <span class="block text-[11px] text-slate-400 font-medium">{{ trigger.description }}</span>
            </span>
          </label>
        }
      </div>

      <!-- Estimated cost -->
      <div class="max-w-xs mb-5">
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Estimated total cost</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
          <input
            type="number"
            [value]="budget() ?? ''"
            (input)="setBudget($event)"
            placeholder="0"
            class="w-full h-10 pl-7 pr-3 rounded-lg border border-[#dde2e8] text-sm text-[#0f2d52] focus:outline-none focus:border-[#1e5fa5]"
          />
        </div>
        <p class="text-[11px] text-slate-400 font-medium mt-1 m-0">Used only when no Tier 1 triggers apply.</p>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center gap-3 pt-3 border-t border-slate-100">
        <button (click)="calculate()" class="h-10 px-6 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold shadow-md cursor-pointer transition-colors duration-150">
          Calculate Recommended Tier
        </button>
      </div>

      <!-- Recommendation -->
      @if (recommendation(); as rec) {
        <div class="mt-5 rounded-xl border border-[#dbe4f0] bg-[#eef4fb] p-4">
          <div class="flex items-center gap-3 mb-2">
            <span class="text-xs font-bold text-slate-600">Recommended governance level:</span>
            <pmo-badge [type]="tierTone(rec.tier)" [text]="rec.title"></pmo-badge>
          </div>
          <p class="text-[13px] text-slate-700 leading-relaxed m-0">{{ rec.explanation }}</p>
          @if (rec.firedTriggers.length) {
            <div class="mt-3">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-1">Triggers that applied</p>
              <ul class="space-y-1 m-0 p-0 list-none">
                @for (t of rec.firedTriggers; track t) {
                  <li class="text-[12px] text-slate-600 flex gap-2"><span class="text-[#d4a63a] font-bold">•</span>{{ t }}</li>
                }
              </ul>
            </div>
          }
          <div class="mt-3 flex gap-2 items-start text-[12px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 shrink-0 mt-0.5 text-amber-500">
              <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <span>This is an estimate to help you plan. The PMO confirms the official tier during intake review.</span>
          </div>
        </div>
      }
    </pmo-card>
  `,
})
export class TierCalculatorComponent {
  /** Tier-1 governance triggers (Data Model Inventory §13.4 — Standard Tier 1 Triggers). */
  readonly triggers: TierTriggerOption[] = [
    { key: 'sensitiveData', label: 'Sensitive or regulated data', description: 'CJIS, HIPAA, PII, or other regulated data involvement' },
    { key: 'publicFacing', label: 'Public-facing exposure', description: 'Externally accessible system or resident-facing service' },
    { key: 'identitySecurity', label: 'Identity / authentication / security changes', description: 'Changes to access, authentication, or security posture' },
    { key: 'coreInfra', label: 'Core infrastructure impact', description: 'Affects networks, identity, or shared platforms' },
    { key: 'execVisibility', label: 'CEO Office / Board visibility', description: 'Executive or Board of Supervisors interest' },
    { key: 'vendorDependency', label: 'Vendor / procurement dependency', description: 'Requires a vendor contract or procurement' },
    { key: 'majorCutover', label: 'Major cutover / migration', description: 'Significant data or platform migration or go-live' },
    { key: 'crossAgency', label: 'Cross-team / cross-agency integration', description: 'Integration spanning departments or agencies' },
    { key: 'opsOwnershipChange', label: 'Operational ownership change', description: 'Shifts who operates or supports the service' },
  ];

  readonly selected = signal<Set<string>>(new Set());
  readonly budget = signal<number | null>(null);
  readonly recommendation = signal<TierRecommendation | null>(null);

  toggle(key: string): void {
    const next = new Set(this.selected());
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this.selected.set(next);
  }

  setBudget(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.budget.set(raw === '' ? null : Number(raw));
  }

  reset(): void {
    this.selected.set(new Set());
    this.budget.set(null);
    this.recommendation.set(null);
  }

  calculate(): void {
    const fired = this.triggers.filter((t) => this.selected().has(t.key)).map((t) => t.label);
    const cost = this.budget() ?? 0;

    let tier: ProjectTier;
    let explanation: string;

    if (fired.length > 0) {
      tier = 'Tier1';
      explanation =
        'Tier 1 — Enhanced governance. One or more Tier 1 triggers apply, so the project follows the full G1–G5 gate path with board review, complete evidence, and an accelerated status cadence.';
    } else if (cost >= 250000) {
      tier = 'Tier2';
      explanation =
        'Tier 2 — Standard governance. No Tier 1 triggers apply, but the estimated cost places this project on the full G1–G5 gate path with a standard status cadence.';
    } else {
      tier = 'Tier3';
      explanation =
        'Tier 3 — Lightweight governance. No Tier 1 triggers apply and the estimated cost is modest, so a streamlined gate path with gate-only reporting is expected.';
    }

    this.recommendation.set({ tier, title: TIER_LABELS[tier], explanation, firedTriggers: fired });
  }

  tierTone(tier: ProjectTier): string {
    return tier === 'Tier1' ? 'tier1' : tier === 'Tier2' ? 'tier2' : 'tier3';
  }
}
