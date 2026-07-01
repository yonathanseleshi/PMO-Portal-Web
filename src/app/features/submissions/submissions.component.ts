import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SubmissionsService } from '../../services/submissions/submissions';
import { AuthService } from '../../services/auth/auth';
import {
  SUBMISSION_STATUS_LABELS,
  SUBMISSION_STATUS_TONE,
  SUBMISSION_TYPE_LABELS,
  Submission,
  SubmissionDetailResponse,
  SubmissionStatus,
  SubmissionType,
} from '../../models';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

/** A reviewer decision offered in the detail panel. */
interface ReviewAction {
  decision: SubmissionStatus;
  label: string;
  /** Requires a returned reason before it can be applied. */
  needsReason: boolean;
  classes: string;
}

const REVIEW_ACTIONS: ReviewAction[] = [
  { decision: 'UnderReview', label: 'Mark Under Review', needsReason: false, classes: 'bg-sky-600 hover:bg-sky-700 text-white' },
  { decision: 'Approved', label: 'Approve', needsReason: false, classes: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  { decision: 'Returned', label: 'Return for Revision', needsReason: true, classes: 'bg-amber-500 hover:bg-amber-600 text-white' },
  { decision: 'Deferred', label: 'Defer', needsReason: false, classes: 'bg-slate-500 hover:bg-slate-600 text-white' },
  { decision: 'Rejected', label: 'Reject', needsReason: true, classes: 'bg-rose-600 hover:bg-rose-700 text-white' },
];

/**
 * Governance Submissions Queue (PMO operational surface).
 *
 * Rewritten in Wave 05 to use the canonical {@link SubmissionsService}. Loads
 * the triage queue (all four submission types, including Gate 3 Attestation),
 * supports status/type/reviewer filtering, and opens a detail panel that shows
 * the typed detail fields, attachments (with presigned download links), and the
 * reviewer decision actions.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-submissions',
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent, PageHeaderComponent],
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css',
})
export class SubmissionsComponent {
  private submissionsService = inject(SubmissionsService);
  private auth = inject(AuthService);

  readonly typeLabels = SUBMISSION_TYPE_LABELS;
  readonly reviewActions = REVIEW_ACTIONS;

  readonly submissions = signal<Submission[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);

  // --- Filters --------------------------------------------------------------
  readonly statusFilter = signal<SubmissionStatus | ''>('');
  readonly typeFilter = signal<SubmissionType | ''>('');

  readonly statusOptions: SubmissionStatus[] = [
    'PendingReview', 'UnderReview', 'Approved', 'Returned', 'Deferred', 'Rejected',
  ];
  readonly typeOptions: SubmissionType[] = ['Intake', 'Charter', 'Attestation', 'Closure'];

  readonly filtered = computed(() => {
    const status = this.statusFilter();
    const type = this.typeFilter();
    return this.submissions().filter((s) => {
      if (status && s.status !== status) return false;
      if (type && s.type !== type) return false;
      return true;
    });
  });

  // --- Detail panel ---------------------------------------------------------
  readonly detail = signal<SubmissionDetailResponse | null>(null);
  readonly reviewNotes = signal('');
  readonly returnedReason = signal('');
  readonly reviewSaving = signal(false);
  readonly reviewError = signal<string | null>(null);
  readonly downloadError = signal<string | null>(null);

  /** True for operational PMO users (PMO Lead / PMO Analyst). */
  readonly isPmoUser = computed(() => this.auth.isPMOUser());

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.submissionsService.getQueue().subscribe({
      next: (items) => {
        this.submissions.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set('We could not load the submissions queue. Please try again.');
        this.loading.set(false);
      },
    });
  }

  // --- Display helpers ------------------------------------------------------
  statusLabel(status: SubmissionStatus): string {
    return SUBMISSION_STATUS_LABELS[status];
  }

  statusTone(status: SubmissionStatus): string {
    return SUBMISSION_STATUS_TONE[status];
  }

  typeLabel(type: SubmissionType): string {
    return SUBMISSION_TYPE_LABELS[type];
  }

  // --- Filter setters -------------------------------------------------------
  onStatusFilter(value: string): void {
    this.statusFilter.set(value as SubmissionStatus | '');
  }

  onTypeFilter(value: string): void {
    this.typeFilter.set(value as SubmissionType | '');
  }

  clearFilters(): void {
    this.statusFilter.set('');
    this.typeFilter.set('');
  }

  // --- Detail panel ---------------------------------------------------------
  openDetail(submission: Submission): void {
    this.detail.set(null);
    this.reviewNotes.set('');
    this.returnedReason.set('');
    this.reviewError.set(null);
    this.downloadError.set(null);
    this.submissionsService.getSubmissionDetail(submission.id).subscribe({
      next: (d) => this.detail.set(d ?? null),
      error: () => this.reviewError.set('We could not load this submission. Please try again.'),
    });
  }

  closeDetail(): void {
    this.detail.set(null);
  }

  /** The detail fields to display, keyed for the typed section of the panel. */
  detailEntries(): { label: string; value: string }[] {
    const d = this.detail();
    if (!d) return [];
    const source =
      d.intakeDetail ?? d.charterDetail ?? d.attestationDetail ?? d.closureDetail ?? null;
    if (!source) return [];
    return Object.entries(source)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({ label: this.humanize(key), value: this.stringify(value) }));
  }

  private humanize(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (c) => c.toUpperCase())
      .trim();
  }

  private stringify(value: unknown): string {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  }

  // --- Attachments ----------------------------------------------------------
  downloadAttachment(attachmentId: string): void {
    const d = this.detail();
    if (!d) return;
    this.downloadError.set(null);
    this.submissionsService.getAttachmentDownloadUrl(d.submission.id, attachmentId).subscribe({
      next: (res) => {
        if (typeof window !== 'undefined') {
          window.open(res.url, '_blank', 'noopener');
        }
      },
      error: () => this.downloadError.set('We could not generate a download link. Please try again.'),
    });
  }

  // --- Review actions -------------------------------------------------------
  applyReview(action: ReviewAction): void {
    const d = this.detail();
    if (!d) return;

    if (action.needsReason && !this.returnedReason().trim()) {
      this.reviewError.set('Please provide a reason before you return or reject this submission.');
      return;
    }

    this.reviewSaving.set(true);
    this.reviewError.set(null);
    this.submissionsService
      .reviewSubmission(d.submission.id, {
        decision: action.decision,
        reviewNotes: this.reviewNotes().trim() || null,
        returnedReason: this.returnedReason().trim() || null,
      })
      .subscribe({
        next: (updated) => {
          this.reviewSaving.set(false);
          if (updated) {
            this.submissions.update((list) => list.map((s) => (s.id === updated.id ? updated : s)));
            this.detail.set({ ...d, submission: updated });
          }
          this.load();
        },
        error: () => {
          this.reviewSaving.set(false);
          this.reviewError.set('We could not record that decision. Please try again.');
        },
      });
  }
}
