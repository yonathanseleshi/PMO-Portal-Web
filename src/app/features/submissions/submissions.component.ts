import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PmoMockService } from '../../core/services/pmo-mock.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-submissions',
  imports: [CommonModule, CardComponent, BadgeComponent, PageHeaderComponent],
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css'
})
export class SubmissionsComponent {
  pmoService = inject(PmoMockService);

  submissions = computed(() => this.pmoService.submissions());

  get userRole() {
    return this.pmoService.currentUser().role;
  }

  constructor() {}

  approve(id: string) {
    this.pmoService.processSubmission(id, 'Approved');
  }

  reject(id: string) {
    this.pmoService.processSubmission(id, 'Returned');
  }
}
