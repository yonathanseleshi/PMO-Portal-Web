import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * pmo-file-upload — reusable attachment input for submission packages.
 *
 * Two modes, selected via the `multiple` input:
 *  - Single (default): one PDF, controlled via `[value]` / `(fileChange)`. Used
 *    by Intake / Charter / Closure — behavior unchanged from Wave 04.
 *  - Multiple: several planning artifacts of mixed formats, controlled via
 *    `[values]` / `(filesChange)`. Used by the Gate 3 Attestation form, which
 *    allows a broader set of allowed extensions (see `accept`).
 *
 * The component validates and surfaces the selection but does NOT execute an
 * upload; the parent form orchestrates the upload after the submission is
 * created (Wave 05).
 *
 * @example
 * <pmo-file-upload
 *   [value]="attachment()"
 *   (fileChange)="attachment.set($event)"
 *   label="Attach the completed package (PDF)"
 *   [required]="true" />
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-file-upload',
  imports: [CommonModule],
  template: `
    <div>
      @if (label()) {
        <label class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
          {{ label() }}
          @if (required()) {
            <span class="text-rose-600">*</span>
          }
        </label>
      }

      <!-- Drop zone (always shown in multiple mode; only when empty in single mode) -->
      @if (multiple() || !value()) {
        <label
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave()"
          (drop)="onDrop($event)"
          [class.border-[#1e5fa5]]="dragging()"
          [class.bg-[#eef4fb]]="dragging()"
          [class.border-rose-300]="showError()"
          class="flex flex-col items-center justify-center gap-2 w-full px-4 py-7 rounded-xl border-2 border-dashed border-[#cdd7e3] bg-slate-50/60 hover:bg-slate-50 cursor-pointer transition-colors duration-150 text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-[#1e5fa5]">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <span class="text-sm font-bold text-[#0f2d52]">{{ dropLabel() }}</span>
          <span class="text-[11px] text-slate-400 font-medium">{{ acceptHint() }} · up to {{ maxSizeMb() }} MB each</span>
          <input type="file" [accept]="accept()" [multiple]="multiple()" (change)="onFileInput($event)" class="hidden" />
        </label>
      }

      <!-- Single-file summary -->
      @if (!multiple() && value(); as file) {
        <div class="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#dbe4f0] bg-[#eef4fb]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-[#1e5fa5] shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold text-[#0f2d52] truncate m-0">{{ file.name }}</p>
            <p class="text-[11px] text-slate-500 font-medium m-0">{{ formatSize(file.size) }} · Ready to submit</p>
          </div>
          <label class="text-[11px] font-bold text-[#1e5fa5] hover:text-[#0f2d52] cursor-pointer shrink-0">
            Replace
            <input type="file" [accept]="accept()" (change)="onFileInput($event)" class="hidden" />
          </label>
          <button type="button" (click)="remove()" class="text-[11px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer shrink-0">
            Remove
          </button>
        </div>
      }

      <!-- Multi-file list -->
      @if (multiple() && values().length) {
        <ul class="mt-3 space-y-2 m-0 p-0 list-none">
          @for (file of values(); track file.name + file.size; let i = $index) {
            <li class="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl border border-[#dbe4f0] bg-[#eef4fb]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-[#1e5fa5] shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <div class="min-w-0 flex-1">
                <p class="text-[13px] font-bold text-[#0f2d52] truncate m-0">{{ file.name }}</p>
                <p class="text-[11px] text-slate-500 font-medium m-0">{{ formatSize(file.size) }}</p>
              </div>
              <button type="button" (click)="removeAt(i)" class="text-[11px] font-bold text-slate-400 hover:text-rose-600 cursor-pointer shrink-0">
                Remove
              </button>
            </li>
          }
        </ul>
      }

      @if (hint() && !error()) {
        <p class="text-[11px] text-slate-400 font-medium mt-1 m-0">{{ hint() }}</p>
      }
      @if (error()) {
        <p class="text-[11px] font-bold text-rose-600 mt-1 m-0">{{ error() }}</p>
      }
    </div>
  `,
})
export class FileUploadComponent {
  label = input<string>('Attach PDF');
  hint = input<string>('');
  accept = input<string>('.pdf,application/pdf');
  maxSizeMb = input<number>(25);
  required = input<boolean>(false);
  /** When true, accept several files (planning artifacts) instead of one PDF. */
  multiple = input<boolean>(false);
  /** Set true by the parent on submit to flag a missing required file. */
  showError = input<boolean>(false);

  /** Current selected file in single mode (controlled by the parent). */
  value = input<File | null>(null);
  /** Current selected files in multiple mode (controlled by the parent). */
  values = input<File[]>([]);

  /** Emitted whenever the single-mode selection changes (file or null). */
  fileChange = output<File | null>();
  /** Emitted whenever the multiple-mode selection changes. */
  filesChange = output<File[]>();

  readonly error = signal<string | null>(null);
  readonly dragging = signal(false);

  dropLabel(): string {
    if (this.multiple()) {
      return 'Click to select or drag planning artifacts here';
    }
    return 'Click to select or drag a PDF here';
  }

  acceptHint(): string {
    return this.multiple() ? 'PDF, Office, images and more' : 'PDF only';
  }

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.acceptFiles(input.files);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDragLeave(): void {
    this.dragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    this.acceptFiles(event.dataTransfer?.files ?? null);
  }

  remove(): void {
    this.error.set(null);
    this.fileChange.emit(null);
  }

  removeAt(index: number): void {
    this.error.set(null);
    const next = this.values().filter((_, i) => i !== index);
    this.filesChange.emit(next);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /** Validate and emit the candidate file(s), or set an error. */
  private acceptFiles(list: FileList | null): void {
    if (!list || list.length === 0) return;

    if (!this.multiple()) {
      this.acceptSingle(list[0]);
      return;
    }

    const accepted: File[] = [];
    for (const file of Array.from(list)) {
      if (!this.isAllowedType(file)) {
        this.error.set(`"${file.name}" is not an accepted file type.`);
        return;
      }
      if (this.isTooLarge(file)) {
        this.error.set(`"${file.name}" is larger than the ${this.maxSizeMb()} MB limit.`);
        return;
      }
      accepted.push(file);
    }
    this.error.set(null);
    // Append to the existing selection, de-duplicating by name + size.
    const existing = this.values();
    const merged = [...existing];
    for (const file of accepted) {
      if (!merged.some((f) => f.name === file.name && f.size === file.size)) {
        merged.push(file);
      }
    }
    this.filesChange.emit(merged);
  }

  private acceptSingle(file: File): void {
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      this.error.set('Only PDF files are accepted. Export your completed template to PDF and try again.');
      return;
    }
    if (this.isTooLarge(file)) {
      this.error.set(`That file is larger than the ${this.maxSizeMb()} MB limit.`);
      return;
    }
    this.error.set(null);
    this.fileChange.emit(file);
  }

  private isTooLarge(file: File): boolean {
    return file.size > this.maxSizeMb() * 1024 * 1024;
  }

  /** True if the file matches the `accept` list (by extension or MIME type). */
  private isAllowedType(file: File): boolean {
    const accept = this.accept().trim();
    if (!accept || accept === '*' || accept === '*/*') return true;
    const tokens = accept.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    if (tokens.length === 0) return true;
    const name = file.name.toLowerCase();
    const mime = (file.type || '').toLowerCase();
    return tokens.some((token) => {
      if (token.startsWith('.')) return name.endsWith(token);
      if (token.endsWith('/*')) return mime.startsWith(token.slice(0, -1));
      return mime === token;
    });
  }
}
