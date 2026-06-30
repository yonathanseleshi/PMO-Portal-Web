import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ROLE_LABELS } from '../../models/user-session.model';
import { NAV_GROUPS, NavGroup } from './nav.config';

/**
 * Primary application navigation.
 *
 * Role-aware: nav items are filtered against the canonical {@link AuthService}
 * session role. This is UI convenience only — guards + the .NET API are the
 * real access-control boundary (Design Guide §8).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private auth = inject(AuthService);

  /** Nav groups with items filtered to the current user's role. */
  readonly groups = computed<NavGroup[]>(() => {
    const role = this.auth.session()?.role ?? null;
    return NAV_GROUPS
      .map((group) => ({
        heading: group.heading,
        items: group.items.filter((item) => {
          if (!item.roles || item.roles.length === 0) {
            return true;
          }
          return role !== null && item.roles.includes(role);
        }),
      }))
      .filter((group) => group.items.length > 0);
  });

  readonly displayName = computed(() => this.auth.session()?.displayName ?? '');
  readonly roleLabel = computed(() => {
    const role = this.auth.session()?.role;
    return role ? ROLE_LABELS[role] : '';
  });
  readonly initials = computed(() => {
    const name = this.displayName();
    if (!name) {
      return '--';
    }
    const parts = name.split(' ').filter(Boolean);
    const letters = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);
    return letters.toUpperCase();
  });
}
