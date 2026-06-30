import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Page Not Found (PAGE-STATE-002). Catch-all for invalid or outdated routes.
 * Rendered inside the authenticated shell so navigation context is preserved.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-not-found',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-24 px-6">
      <div class="w-16 h-16 rounded-2xl bg-[#f1f6fb] border border-[#e2ebf5] flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-[#1e5fa5]" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
        </svg>
      </div>
      <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-400 m-0">Error 404</p>
      <h1 class="text-2xl font-black text-[#0f2d52] tracking-tight mt-2 m-0">Page not found</h1>
      <p class="text-sm text-slate-500 font-medium mt-2 max-w-md m-0">
        The page you’re looking for doesn’t exist or may have moved. Check the address or head back to your dashboard.
      </p>
      <div class="mt-8 flex items-center gap-3">
        <a routerLink="/dashboard" class="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-150">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          <span>Return to Dashboard</span>
        </a>
        <a routerLink="/learning" class="inline-flex items-center gap-2 h-11 px-5 rounded-lg border border-[#dde2e8] bg-white text-[#0f2d52] text-sm font-bold hover:bg-slate-50 transition-all duration-150">
          Learning &amp; Resources
        </a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
