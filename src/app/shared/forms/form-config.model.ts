import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Declarative form-configuration model used by the native PMO submission forms.
 *
 * Forms (Intake / Charter / Closure) declare their sections and fields as data
 * and render them through the shared `pmo-form-section` component. This keeps
 * every form visually consistent with the Design Guide (§5.3 Forms) — clear
 * labels, required markers, inline validation, logical grouping — without
 * duplicating markup per page.
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'currency'
  | 'date'
  | 'email'
  | 'url'
  | 'select'
  | 'checkbox';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  /** Form control name (aligns to a backend field name where one exists). */
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  /** Supportive helper text rendered under the control (Design Guide §7). */
  helper?: string;
  placeholder?: string;
  /** Options for `select` fields. */
  options?: SelectOption[];
  /** Rows for `textarea` fields. */
  rows?: number;
  /** Span the full section width instead of a single grid column. */
  full?: boolean;
}

export interface FormSectionConfig {
  id: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

/**
 * Build a reactive {@link FormGroup} from a list of section configs. Validators
 * are derived from each field (`required`, `email`). Numeric fields initialize
 * to `null`, checkboxes to `false`, everything else to an empty string.
 */
export function buildFormGroup(fb: FormBuilder, sections: FormSectionConfig[]): FormGroup {
  const controls: Record<string, unknown> = {};
  for (const section of sections) {
    for (const field of section.fields) {
      const validators = [];
      if (field.required) {
        validators.push(field.type === 'checkbox' ? Validators.requiredTrue : Validators.required);
      }
      if (field.type === 'email') {
        validators.push(Validators.email);
      }
      const initial =
        field.type === 'checkbox'
          ? false
          : field.type === 'number' || field.type === 'currency'
            ? null
            : '';
      controls[field.key] = [initial, validators];
    }
  }
  return fb.group(controls);
}
