import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { CopilotComponent } from '../copilot/copilot.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-shell',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, CopilotComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {
  constructor() {}
}
