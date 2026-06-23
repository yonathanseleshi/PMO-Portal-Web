import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
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
