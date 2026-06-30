/**
 * Canonical PMO Portal frontend model barrel.
 *
 * Everything exported here is aligned to the Wave 02 backend contracts
 * (DTOs / entities) except {@link TemplateDefinition}, which is a documented
 * frontend-only placeholder. Import domain types from `../models` — do not
 * redefine governance shapes ad hoc inside feature components.
 */
export * from './enums.model';
export * from './project.model';
export * from './submission.model';
export * from './submission-form.model';
export * from './status-report.model';
export * from './governance.model';
export * from './role-assignment.model';
export * from './template.model';
export * from './user-session.model';
