import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-badge',
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.css'
})
export class BadgeComponent {
  type = input<string>('default');
  text = input<string>('');

  getClasses(): string {
    const base = 'inline-flex items-center justify-center px-2.5 py-0.5 text-[11px] font-bold rounded-full border ';
    switch (this.type()) {
      case 'success':
        return base + 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'warning':
        return base + 'bg-amber-50 text-amber-700 border-amber-200';
      case 'danger':
        return base + 'bg-rose-50 text-rose-700 border-rose-200';
      case 'info':
        return base + 'bg-sky-50 text-sky-700 border-sky-200';
      case 'tier1':
        return base + 'bg-amber-100/50 text-amber-800 border-amber-200/60';
      case 'tier2':
        return base + 'bg-sky-100/50 text-sky-800 border-sky-200/60';
      case 'tier3':
        return base + 'bg-purple-100/50 text-purple-800 border-purple-200/60';
      default:
        return base + 'bg-stone-100 text-stone-600 border-stone-200';
    }
  }
}
