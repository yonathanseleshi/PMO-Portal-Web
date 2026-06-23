import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-rag-indicator',
  imports: [CommonModule],
  templateUrl: './rag-indicator.component.html',
  styleUrl: './rag-indicator.component.css'
})
export class RagIndicatorComponent {
  status = input<'Green' | 'Amber' | 'Red'>('Green');
}
