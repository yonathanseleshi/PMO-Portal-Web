import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * pmo-file-upload — reusable PDF attachment input for submission packages.
 *
 * Frontend-only in Wave 04: it validates and surfaces the selected file but does
 * NOT execute an upload. The selected `File` is emitted to the parent so a later
 * wave can orchestrate the S3 / SharePoint upload (Plan §5.6). Consumers bind the
 * current value and react to `fileChange`.
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

      @if (!value()) {
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
          <span class="text-sm font-bold text-[#0f2d52]">Click to select or drag a PDF here</span>
          <span class="text-[11px] text-slate-400 font-medium">PDF only · up to {{ maxSizeMb() }} MB</span>
          <input type="file" [accept]="accept()" (change)="onFileInput($event)" class="hidden" />
        </label>
      } @else {
        <div class="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-[#dbe4f0] bg-[#eef4fb]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-[#1e5fa5] shrink-0">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold text-[#0f2d52] truncate m-0">{{ value()!.name }}</p>
            <p class="text-[11px] text-slate-500 font-medium m-0">{{ formatSize(value()!.size) }} · Ready to submit</p>
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
  /** Set true by the parent on submit to flag a missing required file. */
  showError = input<boolean>(false);

  /** Current selected file (controlled by the parent). */
  value = input<File | null>(null);
  /** Emitted whenever the selection changes (file or null). */
  fileChange = output<File | null>();

  readonly error = signal<string | null>(null);
  readonly dragging = signal(false);

  onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.acceptFile(input.files?.[0] ?? null);
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
    this.acceptFile(event.dataTransfer?.files?.[0] ?? null);
  }

  remove(): void {
    this.error.set(null);
    this.fileChange.emit(null);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /** Validate a candidate file (PDF + size) and emit it, or set an error. */
  private acceptFile(file: File | null): void {
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      this.error.set('Only PDF files are accepted. Export your completed template to PDF and try again.');
      return;
    }
    if (file.size > this.maxSizeMb() * 1024 * 1024) {
      this.error.set(`That file is larger than the ${this.maxSizeMb()} MB limit.`);
      return;
    }
    this.error.set(null);
    this.fileChange.emit(file);
  }
}
