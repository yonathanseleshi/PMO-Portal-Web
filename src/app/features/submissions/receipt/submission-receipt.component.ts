import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubmissionsService } from '../../../services/submissions/submissions';
import { Submission } from '../../../models';
import { CardComponent, PageHeaderComponent } from '../../../shared/components';

/**
 * Submission Receipt (PAGE-SUBMISSION-004) — confirmation shown after a native
 * submission. Displays the generated reference number, a summary of what was
 * submitted, what happens next, and navigation actions. Reads the just-created
 * submission from {@link SubmissionsService.consumeReceipt}; on a direct visit /
 * refresh it falls back to a generic confirmation.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-submission-receipt',
  imports: [CommonModule, RouterLink, CardComponent, PageHeaderComponent],
  template: `
    <pmo-page-header title="Submission Received" [breadcrumbs]="['Home', 'Submissions', 'Receipt']"></pmo-page-header>

    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Success -->
      <pmo-card [topBorder]="'brand'">
        <div class="flex flex-col items-center text-center py-6">
          <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="w-8 h-8 text-emerald-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 class="text-xl font-extrabold text-[#0f2d52] m-0">Your submission was received</h2>
          <p class="text-sm text-slate-500 leading-relaxed mt-2 mb-5 max-w-md">
            Thank you. Your package has been logged and routed to the PMO for review. Keep your reference number for your records.
          </p>

          <div class="inline-flex flex-col items-center rounded-xl border border-[#dbe4f0] bg-[#eef4fb] px-8 py-4">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reference Number</span>
            <span class="text-2xl font-extrabold text-[#0f2d52] font-mono tracking-tight mt-1">{{ referenceNumber() }}</span>
          </div>
        </div>
      </pmo-card>

      <!-- Summary -->
      @if (receipt(); as r) {
        <pmo-card>
          <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-4">Submission summary</h3>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 m-0">
            <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Type</dt><dd class="text-sm font-bold text-[#0f2d52] m-0">{{ r.type }} · {{ r.templateName }}</dd></div>
            <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Gate</dt><dd class="text-sm text-slate-700 m-0">Gate {{ r.gateNumber }}</dd></div>
            @if (r.projectTitle) {
              <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Project</dt><dd class="text-sm text-slate-700 m-0">{{ r.projectTitle }}</dd></div>
            }
            <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Submitted</dt><dd class="text-sm text-slate-700 m-0">{{ r.submittedAt | date: 'medium' }}</dd></div>
            @if (r.fileName) {
              <div class="sm:col-span-2"><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Attachment</dt><dd class="text-sm text-slate-700 m-0">{{ r.fileName }} · PDF</dd></div>
            }
            <div><dt class="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</dt><dd class="text-sm font-bold text-amber-700 m-0">Pending Review</dd></div>
          </dl>
        </pmo-card>
      }

      <!-- What happens next -->
      <pmo-card>
        <h3 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-4">What happens next</h3>
        <ol class="space-y-3 m-0 p-0 list-none">
          <li class="flex gap-3"><span class="shrink-0 w-6 h-6 rounded-full bg-[#eef4fb] text-[#0f2d52] text-[11px] font-extrabold flex items-center justify-center">1</span><p class="text-[13px] text-slate-600 leading-relaxed m-0">Check your email — a confirmation with your reference number is on its way.</p></li>
          <li class="flex gap-3"><span class="shrink-0 w-6 h-6 rounded-full bg-[#eef4fb] text-[#0f2d52] text-[11px] font-extrabold flex items-center justify-center">2</span><p class="text-[13px] text-slate-600 leading-relaxed m-0">The PMO reviews your package, typically within 5–7 business days.</p></li>
          <li class="flex gap-3"><span class="shrink-0 w-6 h-6 rounded-full bg-[#eef4fb] text-[#0f2d52] text-[11px] font-extrabold flex items-center justify-center">3</span><p class="text-[13px] text-slate-600 leading-relaxed m-0">You'll be notified of the decision. If anything's missing, it will be returned with guidance — not rejected.</p></li>
        </ol>
      </pmo-card>

      <!-- Navigation -->
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <a routerLink="/dashboard" class="h-10 px-5 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold shadow-md cursor-pointer transition-colors inline-flex items-center justify-center">Return to Dashboard</a>
        <a routerLink="/my-projects" class="h-10 px-5 rounded-lg border border-[#dde2e8] bg-white text-[#0f2d52] hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors inline-flex items-center justify-center">View My Projects</a>
        <a routerLink="/templates" class="h-10 px-5 rounded-lg border border-[#dde2e8] bg-white text-[#0f2d52] hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors inline-flex items-center justify-center">Browse Templates</a>
      </div>
    </div>
  `,
})
export class SubmissionReceiptComponent {
  private submissionsService = inject(SubmissionsService);

  readonly receipt = signal<Submission | null>(null);

  constructor() {
    this.receipt.set(this.submissionsService.consumeReceipt());
  }

  referenceNumber(): string {
    return this.receipt()?.referenceNumber ?? 'Pending — check your confirmation email';
  }
}
