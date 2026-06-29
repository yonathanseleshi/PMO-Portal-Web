import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-access-denied',
  imports: [RouterLink],
  template: `
    <div class="flex flex-col items-center justify-center text-center py-24 px-6">
      <div class="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-rose-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>
      <h1 class="text-2xl font-black text-[#0f2d52] tracking-tight m-0">Access Denied</h1>
      <p class="text-sm text-slate-500 font-medium mt-2 max-w-md">
        You do not have access to this resource. If you believe this is an error, contact the PMO administrator.
      </p>
      <a
        routerLink="/dashboard"
        class="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        <span>Return to Dashboard</span>
      </a>
    </div>
  `,
})
export class AccessDeniedComponent {}
