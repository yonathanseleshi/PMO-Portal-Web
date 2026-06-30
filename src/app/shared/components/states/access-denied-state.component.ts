import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Reusable access-denied state (Pages Inventory §22.5 / PAGE-STATE-001).
 *
 * Used both as the full `/access-denied` route body and inline on pages that
 * resolve but contain a role-restricted region. Access control is enforced by
 * the .NET API; this state only communicates the restriction to the user.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-access-denied-state',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-20 px-6">
      <div class="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-rose-600" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>
      <h1 class="text-2xl font-black text-[#0f2d52] tracking-tight m-0">{{ title() }}</h1>
      <p class="text-sm text-slate-500 font-medium mt-2 max-w-md m-0">{{ message() }}</p>
      @if (showHomeLink()) {
        <a
          routerLink="/dashboard"
          class="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-150"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          <span>Return to Dashboard</span>
        </a>
      }
    </div>
  `,
})
export class AccessDeniedStateComponent {
  title = input<string>('Access Denied');
  message = input<string>(
    'You do not have access to this resource. Access is role- and project-based. If you believe this is an error, contact the PMO administrator.',
  );
  showHomeLink = input<boolean>(true);
}
