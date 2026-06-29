import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PmoMockService } from '../../services/pmo-mock.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { RagIndicatorComponent } from '../../shared/components/rag-indicator/rag-indicator.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'pmo-project-registry',
  imports: [CommonModule, RouterModule, FormsModule, CardComponent, BadgeComponent, RagIndicatorComponent, PageHeaderComponent],
  templateUrl: './project-registry.component.html',
  styleUrl: './project-registry.component.css'
})
export class ProjectRegistryComponent {
  pmoService = inject(PmoMockService);

  // Filter signals
  searchQuery = signal<string>('');
  selectedTier = signal<string>('all');
  selectedPhase = signal<string>('all');
  selectedRag = signal<string>('all');

  // Sort signals
  sortColumn = signal<string>('id');
  sortDirection = signal<'asc' | 'desc'>('asc');

  constructor() {}

  // Filtered and sorted projects
  filteredProjects = computed(() => {
    let list = this.pmoService.projects();

    // Query filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.id.toLowerCase().includes(query) || 
        p.manager.toLowerCase().includes(query)
      );
    }

    // Tier filter
    const tier = this.selectedTier();
    if (tier !== 'all') {
      list = list.filter(p => p.tier === parseInt(tier));
    }

    // Phase filter
    const phase = this.selectedPhase();
    if (phase !== 'all') {
      list = list.filter(p => p.phase === phase);
    }

    // RAG filter
    const rag = this.selectedRag();
    if (rag !== 'all') {
      list = list.filter(p => p.ragStatus === rag);
    }

    // Sort
    const col = this.sortColumn();
    const dir = this.sortDirection();
    return [...list].sort((a: any, b: any) => {
      let valA = a[col];
      let valB = b[col];

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return dir === 'asc' ? -1 : 1;
      if (valA > valB) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  });

  setSort(col: string) {
    if (this.sortColumn() === col) {
      this.sortDirection.update(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortColumn.set(col);
      this.sortDirection.set('asc');
    }
  }
}
