import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageScaffoldComponent } from '../../shared/components/page-scaffold/page-scaffold.component';

/**
 * PMO Newsletter (PAGE-NEWS-001). Scaffolded in Wave 03; issue listing/detail
 * and the admin publishing workflow land in later waves.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-newsletters',
  imports: [PageHeaderComponent, PageScaffoldComponent],
  template: `
    <pmo-page-header title="PMO Newsletter" [breadcrumbs]="['Home', 'PMO Newsletter']" />
    <pmo-page-scaffold
      heading="PMO communications and updates"
      description="Current and archived PMO newsletter issues covering governance changes, wins, and reminders."
      [plannedFeatures]="[
        'Latest issue highlight',
        'Issue listing with volume / date',
        'Full issue detail view',
        'Topic search and filters',
        'Homepage latest-issue card'
      ]"
    />
  `,
})
export class NewslettersComponent {}
