import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PmoMockService } from '../../core/services/pmo-mock.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  pmoService = inject(PmoMockService);
  private router = inject(Router);

  constructor() {}

  getCurrentUser() {
    return this.pmoService.currentUser();
  }

  logout() {
    this.pmoService.logout();
    this.router.navigate(['/login']);
  }

  toggleRole() {
    const current = this.pmoService.currentUser();
    if (current.role === 'pmo') {
      this.pmoService.currentUser.set({
        username: 'Mark (Project Manager)',
        role: 'pm'
      });
    } else {
      this.pmoService.currentUser.set({
        username: 'Joanna (PMO Lead)',
        role: 'pmo'
      });
    }
  }
}
