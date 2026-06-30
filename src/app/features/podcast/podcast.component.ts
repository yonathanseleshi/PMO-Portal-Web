import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageScaffoldComponent } from '../../shared/components/page-scaffold/page-scaffold.component';

/**
 * Podcast (PAGE-PODCAST-001). Scaffolded in Wave 03; episode listing/detail and
 * media playback land in the Content & Communications wave.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-podcast',
  imports: [PageHeaderComponent, PageScaffoldComponent],
  template: `
    <pmo-page-header title="PMO Podcast" [breadcrumbs]="['Home', 'Podcast']" />
    <pmo-page-scaffold
      heading="PMO-produced learning audio"
      description="Curated audio and video sessions on governance practice, project tiers, and gate readiness."
      [plannedFeatures]="[
        'Episode listing with topic tags',
        'Episode detail with embedded media link',
        'Host / speaker and duration metadata',
        'Related templates and resources',
        'Search and category filters'
      ]"
    />
  `,
})
export class PodcastComponent {}
