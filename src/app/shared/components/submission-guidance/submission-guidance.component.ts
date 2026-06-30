import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/** A single ordered step shown in the submission steps sidebar. */
export interface SubmissionStep {
  title: string;
  detail: string;
}

/**
 * pmo-submission-guidance — the supportive sidebar shown alongside native
 * submission forms (Plan §5.7). Communicates what the user is completing, the
 * submission steps, attachment expectations, tips, and what happens after
 * submit, so the portal reads as instructional rather than transactional
 * (Design Guide §7).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-submission-guidance',
  imports: [CommonModule],
  template: `
    <div class="space-y-5 lg:sticky lg:top-4">
      <!-- What you're doing -->
      <div class="rounded-[14px] border border-[#eef2f6] bg-gradient-to-br from-[#0f2d52] to-[#1e5fa5] text-white p-5 shadow-sm">
        <div class="flex items-center gap-2 mb-2">
          @if (gate()) {
            <span class="text-[10px] font-extrabold tracking-wider uppercase bg-white/15 rounded px-2 py-0.5">{{ gate() }}</span>
          }
        </div>
        <h3 class="text-base font-extrabold m-0">{{ heading() }}</h3>
        <p class="text-[13px] text-white/85 leading-relaxed mt-2 m-0">{{ intro() }}</p>
      </div>

      <!-- Submission steps -->
      @if (steps().length) {
        <div class="rounded-[14px] border border-[#eef2f6] bg-white p-5 shadow-sm">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-4">Submission steps</h4>
          <ol class="space-y-4 m-0 p-0 list-none">
            @for (step of steps(); track step.title; let i = $index) {
              <li class="flex gap-3">
                <span class="shrink-0 w-6 h-6 rounded-full bg-[#eef4fb] text-[#0f2d52] text-[11px] font-extrabold flex items-center justify-center">{{ i + 1 }}</span>
                <div>
                  <p class="text-[13px] font-bold text-[#0f2d52] m-0">{{ step.title }}</p>
                  <p class="text-[12px] text-slate-500 leading-relaxed m-0 mt-0.5">{{ step.detail }}</p>
                </div>
              </li>
            }
          </ol>
        </div>
      }

      <!-- Attachment expectations -->
      @if (attachmentNote()) {
        <div class="rounded-[14px] border-l-4 border-l-[#d4a63a] border border-[#eef2f6] bg-white p-4 shadow-sm">
          <p class="text-[11px] font-bold text-[#0f2d52] uppercase tracking-wide m-0 mb-1">Attachment expectations</p>
          <p class="text-[12px] text-slate-600 leading-relaxed m-0">{{ attachmentNote() }}</p>
        </div>
      }

      <!-- Tips -->
      @if (tips().length) {
        <div class="rounded-[14px] border border-[#eef2f6] bg-white p-5 shadow-sm">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-3">Tips</h4>
          <ul class="space-y-2 m-0 p-0 list-none">
            @for (tip of tips(); track tip) {
              <li class="flex gap-2 text-[12px] text-slate-600 leading-relaxed">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5">
                  <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                </svg>
                <span>{{ tip }}</span>
              </li>
            }
          </ul>
        </div>
      }

      <!-- What happens next -->
      @if (whatNext().length) {
        <div class="rounded-[14px] border border-[#eef2f6] bg-[#f7f9fc] p-5 shadow-sm">
          <h4 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mb-3">What happens after you submit</h4>
          <ul class="space-y-2 m-0 p-0 list-none">
            @for (item of whatNext(); track item) {
              <li class="flex gap-2 text-[12px] text-slate-600 leading-relaxed">
                <span class="text-[#1e5fa5] font-bold">→</span>
                <span>{{ item }}</span>
              </li>
            }
          </ul>
        </div>
      }
    </div>
  `,
})
export class SubmissionGuidanceComponent {
  heading = input<string>('');
  intro = input<string>('');
  gate = input<string>('');
  steps = input<SubmissionStep[]>([]);
  tips = input<string[]>([]);
  whatNext = input<string[]>([]);
  attachmentNote = input<string>('');
}
