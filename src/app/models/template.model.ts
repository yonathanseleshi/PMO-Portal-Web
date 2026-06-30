/**
 * TemplateDefinition — frontend-only contract for the Template Library.
 *
 * Templates are not part of the Wave 02 backend model set (template files live
 * in SharePoint; the portal stores metadata/links only — Application Guide
 * §7.5). This shape is intentionally a stable placeholder for a future
 * `/api/templates` endpoint and is kept here so Template typing is centralized
 * rather than redefined ad hoc per component.
 */
export interface TemplateDefinition {
  id: string;
  name: string;
  version: string;
  lastUpdated: string;
  gate?: string;
  tierApplicability: string;
  description: string;
  templateUrl: string;
  instructionsUrl: string;
  submitEnabled: boolean;
  generatedByPmo?: boolean;
  availableActions?: string[];
}

/**
 * TemplateGuidance — frontend-only instructional content for the Template Detail
 * surface (PAGE-TEMPLATE-002). Sourced from the PMO operating model and template
 * instruction materials; not a backend entity. Keeps the detail page genuinely
 * instructional rather than a static download screen.
 */
export interface TemplateGuidance {
  templateId: string;
  /** Why the template exists. */
  purpose: string;
  /** When in the lifecycle a user should reach for it. */
  whenToUse: string;
  /** Which governance gate it supports and what that gate decides. */
  gateContext: string;
  /** The major sections a completed package contains. */
  keySections: string[];
  /** What the user should gather before starting the submission. */
  prepareBeforeSubmission: string[];
  /** Native submission route, when this template supports portal submission. */
  submissionRoute?: string;
}
