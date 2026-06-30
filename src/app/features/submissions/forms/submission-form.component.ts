import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionsService } from '../../../services/submissions/submissions';
import { SubmissionType } from '../../../models';
import { buildFormGroup } from '../../../shared/forms/form-config.model';
import {
  BadgeComponent,
  FileUploadComponent,
  FormSectionComponent,
  PageHeaderComponent,
  SubmissionGuidanceComponent,
} from '../../../shared/components';
import { SUBMISSION_FORMS, SubmissionFormConfig } from './submission-form.config';

/**
 * Generic native submission form (PAGE-SUBMISSION-001/002/003).
 *
 * One component renders the Intake, Charter, and Closure forms — driven by the
 * `submissionType` route data and the {@link SUBMISSION_FORMS} config. It builds
 * a typed reactive form, renders sections via `pmo-form-section`, requires a PDF
 * attachment, and on submit maps the value onto the backend-aligned payload and
 * routes to the receipt. Persistence/upload execution is deferred to Wave 05.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-submission-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageHeaderComponent,
    BadgeComponent,
    FormSectionComponent,
    FileUploadComponent,
    SubmissionGuidanceComponent,
  ],
  template: `
    <pmo-page-header [title]="config.title" [breadcrumbs]="['Home', 'Template Library', config.breadcrumbLabel]">
      <div actions>
        <pmo-badge [type]="'info'" [text]="config.gateLabel"></pmo-badge>
      </div>
    </pmo-page-header>

    <p class="text-sm text-slate-500 leading-relaxed -mt-2 mb-6 max-w-3xl">{{ config.subtitle }}</p>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Form column -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="lg:col-span-2 space-y-6">
        @if (showValidation() && form.invalid) {
          <div class="rounded-xl border border-rose-200 bg-rose-50 p-4 flex gap-2 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 text-rose-500 shrink-0 mt-0.5">
              <path fill-rule="evenodd" d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <p class="text-sm font-bold text-rose-700 m-0">Please complete the required fields highlighted below before submitting.</p>
          </div>
        }

        @for (section of config.sections; track section.id; let i = $index) {
          <pmo-form-section [section]="section" [form]="form" [index]="i"></pmo-form-section>
        }

        <!-- PDF attachment -->
        <div class="rounded-[14px] border-t-3 border-t-[#0f2d52] border border-[#eef2f6] bg-white p-5 shadow-sm">
          <div class="flex items-start gap-3 mb-4 border-b border-slate-100 pb-3">
            <span class="shrink-0 w-7 h-7 rounded-lg bg-[#eef4fb] text-[#0f2d52] text-xs font-extrabold flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
            </span>
            <div>
              <h3 class="text-base font-extrabold text-[#0f2d52] m-0">Attachment</h3>
              <p class="text-xs text-slate-500 m-0 mt-1">{{ config.guidance.attachmentNote }}</p>
            </div>
          </div>
          <pmo-file-upload
            [value]="attachment()"
            (fileChange)="onFileChange($event)"
            [required]="true"
            [showError]="showAttachmentError()"
            label="Completed package (PDF)"
          ></pmo-file-upload>
          @if (showAttachmentError()) {
            <p class="text-[11px] font-bold text-rose-600 mt-2 m-0">A PDF attachment is required to submit.</p>
          }
        </div>

        @if (submitError()) {
          <div class="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p class="text-sm font-bold text-rose-700 m-0">{{ submitError() }}</p>
          </div>
        }

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" (click)="cancel()" class="h-10 px-5 rounded-lg border border-[#dde2e8] bg-white text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer transition-colors">
            Cancel
          </button>
          <button type="submit" [disabled]="submitting()" class="h-10 px-6 rounded-lg bg-[#0f2d52] hover:bg-[#1e5fa5] text-white text-xs font-bold shadow-md cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2">
            @if (submitting()) {
              <span class="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
              <span>Submitting…</span>
            } @else {
              <span>{{ config.submitLabel }}</span>
            }
          </button>
        </div>
      </form>

      <!-- Guidance sidebar -->
      <pmo-submission-guidance
        [gate]="config.gateLabel"
        [heading]="config.guidance.heading"
        [intro]="config.guidance.intro"
        [steps]="config.guidance.steps"
        [tips]="config.guidance.tips"
        [whatNext]="config.guidance.whatNext"
        [attachmentNote]="config.guidance.attachmentNote"
      ></pmo-submission-guidance>
    </div>
  `,
})
export class SubmissionFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private submissionsService = inject(SubmissionsService);

  readonly config: SubmissionFormConfig;
  readonly form: FormGroup;

  readonly attachment = signal<File | null>(null);
  readonly showAttachmentError = signal(false);
  readonly showValidation = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);

  constructor() {
    const type = this.route.snapshot.data['submissionType'] as SubmissionType;
    this.config = SUBMISSION_FORMS[type];
    this.form = buildFormGroup(this.fb, this.config.sections);
  }

  onFileChange(file: File | null): void {
    this.attachment.set(file);
    if (file) this.showAttachmentError.set(false);
  }

  onSubmit(): void {
    this.submitError.set(null);
    this.form.markAllAsTouched();
    const missingFile = !this.attachment();
    this.showAttachmentError.set(missingFile);

    if (this.form.invalid || missingFile) {
      this.showValidation.set(true);
      return;
    }

    this.submitting.set(true);
    const request = this.config.buildRequest(this.form.getRawValue(), this.attachment()?.name ?? null);
    this.submissionsService.createSubmission(request).subscribe({
      next: () => this.router.navigate(['/submissions/receipt']),
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Something went wrong submitting your package. Please try again.');
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/templates']);
  }
}
