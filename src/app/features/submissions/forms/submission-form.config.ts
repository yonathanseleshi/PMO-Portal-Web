import {
  CreateAnySubmissionRequest,
  ProjectTier,
  ClosureOutcome,
  SubmissionType,
} from '../../../models';
import { FormSectionConfig } from '../../../shared/forms/form-config.model';
import { SubmissionStep } from '../../../shared/components/submission-guidance/submission-guidance.component';

/**
 * Declarative configuration for the three native submission forms (Intake,
 * Charter, Closure). Each entry drives the generic `SubmissionFormComponent`:
 * the sections/fields rendered, the supportive guidance sidebar, and a
 * `buildRequest` that maps the flat form value onto the backend-aligned
 * envelope + detail payload (see `submission-form.model.ts`).
 *
 * Field `key`s match the Wave 02 entity field names wherever a backing field
 * exists. A few fields capture context for which Wave 02 has no column yet
 * (e.g. key stakeholders, approvals readiness); these are flagged in comments
 * and intentionally omitted from the typed payload — Wave 05 maps them.
 */

export interface SubmissionGuidanceConfig {
  heading: string;
  intro: string;
  steps: SubmissionStep[];
  tips: string[];
  whatNext: string[];
  attachmentNote: string;
}

export interface SubmissionFormConfig {
  type: SubmissionType;
  title: string;
  subtitle: string;
  submitLabel: string;
  breadcrumbLabel: string;
  gateLabel: string;
  templateId: string;
  templateName: string;
  sections: FormSectionConfig[];
  guidance: SubmissionGuidanceConfig;
  buildRequest: (value: Record<string, unknown>, fileName: string | null) => CreateAnySubmissionRequest;
}

// --- shared option sets -----------------------------------------------------

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const TIER_OPTIONS = [
  { value: 'Tier1', label: 'Tier 1 — Enhanced governance' },
  { value: 'Tier2', label: 'Tier 2 — Standard governance' },
  { value: 'Tier3', label: 'Tier 3 — Lightweight governance' },
];

const FUNDING_STATUS_OPTIONS = [
  { value: 'Identified', label: 'Identified' },
  { value: 'Requested', label: 'Requested' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Unfunded', label: 'Unfunded' },
];

const CLOSURE_OUTCOME_OPTIONS = [
  { value: 'Successful', label: 'Successful' },
  { value: 'PartiallySuccessful', label: 'Partially Successful' },
  { value: 'Cancelled', label: 'Cancelled' },
  { value: 'OnHold', label: 'On Hold' },
];

// --- coercion helpers -------------------------------------------------------

/** Empty string → null; otherwise the trimmed string. */
function str(value: unknown): string | null {
  const s = (value ?? '').toString().trim();
  return s.length ? s : null;
}

/** Numeric value or null. */
function num(value: unknown): number | null {
  return value === null || value === undefined || value === '' ? null : Number(value);
}

function bool(value: unknown): boolean {
  return value === true;
}

// ============================================================================
// INTAKE (Gate 1)
// ============================================================================

const INTAKE_SECTIONS: FormSectionConfig[] = [
  {
    id: 'project',
    title: 'Project Information',
    description: 'High-level identity of the request.',
    fields: [
      { key: 'projectTitle', label: 'Project Title', type: 'text', required: true, full: true, placeholder: 'e.g. Aviation Lease Management System' },
      { key: 'description', label: 'Short Description', type: 'textarea', required: true, full: true, rows: 2, helper: 'One or two sentences summarizing the request.' },
      { key: 'priority', label: 'Priority', type: 'select', options: PRIORITY_OPTIONS },
      { key: 'serviceNowTicketNumber', label: 'ServiceNow Ticket #', type: 'text', helper: 'Optional, if a ticket already exists.' },
    ],
  },
  {
    id: 'submitter',
    title: 'Submitter Information',
    description: 'Who is requesting this project.',
    fields: [
      { key: 'submitterName', label: 'Your Name', type: 'text', required: true },
      { key: 'submitterEmail', label: 'Your Email', type: 'email', required: true },
      { key: 'submitterDepartment', label: 'Department', type: 'text' },
      { key: 'submitterRole', label: 'Your Role', type: 'text', placeholder: 'e.g. Division Manager' },
    ],
  },
  {
    id: 'sponsor',
    title: 'Sponsor Information',
    description: 'The executive sponsor accountable for this project.',
    fields: [
      { key: 'sponsorName', label: 'Sponsor Name', type: 'text', required: true },
      { key: 'sponsorEmail', label: 'Sponsor Email', type: 'email', required: true },
      { key: 'sponsorAcknowledged', label: 'The sponsor has reviewed and supports this request.', type: 'checkbox', required: true },
    ],
  },
  {
    id: 'businessNeed',
    title: 'Business Need',
    description: 'The problem or opportunity driving this request.',
    fields: [{ key: 'businessNeed', label: 'Business Need / Problem Statement', type: 'textarea', required: true, full: true, rows: 4 }],
  },
  {
    id: 'objectives',
    title: 'Objectives',
    fields: [{ key: 'objectives', label: 'Objectives', type: 'textarea', required: true, full: true, rows: 3, helper: 'What this project should achieve.' }],
  },
  {
    id: 'scope',
    title: 'Scope',
    fields: [
      { key: 'inScope', label: 'In Scope', type: 'textarea', full: true, rows: 3 },
      { key: 'outOfScope', label: 'Out of Scope', type: 'textarea', full: true, rows: 3 },
    ],
  },
  {
    id: 'stakeholders',
    title: 'Key Stakeholders',
    // Captured here for context; Wave 05 maps these to ProjectStakeholder records.
    fields: [{ key: 'keyStakeholders', label: 'Key Stakeholders', type: 'textarea', full: true, rows: 3, helper: 'List names, roles, and departments of key stakeholders.' }],
  },
  {
    id: 'benefits',
    title: 'Expected Benefits',
    fields: [{ key: 'expectedBenefits', label: 'Expected Benefits / Outcomes', type: 'textarea', required: true, full: true, rows: 3 }],
  },
  {
    id: 'risks',
    title: 'Top Risks',
    fields: [{ key: 'knownRisks', label: 'Known Risks', type: 'textarea', full: true, rows: 3 }],
  },
  {
    id: 'constraints',
    title: 'Constraints / Dependencies',
    fields: [
      { key: 'constraints', label: 'Constraints', type: 'textarea', full: true, rows: 2 },
      { key: 'dependencies', label: 'Dependencies', type: 'textarea', full: true, rows: 2 },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline / Cost / Resource Expectations',
    fields: [
      { key: 'targetStartDate', label: 'Target Start Date', type: 'date' },
      { key: 'targetEndDate', label: 'Target End Date', type: 'date' },
      { key: 'estimatedBudget', label: 'Estimated Budget', type: 'currency' },
      { key: 'resourceNotes', label: 'Resource Expectations', type: 'textarea', full: true, rows: 2 },
    ],
  },
  {
    id: 'tier',
    title: 'Tier Qualification',
    description: 'Use the Tier Calculator to estimate your tier, then note any governance triggers.',
    fields: [
      { key: 'preliminaryTier', label: 'Preliminary Tier', type: 'select', options: TIER_OPTIONS, helper: 'The PMO confirms the official tier during review.' },
      { key: 'autoTriggerNotes', label: 'Auto-Trigger Indicators', type: 'textarea', full: true, rows: 3, helper: 'Note any security, PII/regulated data, public-facing, or infrastructure triggers.' },
    ],
  },
  {
    id: 'charterNeeds',
    title: 'Expected Charter Needs',
    fields: [{ key: 'expectedCharterNeeds', label: 'Expected Charter Preparation Needs', type: 'textarea', full: true, rows: 3, helper: 'What you anticipate needing if this advances to a charter.' }],
  },
];

// ============================================================================
// CHARTER (Gate 2)
// ============================================================================

const CHARTER_SECTIONS: FormSectionConfig[] = [
  {
    id: 'project',
    title: 'Project Information',
    fields: [
      { key: 'projectTitle', label: 'Project Title', type: 'text', required: true, full: true },
      { key: 'description', label: 'Short Description', type: 'textarea', full: true, rows: 2 },
      { key: 'priority', label: 'Priority', type: 'select', options: PRIORITY_OPTIONS },
      { key: 'projectId', label: 'Linked Project ID', type: 'text', helper: 'Optional — the approved project this charter authorizes.' },
    ],
  },
  {
    id: 'sponsorPm',
    title: 'Sponsor & Project Manager',
    fields: [
      { key: 'submitterName', label: 'Project Manager Name', type: 'text', required: true },
      { key: 'submitterEmail', label: 'Project Manager Email', type: 'email', required: true },
      { key: 'submitterDepartment', label: 'Department', type: 'text' },
      { key: 'submitterRole', label: 'Role', type: 'text', placeholder: 'e.g. Project Manager' },
    ],
  },
  { id: 'purpose', title: 'Project Purpose', fields: [{ key: 'purpose', label: 'Purpose / Business Need', type: 'textarea', required: true, full: true, rows: 4 }] },
  { id: 'background', title: 'Background', fields: [{ key: 'background', label: 'Background', type: 'textarea', full: true, rows: 3 }] },
  { id: 'objectives', title: 'Objectives', fields: [{ key: 'objectives', label: 'Objectives / Intended Outcomes', type: 'textarea', required: true, full: true, rows: 3 }] },
  { id: 'success', title: 'Success Metrics', fields: [{ key: 'successCriteria', label: 'Success Criteria / Metrics', type: 'textarea', required: true, full: true, rows: 3 }] },
  {
    id: 'scope',
    title: 'Scope',
    fields: [
      { key: 'inScope', label: 'In Scope', type: 'textarea', full: true, rows: 3 },
      { key: 'outOfScope', label: 'Out of Scope', type: 'textarea', full: true, rows: 3 },
    ],
  },
  { id: 'deliverables', title: 'Major Deliverables', fields: [{ key: 'majorDeliverables', label: 'High-Level Requirements / Major Deliverables', type: 'textarea', full: true, rows: 3 }] },
  {
    id: 'governance',
    title: 'Organization & Governance',
    fields: [
      { key: 'governanceStructure', label: 'Governance Structure', type: 'textarea', full: true, rows: 3, helper: 'Sponsor, steering, and decision-making structure.' },
      { key: 'governanceNotes', label: 'Governance Notes', type: 'textarea', full: true, rows: 2 },
    ],
  },
  {
    id: 'assumptions',
    title: 'Assumptions / Constraints',
    fields: [
      { key: 'assumptions', label: 'Assumptions', type: 'textarea', full: true, rows: 2 },
      { key: 'constraints', label: 'Constraints', type: 'textarea', full: true, rows: 2 },
    ],
  },
  {
    id: 'risks',
    title: 'Initial Risks & Dependencies',
    fields: [
      { key: 'risks', label: 'Initial Risks', type: 'textarea', full: true, rows: 2 },
      { key: 'dependencies', label: 'Dependencies', type: 'textarea', full: true, rows: 2 },
    ],
  },
  { id: 'resources', title: 'Resource Requirements', fields: [{ key: 'resourceRequirements', label: 'Resource Requirements', type: 'textarea', full: true, rows: 3 }] },
  {
    id: 'rom',
    title: 'ROM / Funding',
    description: 'Rough order-of-magnitude cost range and funding.',
    fields: [
      { key: 'romLow', label: 'ROM Low', type: 'currency' },
      { key: 'romLikely', label: 'ROM Likely', type: 'currency' },
      { key: 'romHigh', label: 'ROM High', type: 'currency' },
      { key: 'fundingSource', label: 'Funding Source', type: 'text' },
      { key: 'fundingStatus', label: 'Funding Status', type: 'select', options: FUNDING_STATUS_OPTIONS },
    ],
  },
  { id: 'timeline', title: 'Timeline / Milestones', fields: [{ key: 'timelineSummary', label: 'Timeline & Milestone Summary', type: 'textarea', full: true, rows: 3 }] },
  {
    id: 'justification',
    title: 'Business Justification',
    fields: [
      { key: 'businessJustification', label: 'Business Justification', type: 'textarea', required: true, full: true, rows: 3 },
      { key: 'feasibilityNotes', label: 'Feasibility Notes', type: 'textarea', full: true, rows: 2 },
    ],
  },
  {
    id: 'tier',
    title: 'Tier Confirmation & Governance Path',
    fields: [
      { key: 'confirmedTier', label: 'Confirmed Tier', type: 'select', options: TIER_OPTIONS, helper: 'The PMO confirms the official tier at Gate 2.' },
      { key: 'tierChanged', label: 'The tier changed from the preliminary intake tier.', type: 'checkbox' },
    ],
  },
  {
    id: 'approvals',
    title: 'Approvals Preparation',
    // approvalsReady is a frontend readiness gate; no Wave 02 column.
    fields: [{ key: 'approvalsReady', label: 'I confirm the required sponsor and stakeholder approvals are prepared for Gate 2 review.', type: 'checkbox', required: true }],
  },
];

// ============================================================================
// CLOSURE (Gate 5)
// ============================================================================

const CLOSURE_SECTIONS: FormSectionConfig[] = [
  {
    id: 'project',
    title: 'Project Information',
    fields: [
      { key: 'projectTitle', label: 'Project Title', type: 'text', required: true, full: true },
      { key: 'projectId', label: 'Project ID', type: 'text', helper: 'The project being closed.' },
      { key: 'submitterName', label: 'Your Name', type: 'text', required: true },
      { key: 'submitterEmail', label: 'Your Email', type: 'email', required: true },
    ],
  },
  {
    id: 'acceptance',
    title: 'Final Acceptance',
    fields: [
      { key: 'projectOutcome', label: 'Project Outcome', type: 'select', required: true, options: CLOSURE_OUTCOME_OPTIONS },
      { key: 'outcomeDescription', label: 'Outcome Description', type: 'textarea', full: true, rows: 3 },
      { key: 'acceptanceSummary', label: 'Acceptance Summary', type: 'textarea', required: true, full: true, rows: 3, helper: 'How and by whom the deliverables were formally accepted.' },
    ],
  },
  {
    id: 'deliverables',
    title: 'Deliverables & Quality Evidence',
    fields: [
      { key: 'deliverablesSummary', label: 'Deliverables & Quality Evidence', type: 'textarea', full: true, rows: 3, helper: 'Summarize delivered scope and supporting quality evidence.' },
      { key: 'repositoryComplete', label: 'All deliverables and evidence are stored in the project repository.', type: 'checkbox' },
    ],
  },
  { id: 'transition', title: 'Transition to Operations', fields: [{ key: 'operationsTransitionSummary', label: 'Operations Transition Summary', type: 'textarea', full: true, rows: 3, helper: 'Support model, runbooks, and operational ownership.' }] },
  {
    id: 'benefits',
    title: 'Benefits & Outcomes',
    fields: [
      { key: 'benefitsRealizationPlanUrl', label: 'Benefits Realization Plan (link)', type: 'url', full: true, placeholder: 'https://…' },
    ],
  },
  {
    id: 'financial',
    title: 'Financial / Contract Closeout',
    fields: [
      { key: 'finalSpend', label: 'Final Spend', type: 'currency' },
      { key: 'budgetVariance', label: 'Budget Variance', type: 'currency' },
      { key: 'contractCloseoutNotes', label: 'Contract Closeout Notes', type: 'textarea', full: true, rows: 2 },
    ],
  },
  {
    id: 'change',
    title: 'Change / Configuration Closeout',
    // changeCloseoutNotes captured for context; folded into repository completeness for Wave 02.
    fields: [{ key: 'changeCloseoutNotes', label: 'Change / Configuration Closeout Notes', type: 'textarea', full: true, rows: 2, helper: 'Confirm change and configuration records are complete.' }],
  },
  { id: 'lessons', title: 'Lessons Learned', fields: [{ key: 'lessonsLearned', label: 'Lessons Learned', type: 'textarea', required: true, full: true, rows: 4 }] },
  {
    id: 'recommendation',
    title: 'Closure Recommendation',
    fields: [
      { key: 'closureRecommendation', label: 'Closure Recommendation', type: 'textarea', full: true, rows: 3 },
      { key: 'recommendCloseout', label: 'I recommend this project for formal closure.', type: 'checkbox', required: true },
    ],
  },
];

// ============================================================================
// Registry
// ============================================================================

export const SUBMISSION_FORMS: Record<SubmissionType, SubmissionFormConfig> = {
  Intake: {
    type: 'Intake',
    title: 'New Intake Submission',
    subtitle: 'Submit a Gate 1 Intake package to register a new project request.',
    submitLabel: 'Submit Intake',
    breadcrumbLabel: 'New Intake',
    gateLabel: 'Gate 1 · Intake',
    templateId: 'PMO-TPL-001',
    templateName: 'Project Intake',
    sections: INTAKE_SECTIONS,
    guidance: {
      heading: "You're starting a project intake",
      intro:
        'Intake registers your request and gives the PMO what it needs to make a Gate 1 decision and assign a preliminary tier.',
      steps: [
        { title: 'Complete the form', detail: 'Fill in each section. Required fields are marked with an asterisk.' },
        { title: 'Attach your package', detail: 'Attach the completed intake template as a PDF.' },
        { title: 'Submit', detail: 'You\'ll get a reference number and a confirmation.' },
        { title: 'PMO review', detail: 'The PMO reviews intake and confirms the governance tier.' },
      ],
      tips: [
        'Run the Tier Calculator first to estimate your tier.',
        'Confirm your sponsor supports the request before submitting.',
        'Be specific about the business need and expected benefits.',
      ],
      whatNext: [
        'You receive a confirmation with a reference number.',
        'The PMO reviews your intake and confirms the tier.',
        'If approved, you may be asked to prepare a charter.',
      ],
      attachmentNote: 'Attach the completed Intake template exported to PDF. One PDF, up to 25 MB.',
    },
    buildRequest: (v, fileName) => ({
      type: 'Intake',
      templateId: 'PMO-TPL-001',
      templateName: 'Project Intake',
      gateNumber: 1,
      projectTitle: str(v['projectTitle']),
      description: str(v['description']),
      priority: str(v['priority']),
      estimatedBudget: num(v['estimatedBudget']),
      serviceNowTicketNumber: str(v['serviceNowTicketNumber']),
      submitterName: str(v['submitterName']),
      submitterEmail: str(v['submitterEmail']),
      submitterDepartment: str(v['submitterDepartment']),
      submitterRole: str(v['submitterRole']),
      preliminaryTier: (str(v['preliminaryTier']) as ProjectTier | null) ?? null,
      autoTriggerIndicators: str(v['autoTriggerNotes']),
      fileName,
      detail: {
        businessNeed: str(v['businessNeed']),
        objectives: str(v['objectives']),
        inScope: str(v['inScope']),
        outOfScope: str(v['outOfScope']),
        expectedBenefits: str(v['expectedBenefits']),
        knownRisks: str(v['knownRisks']),
        constraints: str(v['constraints']),
        dependencies: str(v['dependencies']),
        targetStartDate: str(v['targetStartDate']),
        targetEndDate: str(v['targetEndDate']),
        resourceNotes: str(v['resourceNotes']),
        autoTriggerNotes: str(v['autoTriggerNotes']),
        expectedCharterNeeds: str(v['expectedCharterNeeds']),
        sponsorName: str(v['sponsorName']),
        sponsorEmail: str(v['sponsorEmail']),
        sponsorAcknowledged: bool(v['sponsorAcknowledged']),
      },
    }),
  },

  Charter: {
    type: 'Charter',
    title: 'New Charter Submission',
    subtitle: 'Submit a Gate 2 Charter package to authorize an approved project.',
    submitLabel: 'Submit Charter',
    breadcrumbLabel: 'New Charter',
    gateLabel: 'Gate 2 · Charter',
    templateId: 'PMO-TPL-002',
    templateName: 'Project Charter',
    sections: CHARTER_SECTIONS,
    guidance: {
      heading: "You're chartering a project",
      intro:
        'The charter formally authorizes an approved project — defining scope, governance, ROM funding, and success criteria for a Gate 2 decision.',
      steps: [
        { title: 'Complete the form', detail: 'Provide purpose, scope, governance, ROM, and justification.' },
        { title: 'Attach your package', detail: 'Attach the completed charter template as a PDF.' },
        { title: 'Submit', detail: 'You\'ll get a reference number and a confirmation.' },
        { title: 'Gate 2 review', detail: 'The PMO reviews the charter and confirms the tier.' },
      ],
      tips: [
        'Link the charter to its approved intake/project where possible.',
        'Provide a realistic ROM cost range (low / likely / high).',
        'Align the sponsor and PM on scope before submitting.',
      ],
      whatNext: [
        'You receive a confirmation with a reference number.',
        'The PMO reviews the charter at Gate 2.',
        'On approval, planning is authorized to begin.',
      ],
      attachmentNote: 'Attach the completed Charter template exported to PDF. One PDF, up to 25 MB.',
    },
    buildRequest: (v, fileName) => ({
      type: 'Charter',
      templateId: 'PMO-TPL-002',
      templateName: 'Project Charter',
      gateNumber: 2,
      projectId: str(v['projectId']),
      projectTitle: str(v['projectTitle']),
      description: str(v['description']),
      priority: str(v['priority']),
      estimatedBudget: num(v['romLikely']),
      submitterName: str(v['submitterName']),
      submitterEmail: str(v['submitterEmail']),
      submitterDepartment: str(v['submitterDepartment']),
      submitterRole: str(v['submitterRole']),
      preliminaryTier: (str(v['confirmedTier']) as ProjectTier | null) ?? null,
      fileName,
      detail: {
        projectId: str(v['projectId']),
        purpose: str(v['purpose']),
        background: str(v['background']),
        objectives: str(v['objectives']),
        successCriteria: str(v['successCriteria']),
        inScope: str(v['inScope']),
        outOfScope: str(v['outOfScope']),
        majorDeliverables: str(v['majorDeliverables']),
        governanceStructure: str(v['governanceStructure']),
        assumptions: str(v['assumptions']),
        constraints: str(v['constraints']),
        risks: str(v['risks']),
        dependencies: str(v['dependencies']),
        resourceRequirements: str(v['resourceRequirements']),
        romLow: num(v['romLow']),
        romLikely: num(v['romLikely']),
        romHigh: num(v['romHigh']),
        fundingSource: str(v['fundingSource']),
        fundingStatus: str(v['fundingStatus']),
        timelineSummary: str(v['timelineSummary']),
        businessJustification: str(v['businessJustification']),
        feasibilityNotes: str(v['feasibilityNotes']),
        tierChanged: bool(v['tierChanged']),
        governanceNotes: str(v['governanceNotes']),
      },
    }),
  },

  Closure: {
    type: 'Closure',
    title: 'New Closure Submission',
    subtitle: 'Submit a Gate 5 Closure package to formally close a project.',
    submitLabel: 'Submit Closure',
    breadcrumbLabel: 'New Closure',
    gateLabel: 'Gate 5 · Closure',
    templateId: 'PMO-TPL-004',
    templateName: 'Project Closure',
    sections: CLOSURE_SECTIONS,
    guidance: {
      heading: "You're closing a project",
      intro:
        'Closure documents acceptance, transition to operations, financial closeout, and lessons learned for a Gate 5 decision.',
      steps: [
        { title: 'Complete the form', detail: 'Provide acceptance, transition, financials, and lessons learned.' },
        { title: 'Attach your package', detail: 'Attach the completed closure template as a PDF.' },
        { title: 'Submit', detail: 'You\'ll get a reference number and a confirmation.' },
        { title: 'Gate 5 review', detail: 'The PMO reviews closure and records acceptance.' },
      ],
      tips: [
        'Confirm formal user acceptance before submitting.',
        'Reconcile final spend against the approved budget.',
        'Capture lessons learned with the whole team.',
      ],
      whatNext: [
        'You receive a confirmation with a reference number.',
        'The PMO reviews the closure package at Gate 5.',
        'On acceptance, the project transitions to operations and is closed.',
      ],
      attachmentNote: 'Attach the completed Closure template exported to PDF. One PDF, up to 25 MB.',
    },
    buildRequest: (v, fileName) => ({
      type: 'Closure',
      templateId: 'PMO-TPL-004',
      templateName: 'Project Closure',
      gateNumber: 5,
      projectId: str(v['projectId']),
      projectTitle: str(v['projectTitle']),
      submitterName: str(v['submitterName']),
      submitterEmail: str(v['submitterEmail']),
      fileName,
      detail: {
        projectId: str(v['projectId']),
        projectOutcome: (str(v['projectOutcome']) as ClosureOutcome | null) ?? 'Successful',
        outcomeDescription: str(v['outcomeDescription']),
        acceptanceSummary: str(v['acceptanceSummary']),
        operationsTransitionSummary: str(v['operationsTransitionSummary']),
        benefitsRealizationPlanUrl: str(v['benefitsRealizationPlanUrl']),
        finalSpend: num(v['finalSpend']),
        budgetVariance: num(v['budgetVariance']),
        contractCloseoutNotes: str(v['contractCloseoutNotes']),
        lessonsLearned: str(v['lessonsLearned']),
        repositoryComplete: bool(v['repositoryComplete']),
        closureRecommendation: str(v['closureRecommendation']),
      },
    }),
  },
};
