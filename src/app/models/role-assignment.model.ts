import { PortalRole, RoleSource } from './enums.model';

/**
 * RoleAssignment — frontend mirror of the Wave 02 `RoleAssignment` entity.
 *
 * A project-scoped grant (e.g. PM ownership) carries a `projectId`;
 * portfolio-wide roles (PMO Lead, Governance Board) leave it null. Consumed by
 * the Admin → User Management views in later waves; modeled now so service and
 * UI typing stays contract-stable.
 */
export interface RoleAssignment {
  id: string;
  userEmail: string;
  role: PortalRole;
  sourceType: RoleSource;
  sourceReference?: string | null;
  projectId?: string | null;
  isActive: boolean;
  userSessionId?: string | null;
  createdAt: string;
  createdByEmail?: string | null;
  updatedAt?: string | null;
  updatedByEmail?: string | null;
}

/**
 * Backend `UserSession` record (the audit/identity row), distinct from the
 * client {@link UserSession} auth contract in `user-session.model.ts`. Used by
 * Admin user/session views.
 */
export interface UserSessionRecord {
  id: string;
  entraObjectId?: string | null;
  displayName: string;
  email: string;
  role: PortalRole;
  roleSource: RoleSource;
  authenticatedAt: string;
  expiresAt?: string | null;
  lastActivityAt?: string | null;
}
