import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable empty state.
 *
 * Shown when a data set is legitimately empty (no projects, no submissions,
 * etc. — Pages Inventory §22.2). Every empty state should carry helpful
 * guidance; project an optional action via `[actions]`:
 *
 *   <pmo-empty-state title="No submissions" message="...">
 *     <button actions>Browse Templates</button>
 *   </pmo-empty-state>
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-empty-state',
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-6">
      <div class="w-14 h-14 rounded-2xl bg-slate-50 border border-[#eef2f6] flex items-center justify-center mb-5">
        <svg class="w-7 h-7 text-slate-400" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 0 0 1.5 12v6a2.25 2.25 0 0 0 2.25 2.25h16.5A2.25 2.25 0 0 0 22.5 18v-6a2.25 2.25 0 0 0-2.25-2.25m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v3.75" />
        </svg>
      </div>
      <h2 class="text-base font-extrabold text-[#0f2d52] m-0">{{ title() }}</h2>
      <p class="text-sm text-slate-500 font-medium mt-1.5 max-w-md m-0">{{ message() }}</p>
      <div class="mt-6 flex items-center gap-3">
        <ng-content select="[actions]"></ng-content>
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  title = input<string>('Nothing here yet');
  message = input<string>('There is no data to display.');
}
