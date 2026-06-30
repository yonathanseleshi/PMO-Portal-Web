import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { authGuard, loginGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { UserRole } from './models/user-session.model';

/** Roles with portfolio-wide read access (PMO + Governance Board). */
const PMO_AND_BOARD = [UserRole.PMOLead, UserRole.PMOAnalyst, UserRole.GovernanceBoard];
/** Operational PMO roles. */
const PMO_ONLY = [UserRole.PMOLead, UserRole.PMOAnalyst];

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
  },
  {
    // Authenticated application shell — renders sidebar + header + copilot once.
    // Every child inherits authentication protection via authGuard.
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      // --- General ---------------------------------------------------------
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'my-projects',
        loadComponent: () => import('./features/my-projects/my-projects.component').then(m => m.MyProjectsComponent),
      },
      {
        // Full Project Registry — PMO + Governance Board only.
        path: 'projects',
        canActivate: [roleGuard],
        data: { roles: PMO_AND_BOARD },
        loadComponent: () => import('./features/project-registry/project-registry.component').then(m => m.ProjectRegistryComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/project-detail/project-detail.component').then(m => m.ProjectDetailComponent),
      },
      {
        path: 'projects/:id/subprojects/:subId',
        loadComponent: () => import('./features/subproject-detail/subproject-detail.component').then(m => m.SubprojectDetailComponent),
      },
      {
        path: 'templates',
        loadComponent: () => import('./features/templates/template-library.component').then(m => m.TemplateLibraryComponent),
      },
      {
        path: 'templates/:id/instructions',
        loadComponent: () => import('./features/templates/template-instructions.component').then(m => m.TemplateInstructionsComponent),
      },
      {
        path: 'templates/:id',
        loadComponent: () => import('./features/templates/template-detail.component').then(m => m.TemplateDetailComponent),
      },
      {
        // Tier Calculator — available to all authenticated users (PAGE-GOV-002).
        path: 'tier-calculator',
        loadComponent: () => import('./features/tier-calculator/tier-calculator-page.component').then(m => m.TierCalculatorPageComponent),
      },

      // --- Native submission surfaces (all authenticated users) ------------
      {
        path: 'submissions/new/intake',
        data: { submissionType: 'Intake' },
        loadComponent: () => import('./features/submissions/forms/submission-form.component').then(m => m.SubmissionFormComponent),
      },
      {
        path: 'submissions/new/charter',
        data: { submissionType: 'Charter' },
        loadComponent: () => import('./features/submissions/forms/submission-form.component').then(m => m.SubmissionFormComponent),
      },
      {
        path: 'submissions/new/closure',
        data: { submissionType: 'Closure' },
        loadComponent: () => import('./features/submissions/forms/submission-form.component').then(m => m.SubmissionFormComponent),
      },
      {
        path: 'submissions/receipt',
        loadComponent: () => import('./features/submissions/receipt/submission-receipt.component').then(m => m.SubmissionReceiptComponent),
      },
      {
        // PMO Submissions Queue — operational PMO function.
        path: 'submissions',
        canActivate: [roleGuard],
        data: { roles: PMO_ONLY },
        loadComponent: () => import('./features/submissions/submissions.component').then(m => m.SubmissionsComponent),
      },

      // --- Governance & Resources -----------------------------------------
      {
        path: 'governance-board',
        canActivate: [roleGuard],
        data: { roles: PMO_AND_BOARD },
        loadComponent: () => import('./features/governance/governance.component').then(m => m.GovernanceComponent),
      },
      // Back-compat alias for the original /governance path.
      { path: 'governance', redirectTo: 'governance-board', pathMatch: 'full' },
      {
        path: 'learning',
        loadComponent: () => import('./features/resources/resources.component').then(m => m.ResourcesComponent),
      },
      // Back-compat alias for the original /resources path.
      { path: 'resources', redirectTo: 'learning', pathMatch: 'full' },
      {
        path: 'podcast',
        loadComponent: () => import('./features/podcast/podcast.component').then(m => m.PodcastComponent),
      },
      {
        path: 'newsletters',
        loadComponent: () => import('./features/newsletters/newsletters.component').then(m => m.NewslettersComponent),
      },
      {
        path: 'inbox',
        loadComponent: () => import('./features/inbox/inbox.component').then(m => m.InboxComponent),
      },

      // --- Administration --------------------------------------------------
      {
        // System administration — PMO Lead only.
        path: 'admin',
        canActivate: [roleGuard],
        data: { roles: [UserRole.PMOLead] },
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
      },

      // --- System state pages ---------------------------------------------
      {
        path: 'access-denied',
        loadComponent: () => import('./features/access-denied/access-denied.component').then(m => m.AccessDeniedComponent),
      },
      {
        // Catch-all inside the shell so 404s keep the authenticated frame.
        path: '**',
        loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
      },
    ],
  },
];
