import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth';
import { UserRole } from '../models/user-session.model';

/**
 * Restricts a route to a set of roles declared on the route's `data.roles`.
 *
 * Usage:
 *   { path: 'submissions', canActivate: [authGuard, roleGuard],
 *     data: { roles: [UserRole.PMOLead, UserRole.PMOAnalyst] }, ... }
 *
 * - Unauthenticated  → redirect to /login (defense in depth; pair with authGuard).
 * - Authenticated but unauthorized → redirect to /access-denied.
 * - No `roles` declared → allow (route only requires authentication).
 *
 * UI gating is convenience only; the backend remains the authoritative
 * enforcement point per the Design Guide.
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const allowed = (route.data?.['roles'] as UserRole[] | undefined) ?? [];
  if (allowed.length === 0 || auth.hasRole(...allowed)) {
    return true;
  }
  return router.createUrlTree(['/access-denied']);
};
