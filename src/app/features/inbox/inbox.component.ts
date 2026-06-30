import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { PageScaffoldComponent } from '../../shared/components/page-scaffold/page-scaffold.component';

/**
 * Notifications / Inbox (PAGE-INBOX-001). Scaffolded in Wave 03; notification
 * generation and read-state workflows land in the Notifications wave.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-inbox',
  imports: [PageHeaderComponent, PageScaffoldComponent],
  template: `
    <pmo-page-header title="Notifications" [breadcrumbs]="['Home', 'Notifications']" />
    <pmo-page-scaffold
      heading="Your notification inbox"
      description="A persistent record of governance events relevant to you — submissions, gate decisions, status report reminders, and RAID escalations."
      [plannedFeatures]="[
        'Unread count and read / unread filtering',
        'Submission status-change notifications',
        'Gate decision recorded alerts',
        'Status report due / overdue reminders',
        'RAID escalation notifications',
        'Related project and action deep-links'
      ]"
    />
  `,
})
export class InboxComponent {}
