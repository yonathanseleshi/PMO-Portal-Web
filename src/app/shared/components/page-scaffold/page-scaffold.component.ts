import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';

/**
 * Standardized scaffold body for pages that exist structurally in Wave 03 but
 * whose deep workflow logic lands in a later wave.
 *
 * Renders a consistent "planned capability" card listing the features the page
 * will provide, so the route resolves, looks intentional, and documents intent
 * — without faking behavior. Pair with `<pmo-page-header>` above it.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-page-scaffold',
  imports: [CommonModule, CardComponent],
  template: `
    <pmo-card [topBorder]="'brand'">
      <div class="p-2">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-[#f1f6fb] border border-[#e2ebf5] flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 text-[#1e5fa5]" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </div>
          <div class="min-w-0">
            <h2 class="text-base font-extrabold text-[#0f2d52] m-0">{{ heading() }}</h2>
            <p class="text-sm text-slate-500 font-medium mt-1 m-0">{{ description() }}</p>
          </div>
        </div>

        @if (plannedFeatures().length > 0) {
          <div class="mt-6 pt-5 border-t border-[#eef2f6]">
            <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 m-0 mb-3">Planned capabilities</p>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 m-0 p-0 list-none">
              @for (feature of plannedFeatures(); track feature) {
                <li class="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <svg class="w-4 h-4 text-[#1e5fa5] shrink-0" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <span>{{ feature }}</span>
                </li>
              }
            </ul>
          </div>
        }

        <div class="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#1e5fa5] bg-[#f1f6fb] border border-[#e2ebf5] rounded-lg px-3 py-2 w-fit">
          <span class="w-1.5 h-1.5 rounded-full bg-[#d4a63a]"></span>
          <span>{{ statusLabel() }}</span>
        </div>

        <ng-content></ng-content>
      </div>
    </pmo-card>
  `,
})
export class PageScaffoldComponent {
  heading = input<string>('');
  description = input<string>('');
  plannedFeatures = input<string[]>([]);
  statusLabel = input<string>('Scaffolded · Wave 03');
}
