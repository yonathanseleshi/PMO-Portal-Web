import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-copilot',
  imports: [CommonModule, FormsModule],
  templateUrl: './copilot.component.html',
  styleUrl: './copilot.component.css'
})
export class CopilotComponent {
  isOpen = signal<boolean>(true);
  userInput = signal<string>('');
  
  messages = signal<Message[]>([
    {
      sender: 'ai',
      text: 'Good morning! I am your PMO Copilot. How can I assist you with Ventura County ITS project guidelines, template preparation, or lifecycle gates today?',
      time: '10:09 AM'
    }
  ]);

  suggestedPrompts = [
    'What templates are required for a Tier 3 project?',
    'Explain the G2 Charter Authorization Gate.',
    'How do I calculate a project tier?',
    'What is the standard RAG health criteria?'
  ];

  constructor() {}

  toggleOpen() {
    this.isOpen.update(o => !o);
  }

  sendMessage(text: string) {
    if (!text.trim()) return;

    // Add user message
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    this.messages.update(msgs => [
      ...msgs,
      { sender: 'user', text, time: timeStr }
    ]);

    this.userInput.set('');

    // Simulate AI response based on keywords
    setTimeout(() => {
      let response = '';
      const lower = text.toLowerCase();
      
      if (lower.includes('tier')) {
        response = 'Project tiers are classified from Tier 1 (low complexity) to Tier 3 (high complexity) based on factors like budget, department impact, security risk, and duration. For instance, projects with budgets exceeding $1,000,000 are automatically classified as Tier 3 and require full 5-Gate lifecycle approval and detailed evidence documentation.';
      } else if (lower.includes('g2') || lower.includes('charter')) {
        response = 'The G2 Gate (Charter Authorization) verifies if a project has sufficient business justification, sponsor commitment, and defined scope to proceed into the planning phase. To pass G2, the Project Manager must submit a completed Project Charter template for review.';
      } else if (lower.includes('gate') || lower.includes('lifecycle')) {
        response = 'The Ventura County ITS PMO utilizes a 5-Gate governance lifecycle: G1 (Intake), G2 (Charter Authorization), G3 (Planning Approval), G4 (Release Readiness), and G5 (Acceptance & Closure). Each gate serves as a formal checkpoint to ensure alignment, accountability, and operational readiness.';
      } else if (lower.includes('template')) {
        response = 'PMO standard templates include the Project Intake Form, Project Charter, Project Plan, Status Report, and RAID Log. You can download these files from the Template Library and submit them for approval through the Submissions Queue.';
      } else {
        response = 'Based on Ventura County ITS PMO standards, please ensure all project decisions and milestones are recorded in the Project Registry and Status Reports are submitted on a bi-weekly basis. Let me know if you would like me to explain specific gate requirements or tier criteria.';
      }

      this.messages.update(msgs => [
        ...msgs,
        { sender: 'ai', text: response, time: timeStr }
      ]);
    }, 1000);
  }
}
