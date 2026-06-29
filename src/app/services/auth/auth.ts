import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthDTO } from '../../dto/auth.dto';
import { LoginResponseDTO } from '../../dto/login-response.dto';
import {
  DEFAULT_ROLE,
  PMO_ROLES,
  ROLE_LABELS,
  UserRole,
  UserSession,
  roleFromAdGroups,
} from '../../models/user-session.model';

/**
 * AuthService — the canonical authentication and session authority for the
 * PMO Portal.
 *
 * Responsibilities (Wave 01):
 *  - Integrate with the VCAuth API for credential login.
 *  - Derive and store the {@link UserSession} (identity + role + access scope).
 *  - Persist the session so it survives a browser refresh.
 *  - Provide role-based access helpers (hasRole / canAccessProject / isPMOUser).
 *  - Handle logout (clear session + best-effort VCAuth sign-out).
 *
 * A prototype `demoLogin()` path is provided so the portal is fully
 * demonstrable without a live backend. Real RBAC must always be enforced
 * server-side; the helpers here drive UI behavior only.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // --- VCAuth integration constants -----------------------------------------
  private readonly authApiUrl = 'https://vcauthapitest.venturacounty.gov/api/auth/login';
  private readonly bearerToken = 'vctokenITSD2472EastmanAve';

  private static readonly STORAGE_KEY = 'pmo_user_session';

  // --- Reactive session state -----------------------------------------------
  /** Signal source of truth for the current session (null when signed out). */
  private readonly sessionSignal = signal<UserSession | null>(this.restoreSession());

  /** Read-only access to the current session as a signal. */
  readonly session = computed(() => this.sessionSignal());

  /** True when a user is authenticated. */
  readonly isLoggedIn = computed(() => this.sessionSignal() !== null);

  private readonly authState$ = new BehaviorSubject<boolean>(this.sessionSignal() !== null);
  /** Emits authentication state changes (used by login redirect logic). */
  readonly isAuthenticated$ = this.authState$.asObservable();

  // --------------------------------------------------------------------------
  // Login
  // --------------------------------------------------------------------------

  /**
   * Authenticate against the VCAuth API using network credentials.
   * On success the LDAP profile + AD group membership are mapped to a
   * {@link UserSession} and persisted.
   */
  loginWithVcAuth(authDTO: AuthDTO): Observable<UserSession> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.bearerToken}`,
    });

    const body = {
      userId: authDTO.userId || authDTO.username,
      password: authDTO.password,
      isMfaLogin: false,
    };

    return this.http.post<LoginResponseDTO>(this.authApiUrl, body, { headers }).pipe(
      map(response => {
        if (!response?.success || !response.data?.ldapUserProfile) {
          throw new Error(response?.message || 'Authentication failed. Please check your credentials.');
        }

        const profile = response.data.ldapUserProfile;
        const [last, first] = (profile.displayName || '').split(',').map(p => p.trim());

        const session: UserSession = {
          userId: profile.userId,
          displayName: first && last ? `${first} ${last}` : profile.displayName || profile.userId,
          email: profile.email || '',
          role: roleFromAdGroups(profile.memberOf),
          accessibleProjectIds: ['*'],
          token: (response.data as { token?: string }).token || '',
        };

        this.setSession(session);
        return session;
      }),
      catchError(error => {
        const message = error?.error?.message || error?.message || 'Login failed. Please try again.';
        return throwError(() => new Error(message));
      }),
    );
  }

  /**
   * Prototype/demo login. Establishes a fully-formed session for the given
   * role without contacting the backend, so the portal is demonstrable
   * offline. Not used in production.
   */
  demoLogin(role: UserRole): Observable<UserSession> {
    const demo: Record<UserRole, { id: string; name: string; email: string }> = {
      [UserRole.PMOLead]: { id: 'VC2061', name: 'Joanna Pereira', email: 'joanna.pereira@venturacounty.gov' },
      [UserRole.PMOAnalyst]: { id: 'VC2088', name: 'Daniel Reyes', email: 'daniel.reyes@venturacounty.gov' },
      [UserRole.GovernanceBoard]: { id: 'VC1004', name: 'Mark Stevens', email: 'mark.stevens@venturacounty.gov' },
      [UserRole.ProjectManager]: { id: 'VC4192', name: 'Alex Thompson', email: 'alex.thompson@venturacounty.gov' },
    };

    const profile = demo[role];
    const session: UserSession = {
      userId: profile.id,
      displayName: profile.name,
      email: profile.email,
      role,
      // PMO and Governance Board see all projects; PMs see an assigned subset.
      accessibleProjectIds: PMO_ROLES.includes(role) || role === UserRole.GovernanceBoard
        ? ['*']
        : ['PRJ-2026-0002', 'PRJ-2026-0005'],
      token: '',
    };

    this.setSession(session);
    return of(session);
  }

  // --------------------------------------------------------------------------
  // Session access
  // --------------------------------------------------------------------------

  /** Returns the current session as an Observable (mirrors `/api/me`). */
  getCurrentUser(): Observable<UserSession | null> {
    return of(this.sessionSignal());
  }

  /** Synchronous accessor for the current session. */
  getSession(): UserSession | null {
    return this.sessionSignal();
  }

  /** True if a user is currently authenticated. */
  isAuthenticated(): boolean {
    return this.sessionSignal() !== null;
  }

  // --------------------------------------------------------------------------
  // Role-based access helpers (UI-only; backend remains authoritative)
  // --------------------------------------------------------------------------

  /** True if the current user holds any of the supplied roles. */
  hasRole(...roles: UserRole[]): boolean {
    const session = this.sessionSignal();
    return !!session && roles.includes(session.role);
  }

  /** True for operational PMO users (PMO Lead / PMO Analyst). */
  isPMOUser(): boolean {
    return this.hasRole(...PMO_ROLES);
  }

  /** True if the current user may access the given project. */
  canAccessProject(projectId: string): boolean {
    const session = this.sessionSignal();
    if (!session) {
      return false;
    }
    // PMO and Governance Board have portfolio-wide visibility.
    if (this.isPMOUser() || session.role === UserRole.GovernanceBoard) {
      return true;
    }
    return session.accessibleProjectIds.includes('*') || session.accessibleProjectIds.includes(projectId);
  }

  /** Human-readable label for the current user's role. */
  roleLabel(): string {
    const session = this.sessionSignal();
    return session ? ROLE_LABELS[session.role] : '';
  }

  // --------------------------------------------------------------------------
  // Logout
  // --------------------------------------------------------------------------

  /** Clears the session and performs a best-effort VCAuth sign-out. */
  logout(): Observable<void> {
    this.clearSession();
    // Backend logout is best-effort; UI does not block on it.
    return of(void 0);
  }

  // --------------------------------------------------------------------------
  // Internal session persistence
  // --------------------------------------------------------------------------

  private setSession(session: UserSession): void {
    this.sessionSignal.set(session);
    this.authState$.next(true);
    if (this.hasStorage()) {
      window.localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(session));
    }
  }

  private clearSession(): void {
    this.sessionSignal.set(null);
    this.authState$.next(false);
    if (this.hasStorage()) {
      window.localStorage.removeItem(AuthService.STORAGE_KEY);
    }
  }

  private restoreSession(): UserSession | null {
    if (!this.hasStorage()) {
      return null;
    }
    const raw = window.localStorage.getItem(AuthService.STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      const parsed = JSON.parse(raw) as UserSession;
      // Guard against tampered/legacy roles — fall back to least privilege.
      if (!parsed.role || !(parsed.role in ROLE_LABELS)) {
        parsed.role = DEFAULT_ROLE;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  private hasStorage(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
