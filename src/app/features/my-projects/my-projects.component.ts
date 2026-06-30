import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth';
import { ProjectsService } from '../../services/projects/projects';
import { UserRole } from '../../models/user-session.model';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { RagIndicatorComponent } from '../../shared/components/rag-indicator/rag-indicator.component';
import { LoadingStateComponent } from '../../shared/components/states/loading-state.component';
import { EmptyStateComponent } from '../../shared/components/states/empty-state.component';
import { ErrorStateComponent } from '../../shared/components/states/error-state.component';
import { PHASE_LABELS, ProjectListItem, TIER_LABELS } from '../../models';

/**
 * My Projects (PAGE-HOME-002). Lists the projects the signed-in user may
 * access — the full portfolio for PMO/Governance Board, or the manager's own
 * projects for a Project Manager. Demonstrates the standard
 * loading/empty/error state pattern over a Wave-02-aligned service.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-my-projects',
  imports: [
    CommonModule, RouterModule, PageHeaderComponent, CardComponent, BadgeComponent,
    RagIndicatorComponent, LoadingStateComponent, EmptyStateComponent, ErrorStateComponent,
  ],
  templateUrl: './my-projects.component.html',
})
export class MyProjectsComponent {
  private auth = inject(AuthService);
  private projects = inject(ProjectsService);

  readonly tierLabels = TIER_LABELS;
  readonly phaseLabels = PHASE_LABELS;

  readonly portfolioWide = this.auth.isPMOUser() || this.auth.hasRole(UserRole.GovernanceBoard);

  /** undefined = loading, null = error, [] = empty. */
  private readonly data = toSignal<ProjectListItem[] | null | undefined>(
    this.projects
      .getProjectsForUser(this.auth.session()?.email ?? '', this.portfolioWide)
      .pipe(catchError(() => of(null))),
    { initialValue: undefined },
  );

  readonly loading = computed(() => this.data() === undefined);
  readonly errored = computed(() => this.data() === null);
  readonly rows = computed(() => this.data() ?? []);

  /** RAG → indicator tone (design-system uses Amber; backend uses Yellow). */
  ragTone(rag: string): 'Green' | 'Amber' | 'Red' {
    return rag === 'Yellow' ? 'Amber' : (rag as 'Green' | 'Red');
  }

  tierType(tier: string): string {
    return tier === 'Tier1' ? 'tier1' : tier === 'Tier2' ? 'tier2' : 'tier3';
  }
}
