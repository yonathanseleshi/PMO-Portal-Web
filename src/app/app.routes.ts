import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PmoMockService } from './core/services/pmo-mock.service';

const authGuard: CanActivateFn = () => {
  const pmoService = inject(PmoMockService);
  const router = inject(Router);

  if (pmoService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

const loginGuard: CanActivateFn = () => {
  const pmoService = inject(PmoMockService);
  const router = inject(Router);

  if (!pmoService.isLoggedIn()) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [loginGuard],
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
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
        path: 'submissions',
        loadComponent: () => import('./features/submissions/submissions.component').then(m => m.SubmissionsComponent)
      },
      {
        path: 'governance',
        loadComponent: () => import('./features/governance/governance.component').then(m => m.GovernanceComponent)
      },
      {
        path: 'resources',
        loadComponent: () => import('./features/resources/resources.component').then(m => m.ResourcesComponent)
      },
      {
        path: 'admin',
        loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
