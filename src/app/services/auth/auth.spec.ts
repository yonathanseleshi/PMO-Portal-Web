import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from './auth';
import { UserRole } from '../../models/user-session.model';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('establishes a session on demo login and exposes role helpers', () => {
    service.demoLogin(UserRole.PMOLead).subscribe();
    expect(service.isAuthenticated()).toBe(true);
    expect(service.isPMOUser()).toBe(true);
    expect(service.hasRole(UserRole.PMOLead)).toBe(true);
    expect(service.canAccessProject('PRJ-2026-0001')).toBe(true);
  });

  it('restricts project access for project managers to their assigned set', () => {
    service.demoLogin(UserRole.ProjectManager).subscribe();
    expect(service.isPMOUser()).toBe(false);
    expect(service.canAccessProject('PRJ-2026-0002')).toBe(true);
    expect(service.canAccessProject('PRJ-9999-9999')).toBe(false);
  });

  it('clears the session on logout', () => {
    service.demoLogin(UserRole.PMOLead).subscribe();
    service.logout().subscribe();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getSession()).toBeNull();
  });
});
