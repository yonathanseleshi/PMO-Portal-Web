import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent, TierCalculatorComponent } from '../../shared/components';

/**
 * Tier Calculator page (PAGE-GOV-002) — dedicated route hosting the reusable
 * `pmo-tier-calculator`, with PMO governance framing around it.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-tier-calculator-page',
  imports: [RouterLink, PageHeaderComponent, TierCalculatorComponent],
  template: `
    <pmo-page-header title="Tier Calculator" [breadcrumbs]="['Home', 'Tier Calculator']">
      <div actions>
        <a routerLink="/templates" class="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-[#dde2e8] bg-white text-[#0f2d52] hover:bg-slate-50 text-xs font-bold shadow-sm cursor-pointer transition-colors">
          ← Template Library
        </a>
      </div>
    </pmo-page-header>

    <p class="text-sm text-slate-500 leading-relaxed -mt-2 mb-6 max-w-3xl">
      The governance tier sets how much oversight a project needs. Answer the trigger questions below to get a recommended
      tier and an explanation. This is a planning aid — the PMO confirms the official tier during intake review.
    </p>

    <div class="max-w-3xl">
      <pmo-tier-calculator></pmo-tier-calculator>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="rounded-[14px] border border-[#eef2f6] bg-white p-4 shadow-sm border-t-3 border-t-[#0f2d52]">
          <p class="text-sm font-extrabold text-[#0f2d52] m-0">Tier 1</p>
          <p class="text-[12px] text-slate-500 leading-relaxed m-0 mt-1">Enhanced governance. Full G1–G5 gates, board review, accelerated status cadence, complete evidence.</p>
        </div>
        <div class="rounded-[14px] border border-[#eef2f6] bg-white p-4 shadow-sm border-t-3 border-t-[#1e5fa5]">
          <p class="text-sm font-extrabold text-[#0f2d52] m-0">Tier 2</p>
          <p class="text-[12px] text-slate-500 leading-relaxed m-0 mt-1">Standard governance. Full G1–G5 gates with a standard status cadence.</p>
        </div>
        <div class="rounded-[14px] border border-[#eef2f6] bg-white p-4 shadow-sm border-t-3 border-t-[#d4a63a]">
          <p class="text-sm font-extrabold text-[#0f2d52] m-0">Tier 3</p>
          <p class="text-[12px] text-slate-500 leading-relaxed m-0 mt-1">Lightweight governance. Streamlined gates with gate-only reporting.</p>
        </div>
      </div>
    </div>
  `,
})
export class TierCalculatorPageComponent {}
