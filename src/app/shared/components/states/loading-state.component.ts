import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Reusable page-level loading state.
 *
 * Renders an accessible spinner with an optional message, or a set of skeleton
 * rows when `variant="skeleton"`. Use on any data-driven page while an API call
 * is in flight (Pages Inventory §22.1).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-loading-state',
  template: `
    @if (variant() === 'skeleton') {
      <div class="space-y-3" role="status" [attr.aria-label]="message()">
        @for (row of skeletonRows; track row) {
          <div class="h-16 rounded-[14px] bg-white border border-[#eef2f6] shadow-sm overflow-hidden relative">
            <div class="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-slate-100/70 to-transparent"></div>
          </div>
        }
        <span class="sr-only">{{ message() }}</span>
      </div>
    } @else {
      <div class="flex flex-col items-center justify-center text-center py-20 px-6" role="status" [attr.aria-label]="message()">
        <svg class="w-8 h-8 text-[#1e5fa5] animate-spin" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" d="M12 3a9 9 0 1 0 9 9" />
        </svg>
        <p class="text-sm font-semibold text-slate-500 mt-4 m-0">{{ message() }}</p>
      </div>
    }
  `,
})
export class LoadingStateComponent {
  message = input<string>('Loading…');
  variant = input<'spinner' | 'skeleton'>('spinner');
  rows = input<number>(4);

  get skeletonRows(): number[] {
    return Array.from({ length: this.rows() }, (_, i) => i);
  }
}
