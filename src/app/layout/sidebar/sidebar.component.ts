import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PmoMockService } from '../../services/pmo-mock.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  router = inject(Router);
  pmoService = inject(PmoMockService);

  constructor() {}

  get userRole() {
    return this.pmoService.currentUser().role;
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }
}
