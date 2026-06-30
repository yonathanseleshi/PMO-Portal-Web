import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageScaffoldComponent } from '../../shared/components/page-scaffold/page-scaffold.component';

/**
 * Subproject Detail (PAGE-SUBPROJECT-001). Scaffolded in Wave 03 with a working
 * breadcrumb back to the parent project; child workstream data and health
 * updates land in a later wave.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-subproject-detail',
  imports: [PageHeaderComponent, PageScaffoldComponent, RouterLink],
  template: `
    <pmo-page-header title="Subproject" [breadcrumbs]="['Project Registry', 'Project', 'Subproject']" />
    <pmo-page-scaffold
      heading="Subproject workspace"
      description="A dedicated workspace for a child workstream under a parent project."
      [plannedFeatures]="[
        'Subproject summary and RAG health',
        'Subproject milestones',
        'Subproject RAID items',
        'Subproject documents',
        'Parent project context and recent updates'
      ]"
    >
      <a [routerLink]="['/projects', projectId()]" class="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1e5fa5] hover:text-[#0f2d52] transition-colors">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        <span>Back to parent project</span>
      </a>
    </pmo-page-scaffold>
  `,
})
export class SubprojectDetailComponent {
  private route = inject(ActivatedRoute);
  readonly projectId = toSignal(this.route.paramMap.pipe(map((p) => p.get('id') ?? '')), {
    initialValue: '',
  });
}
