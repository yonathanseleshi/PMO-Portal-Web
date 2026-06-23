import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PmoMockService } from '../../core/services/pmo-mock.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { RagIndicatorComponent } from '../../shared/components/rag-indicator/rag-indicator.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-dashboard',
  imports: [CommonModule, RouterModule, CardComponent, BadgeComponent, RagIndicatorComponent, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  pmoService = inject(PmoMockService);

  constructor() {}

  // Computed metrics
  totalProjects = computed(() => this.pmoService.projects().length);
  atRiskProjects = computed(() => this.pmoService.projects().filter(p => p.ragStatus === 'Amber').length);
  criticalProjects = computed(() => this.pmoService.projects().filter(p => p.ragStatus === 'Red').length);
  pendingSubmissions = computed(() => this.pmoService.submissions().filter(s => s.status === 'Pending').length);

  get projects() {
    return this.pmoService.projects();
  }

  get announcements() {
    return this.pmoService.announcements();
  }

  get newsletters() {
    return this.pmoService.newsletters();
  }

  get podcasts() {
    return this.pmoService.podcasts();
  }

  get currentUser() {
    return this.pmoService.currentUser();
  }
}
