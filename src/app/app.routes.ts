import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user-session.model';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    // Application shell — renders (sidebar + header + copilot) only once the
    // user is authenticated. All children inherit authentication protection.
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/project-registry/project-registry.component').then(m => m.ProjectRegistryComponent)
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
      },
      {
        path: 'templates',
        loadComponent: () => import('./features/templates/template-library.component').then(m => m.TemplateLibraryComponent)
      },
      {
        // Submissions queue is an operational PMO function.
        path: 'submissions',
        canActivate: [roleGuard],
        data: { roles: [UserRole.PMOLead, UserRole.PMOAnalyst] },
        loadComponent: () => import('./features/submissions/submissions.component').then(m => m.SubmissionsComponent)
      },
      {
        // Governance Board views — PMO staff and Governance Board members.
        path: 'governance',
        canActivate: [roleGuard],
        data: { roles: [UserRole.PMOLead, UserRole.PMOAnalyst, UserRole.GovernanceBoard] },
        loadComponent: () => import('./features/governance/governance.component').then(m => m.GovernanceComponent)
      },
      {
        path: 'resources',
        loadComponent: () => import('./features/resources/resources.component').then(m => m.ResourcesComponent)
      },
      {
        // System administration is restricted to the PMO Lead.
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: [UserRole.PMOLead] },
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
      },
      {
        path: 'access-denied',
        loadComponent: () => import('./features/access-denied/access-denied.component').then(m => m.AccessDeniedComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
