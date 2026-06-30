import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccessDeniedStateComponent } from '../../shared/components/states/access-denied-state.component';

/**
 * Route-level Access Denied page (PAGE-STATE-001). Thin wrapper around the
 * shared {@link AccessDeniedStateComponent} so the full-page and inline
 * variants stay visually identical.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-access-denied',
  imports: [AccessDeniedStateComponent],
  template: `<pmo-access-denied-state></pmo-access-denied-state>`,
})
export class AccessDeniedComponent {}
