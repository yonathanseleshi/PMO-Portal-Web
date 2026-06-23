import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-card',
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  // Option for semantic left borders (RAG health)
  ragBorder = input<'Green' | 'Amber' | 'Red' | null>(null);
  
  // Option for semantic top borders
  topBorder = input<'brand' | 'accent' | null>(null);
  
  // Option for interactive card (hover elevation lift)
  interactive = input<boolean>(false);
}
