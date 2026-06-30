import { ChangeDetectionStrategy, Component, output, input } from '@angular/core';

/**
 * Reusable error state with an optional retry action.
 *
 * Shown when an API/network call fails (Pages Inventory §22.3). Bind `(retry)`
 * to re-run the failed load. A correlation id can be surfaced to support, in
 * line with the Application Guide's consistent error-response shape.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-error-state',
  template: `
    <div class="flex flex-col items-center justify-center text-center py-16 px-6">
      <div class="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-5">
        <svg class="w-7 h-7 text-rose-600" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <h2 class="text-base font-extrabold text-[#0f2d52] m-0">{{ title() }}</h2>
      <p class="text-sm text-slate-500 font-medium mt-1.5 max-w-md m-0">{{ message() }}</p>
      @if (correlationId()) {
        <p class="text-[11px] text-slate-400 font-mono mt-2 m-0">Reference: {{ correlationId() }}</p>
      }
      @if (showRetry()) {
        <button
          type="button"
          (click)="retry.emit()"
          class="mt-6 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-sm font-bold shadow-sm transition-colors duration-150"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992V4.356M3.75 12a8.25 8.25 0 0 1 13.803-6.075L20.25 9m0 6a8.25 8.25 0 0 1-13.803 6.075L3.75 18m0 0v-4.5m0 4.5h4.5" />
          </svg>
          <span>Try again</span>
        </button>
      }
    </div>
  `,
})
export class ErrorStateComponent {
  title = input<string>('Something went wrong');
  message = input<string>('We could not load this content. Please try again.');
  correlationId = input<string | null>(null);
  showRetry = input<boolean>(true);
  retry = output<void>();
}
