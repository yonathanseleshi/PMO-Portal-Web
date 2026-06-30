import {RenderMode, ServerRoute} from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'projects/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: 'projects/:id/subprojects/:subId',
    renderMode: RenderMode.Server,
  },
  {
    // Parameterized template routes render on demand (unknown ids at build time).
    path: 'templates/:id/instructions',
    renderMode: RenderMode.Server,
  },
  {
    path: 'templates/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
