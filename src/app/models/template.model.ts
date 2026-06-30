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
