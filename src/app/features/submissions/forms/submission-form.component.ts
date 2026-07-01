import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SubmissionsService } from '../../../services/submissions/submissions';
import { Submission, SubmissionType } from '../../../models';
import { buildFormGroup } from '../../../shared/forms/form-config.model';
import {
  BadgeComponent,
  FileUploadComponent,
  FormSectionComponent,
  PageHeaderComponent,
  SubmissionGuidanceComponent,
} from '../../../shared/components';
import { AttachmentConfig, SUBMISSION_FORMS, SubmissionFormConfig } from './submission-form.config';

/** Attachment behavior applied when a form config omits its own. */
const DEFAULT_ATTACHMENT: AttachmentConfig = {
  multiple: false,
  label: 'Completed package (PDF)',
  accept: '.pdf,application/pdf',
  required: true,
  errorMessage: 'A PDF attachment is required to submit.',
};

/**
 * Generic native submission form (PAGE-SUBMISSION-001/002/003 + Gate 3
 * Attestation).
 *
 * One component renders the Intake, Charter, Attestation, and Closure forms —
 * driven by the `submissionType` route data and the {@link SUBMISSION_FORMS}
 * config. It builds a typed reactive form, renders sections via
 * `pmo-form-section`, collects attachment(s), and on submit creates the
 * submission then uploads each selected file before routing to the receipt.
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

        <!-- Attachment(s) -->
        <div class="rounded-[14px] border-t-3 border-t-[#0f2d52] border border-[#eef2f6] bg-white p-5 shadow-sm">
          <div class="flex items-start gap-3 mb-4 border-b border-slate-100 pb-3">
            <span class="shrink-0 w-7 h-7 rounded-lg bg-[#eef4fb] text-[#0f2d52] text-xs font-extrabold flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>
            </span>
            <div>
              <h3 class="text-base font-extrabold text-[#0f2d52] m-0">{{ attachmentConfig.multiple ? 'Attachments' : 'Attachment' }}</h3>
              <p class="text-xs text-slate-500 m-0 mt-1">{{ config.guidance.attachmentNote }}</p>
            </div>
          </div>

          @if (attachmentConfig.multiple) {
            <pmo-file-upload
              [multiple]="true"
              [values]="files()"
              (filesChange)="onFilesChange($event)"
              [accept]="attachmentConfig.accept"
              [required]="attachmentConfig.required"
              [showError]="showAttachmentError()"
              [label]="attachmentConfig.label"
            ></pmo-file-upload>
          } @else {
            <pmo-file-upload
              [value]="attachment()"
              (fileChange)="onFileChange($event)"
              [accept]="attachmentConfig.accept"
              [required]="attachmentConfig.required"
              [showError]="showAttachmentError()"
              [label]="attachmentConfig.label"
            ></pmo-file-upload>
          }

          @if (showAttachmentError()) {
            <p class="text-[11px] font-bold text-rose-600 mt-2 m-0">{{ attachmentConfig.errorMessage }}</p>
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
              <span>{{ submitStatus() }}</span>
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
  readonly attachmentConfig: AttachmentConfig;
  readonly form: FormGroup;

  /** Single-file selection (Intake / Charter / Closure). */
  readonly attachment = signal<File | null>(null);
  /** Multi-file selection (Attestation). */
  readonly files = signal<File[]>([]);

  readonly showAttachmentError = signal(false);
  readonly showValidation = signal(false);
  readonly submitting = signal(false);
  readonly submitError = signal<string | null>(null);
  readonly submitStatus = signal('Submitting…');

  constructor() {
    const type = this.route.snapshot.data['submissionType'] as SubmissionType;
    this.config = SUBMISSION_FORMS[type];
    this.attachmentConfig = this.config.attachment ?? DEFAULT_ATTACHMENT;
    this.form = buildFormGroup(this.fb, this.config.sections);
  }

  onFileChange(file: File | null): void {
    this.attachment.set(file);
    if (file) this.showAttachmentError.set(false);
  }

  onFilesChange(files: File[]): void {
    this.files.set(files);
    if (files.length) this.showAttachmentError.set(false);
  }

  private selectedFiles(): File[] {
    if (this.attachmentConfig.multiple) return this.files();
    const single = this.attachment();
    return single ? [single] : [];
  }

  onSubmit(): void {
    this.submitError.set(null);
    this.form.markAllAsTouched();

    const selected = this.selectedFiles();
    const missingFile = this.attachmentConfig.required && selected.length === 0;
    this.showAttachmentError.set(missingFile);

    if (this.form.invalid || missingFile) {
      this.showValidation.set(true);
      return;
    }

    this.submitting.set(true);
    this.submitStatus.set('Submitting…');
    const firstFileName = selected[0]?.name ?? null;
    const request = this.config.buildRequest(this.form.getRawValue(), firstFileName);

    this.submissionsService.createSubmission(request).subscribe({
      next: (submission) => this.uploadThenComplete(submission, selected),
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Something went wrong submitting your package. Please try again.');
      },
    });
  }

  /**
   * Upload each selected file against the created submission, then route to the
   * receipt. If an upload fails the submission is kept and the user is shown a
   * corrective banner carrying the reference number.
   */
  private uploadThenComplete(submission: Submission, files: File[]): void {
    if (files.length === 0) {
      this.router.navigate(['/submissions/receipt']);
      return;
    }

    this.submitStatus.set('Uploading attachments…');
    const uploads = files.map((file) =>
      this.submissionsService.uploadAttachment(submission.id, file, submission.type).pipe(
        map(() => true),
        catchError(() => of(false)),
      ),
    );

    forkJoin(uploads).subscribe((results) => {
      const failed = results.filter((ok) => !ok).length;
      if (failed > 0) {
        this.submitting.set(false);
        this.submitError.set(
          `Your submission ${submission.referenceNumber} was created, but ${failed} of ${files.length} ` +
            `attachment(s) failed to upload. Please note your reference number and re-upload from the submission later.`,
        );
        return;
      }
      this.router.navigate(['/submissions/receipt']);
    });
  }

  cancel(): void {
    this.router.navigate(['/templates']);
  }
}
