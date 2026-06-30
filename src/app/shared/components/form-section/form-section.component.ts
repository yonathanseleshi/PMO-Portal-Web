import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../card/card.component';
import { FieldConfig, FieldType, FormSectionConfig } from '../../forms/form-config.model';

/**
 * pmo-form-section — renders one declarative {@link FormSectionConfig} as a card
 * with a numbered header and a responsive grid of labelled, validated controls.
 *
 * Reused by every native submission form so field styling, required markers,
 * helper text, and inline validation stay consistent (Design Guide §5.3).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-form-section',
  imports: [CommonModule, ReactiveFormsModule, CardComponent],
  template: `
    <pmo-card [topBorder]="'brand'">
      <div class="flex items-start gap-3 mb-5 border-b border-slate-100 pb-3">
        @if (index() !== null) {
          <span
            class="shrink-0 w-7 h-7 rounded-lg bg-[#eef4fb] text-[#0f2d52] text-xs font-extrabold flex items-center justify-center mt-0.5"
            >{{ index()! + 1 }}</span
          >
        }
        <div>
          <h3 class="text-base font-extrabold text-[#0f2d52] m-0">{{ section().title }}</h3>
          @if (section().description) {
            <p class="text-xs text-slate-500 leading-relaxed m-0 mt-1">{{ section().description }}</p>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5" [formGroup]="form()">
        @for (field of section().fields; track field.key) {
          <div [class.md:col-span-2]="field.full || field.type === 'textarea' || field.type === 'checkbox'">
            @if (field.type === 'checkbox') {
              <label class="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  [formControlName]="field.key"
                  class="mt-0.5 w-4 h-4 rounded border-[#dde2e8] text-[#1e5fa5] focus:ring-[#1e5fa5] cursor-pointer"
                />
                <span class="text-sm text-slate-700 leading-snug">
                  {{ field.label }}
                  @if (field.required) {
                    <span class="text-rose-600 font-bold">*</span>
                  }
                  @if (field.helper) {
                    <span class="block text-[11px] text-slate-400 font-medium mt-0.5">{{ field.helper }}</span>
                  }
                </span>
              </label>
            } @else {
              <label [attr.for]="field.key" class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {{ field.label }}
                @if (field.required) {
                  <span class="text-rose-600">*</span>
                }
              </label>

              @switch (field.type) {
                @case ('textarea') {
                  <textarea
                    [id]="field.key"
                    [formControlName]="field.key"
                    [rows]="field.rows || 3"
                    [placeholder]="field.placeholder || ''"
                    [class]="controlClasses(field)"
                  ></textarea>
                }
                @case ('select') {
                  <select [id]="field.key" [formControlName]="field.key" [class]="controlClasses(field) + ' bg-white'">
                    <option value="">Select…</option>
                    @for (opt of field.options; track opt.value) {
                      <option [value]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                }
                @case ('currency') {
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input
                      type="number"
                      [id]="field.key"
                      [formControlName]="field.key"
                      [placeholder]="field.placeholder || '0'"
                      class="w-full h-10 pl-7 pr-3 rounded-lg border text-sm text-[#0f2d52] focus:outline-none focus:border-[#1e5fa5]"
                      [class.border-rose-300]="isInvalid(field.key)"
                      [class.border-[#dde2e8]]="!isInvalid(field.key)"
                    />
                  </div>
                }
                @default {
                  <input
                    [type]="inputType(field.type)"
                    [id]="field.key"
                    [formControlName]="field.key"
                    [placeholder]="field.placeholder || ''"
                    [class]="controlClasses(field)"
                  />
                }
              }

              @if (field.helper) {
                <p class="text-[11px] text-slate-400 font-medium mt-1 m-0">{{ field.helper }}</p>
              }
              @if (isInvalid(field.key)) {
                <p class="text-[11px] font-bold text-rose-600 mt-1 m-0">
                  @if (hasError(field.key, 'email')) {
                    Enter a valid email address.
                  } @else {
                    {{ field.label }} is required.
                  }
                </p>
              }
            }
          </div>
        }
      </div>
    </pmo-card>
  `,
})
export class FormSectionComponent {
  section = input.required<FormSectionConfig>();
  form = input.required<FormGroup>();
  /** Optional step number shown in the section header badge. */
  index = input<number | null>(null);

  inputType(type: FieldType): string {
    switch (type) {
      case 'number':
        return 'number';
      case 'date':
        return 'date';
      case 'email':
        return 'email';
      case 'url':
        return 'url';
      default:
        return 'text';
    }
  }

  controlClasses(field: FieldConfig): string {
    const base =
      field.type === 'textarea'
        ? 'w-full px-3 py-2 rounded-lg border text-sm text-[#0f2d52] leading-relaxed focus:outline-none focus:border-[#1e5fa5] resize-y'
        : 'w-full h-10 px-3 rounded-lg border text-sm text-[#0f2d52] focus:outline-none focus:border-[#1e5fa5]';
    return `${base} ${this.isInvalid(field.key) ? 'border-rose-300' : 'border-[#dde2e8]'}`;
  }

  isInvalid(key: string): boolean {
    const c = this.form().get(key);
    return !!c && c.invalid && c.touched;
  }

  hasError(key: string, error: string): boolean {
    const c = this.form().get(key);
    return !!c && c.touched && c.hasError(error);
  }
}
