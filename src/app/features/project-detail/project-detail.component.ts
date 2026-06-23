import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PmoMockService } from '../../core/services/pmo-mock.service';
import { Project, StatusReport } from '../../core/models/pmo.model';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { RagIndicatorComponent } from '../../shared/components/rag-indicator/rag-indicator.component';
import { GateStepperComponent } from '../../shared/components/gate-stepper/gate-stepper.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-project-detail',
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, BadgeComponent, RagIndicatorComponent, GateStepperComponent, PageHeaderComponent],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.css'
})
export class ProjectDetailComponent {
  route = inject(ActivatedRoute);
  pmoService = inject(PmoMockService);

  // Loaded project signal
  project = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return this.pmoService.projects().find(p => p.id === id);
  });

  // Filter status reports for this project
  reports = computed(() => {
    const p = this.project();
    if (!p) return [];
    return this.pmoService.statusReports().filter(r => r.projectId === p.id);
  });

  // Form signals for submitting new report
  showReportForm = signal<boolean>(false);
  newReportStatus = signal<'On Track' | 'At Risk' | 'Critical'>('On Track');
  newReportSummary = signal<string>('');
  newReportAchievement = signal<string>('');
  newReportNextStep = signal<string>('');
  newReportIssue = signal<string>('');

  constructor() {}

  get userRole() {
    return this.pmoService.currentUser().role;
  }

  get currentUser() {
    return this.pmoService.currentUser();
  }

  // Calculate percentage of budget spent
  getBudgetProgress(p: Project): number {
    if (!p.budget) return 0;
    return Math.min(Math.round((p.spent / p.budget) * 100), 100);
  }

  submitReport() {
    const p = this.project();
    if (!p) return;

    const newReport: StatusReport = {
      id: `REP-${Math.floor(Math.random() * 10000)}`,
      projectId: p.id,
      reportDate: new Date().toISOString().substring(0, 10),
      overallStatus: this.newReportStatus(),
      summary: this.newReportSummary(),
      keyAchievements: this.newReportAchievement() ? [this.newReportAchievement()] : ['Status update generated'],
      nextSteps: this.newReportNextStep() ? [this.newReportNextStep()] : ['Monitor ongoing tasks'],
      issues: this.newReportIssue() ? [this.newReportIssue()] : ['None reported']
    };

    this.pmoService.addStatusReport(newReport);
    
    // Reset form
    this.newReportSummary.set('');
    this.newReportAchievement.set('');
    this.newReportNextStep.set('');
    this.newReportIssue.set('');
    this.showReportForm.set(false);
  }

  passGate() {
    const p = this.project();
    if (!p) return;

    const order: ('G1' | 'G2' | 'G3' | 'G4' | 'G5')[] = ['G1', 'G2', 'G3', 'G4', 'G5'];
    const currentIdx = order.indexOf(p.phase);
    if (currentIdx < order.length - 1) {
      const nextPhase = order[currentIdx + 1];
      this.pmoService.updateProjectPhase(p.id, nextPhase, currentIdx + 2);
    }
  }

  toggleReportForm() {
    this.showReportForm.update(v => !v);
  }
}
