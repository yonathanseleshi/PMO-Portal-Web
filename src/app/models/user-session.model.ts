/**
 * Canonical authenticated user session for the PMO Portal.
 *
 * This is the single source of truth for "who the user is" across the
 * application. It is produced by AuthService after a successful VCAuth login
 * (or a prototype demo login) and consumed by guards, the app shell, and
 * role-aware feature screens.
 */

/**
 * PMO Portal application roles (RBAC).
 *
 * Enum members intentionally use their own names as string values so they can
 * be compared against string literals in templates while still being
 * referenced as `UserRole.PMOLead` in TypeScript.
 */
export enum UserRole {
  PMOLead = 'PMOLead',
  PMOAnalyst = 'PMOAnalyst',
  GovernanceBoard = 'GovernanceBoard',
  ProjectManager = 'ProjectManager',
}

/**
 * Default role applied when a role cannot be derived from VCAuth/AD group
 * membership. Least-privilege fallback per Wave 01 risk mitigation.
 */
export const DEFAULT_ROLE: UserRole = UserRole.ProjectManager;

/**
 * Authenticated user session (mirrors the future `/api/me` contract).
 */
export interface UserSession {
  userId: string;
  displayName: string;
  email: string;
  role: UserRole;
  /** Project IDs the user may access. `['*']` denotes access to all projects. */
  accessibleProjectIds: string[];
  /** Access token issued by VCAuth (empty for prototype/demo sessions). */
  token: string;
}

/** Human-readable role labels for UI display. */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.PMOLead]: 'PMO Lead',
  [UserRole.PMOAnalyst]: 'PMO Analyst',
  [UserRole.GovernanceBoard]: 'Governance Board',
  [UserRole.ProjectManager]: 'Project Manager',
};

/** Short role abbreviations (avatars, compact badges). */
export const ROLE_ABBR: Record<UserRole, string> = {
  [UserRole.PMOLead]: 'PMO',
  [UserRole.PMOAnalyst]: 'PMO',
  [UserRole.GovernanceBoard]: 'GB',
  [UserRole.ProjectManager]: 'PM',
};

/** Roles considered part of the operational PMO (PMO Lead / PMO Analyst). */
export const PMO_ROLES: readonly UserRole[] = [
  UserRole.PMOLead,
  UserRole.PMOAnalyst,
];

/**
 * Maps Active Directory / VCAuth group memberships to a PMO Portal role.
 *
 * The first matching group (most-privileged first) wins. Group names are
 * matched case-insensitively as substrings so this tolerates fully
 * distinguished names returned by LDAP (e.g. "CN=ITS-PMO-Lead,OU=...").
 * Falls back to {@link DEFAULT_ROLE} when nothing matches.
 */
export function roleFromAdGroups(groups: string[] | null | undefined): UserRole {
  const haystack = (groups ?? []).join('|').toLowerCase();

  const rules: Array<{ match: string[]; role: UserRole }> = [
    { match: ['pmo-lead', 'pmo_lead', 'pmolead'], role: UserRole.PMOLead },
    { match: ['pmo-analyst', 'pmo_analyst', 'pmoanalyst'], role: UserRole.PMOAnalyst },
    { match: ['governance', 'gov-board', 'gov_board', 'itleadership', 'it-leadership'], role: UserRole.GovernanceBoard },
    { match: ['project-manager', 'project_manager', 'projectmanager', 'pm-'], role: UserRole.ProjectManager },
  ];

  for (const rule of rules) {
    if (rule.match.some(token => haystack.includes(token))) {
      return rule.role;
    }
  }
  return DEFAULT_ROLE;
}
