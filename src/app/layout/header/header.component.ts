import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth';
import { ROLE_LABELS, UserRole } from '../../models/user-session.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Display order used by the demo role switcher.
  private readonly roleCycle: UserRole[] = [
    UserRole.PMOLead,
    UserRole.PMOAnalyst,
    UserRole.GovernanceBoard,
    UserRole.ProjectManager,
  ];

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

  logout(): void {
    this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }

  /** Demo aid: cycles the active session through each role for validation. */
  cycleRole(): void {
    const current = this.auth.session()?.role;
    const idx = current ? this.roleCycle.indexOf(current) : -1;
    const next = this.roleCycle[(idx + 1) % this.roleCycle.length];
    this.auth.demoLogin(next).subscribe();
  }
}
