import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-gate-stepper',
  imports: [CommonModule],
  templateUrl: './gate-stepper.component.html',
  styleUrl: './gate-stepper.component.css'
})
export class GateStepperComponent {
  currentGate = input<'G1' | 'G2' | 'G3' | 'G4' | 'G5'>('G1');

  gates: { code: 'G1' | 'G2' | 'G3' | 'G4' | 'G5'; name: string; desc: string }[] = [
    { code: 'G1', name: 'G1 Intake', desc: 'Intake Decision' },
    { code: 'G2', name: 'G2 Charter', desc: 'Charter Auth' },
    { code: 'G3', name: 'G3 Planning', desc: 'Planning Approval' },
    { code: 'G4', name: 'G4 Release', desc: 'Release Readiness' },
    { code: 'G5', name: 'G5 Closure', desc: 'Acceptance & Close' }
  ];

  isCompleted(gateCode: string): boolean {
    const order = ['G1', 'G2', 'G3', 'G4', 'G5'];
    const currentIdx = order.indexOf(this.currentGate());
    const gateIdx = order.indexOf(gateCode);
    return gateIdx < currentIdx;
  }

  isActive(gateCode: string): boolean {
    return this.currentGate() === gateCode;
  }
}
