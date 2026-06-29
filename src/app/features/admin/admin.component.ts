import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PmoMockService } from '../../services/pmo-mock.service';
import { Project } from '../../models/pmo.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-admin',
  imports: [CommonModule, FormsModule, CardComponent, BadgeComponent, PageHeaderComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  pmoService = inject(PmoMockService);

  // Form signals for adding project
  projectName = signal<string>('');
  projectDesc = signal<string>('');
  projectPM = signal<string>('Mark');
  projectTier = signal<1 | 2 | 3>(2);
  projectBudget = signal<number>(500000);
  projectStartDate = signal<string>('2026-07-01');
  projectEndDate = signal<string>('2027-06-30');

  successMessage = signal<string>('');

  constructor() {}

  get projectsCount() {
    return this.pmoService.projects().length;
  }

  get userRole() {
    return this.pmoService.currentUser().role;
  }

  submitNewProject() {
    if (!this.projectName() || !this.projectDesc()) {
      return;
    }

    const newProj: Project = {
      id: `PRJ-${new Date().getFullYear()}-000${this.projectsCount + 1}`,
      name: this.projectName(),
      description: this.projectDesc(),
      manager: this.projectPM(),
      tier: this.projectTier(),
      phase: 'G1',
      status: 'In Review',
      ragStatus: 'Green',
      lastStatusReportDate: new Date().toISOString().substring(0, 10),
      budget: this.projectBudget(),
      spent: 0,
      startDate: this.projectStartDate(),
      endDate: this.projectEndDate(),
      subprojects: [],
      milestones: [
        { id: 'M1', name: 'Project Intake Approval', date: this.projectStartDate(), status: 'Completed' },
        { id: 'M2', name: 'Project Charter Sign-off', date: this.projectEndDate(), status: 'Not Started' }
      ]
    };

    this.pmoService.addProject(newProj);
    
    // Show success message
    this.successMessage.set(`Project ${newProj.id} has been registered successfully!`);
    
    // Reset fields
    this.projectName.set('');
    this.projectDesc.set('');
    
    setTimeout(() => {
      this.successMessage.set('');
    }, 4000);
  }
}
