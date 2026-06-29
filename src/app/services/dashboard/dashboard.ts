import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface PmoAnnouncement {
  id: string;
  title: string;
  summary: string;
  postedDate: string;
  audience: 'All' | 'PMO' | 'Project Managers';
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly mockAnnouncements: PmoAnnouncement[] = [
    {
      id: 'ann-001',
      title: 'Gate 3 evidence checklist refreshed',
      summary: 'Updated release-readiness evidence guidance is now available in the Template Library.',
      postedDate: '2026-05-21',
      audience: 'All'
    },
    {
      id: 'ann-002',
      title: 'June PM status cadence reminder',
      summary: 'Weekly status reports are due by end-of-day each Friday for Tier 1 projects.',
      postedDate: '2026-05-20',
      audience: 'Project Managers'
    },
    {
      id: 'ann-003',
      title: 'Governance board packet submission window',
      summary: 'Board agenda submissions close two business days before the next governance review.',
      postedDate: '2026-05-18',
      audience: 'PMO'
    }
  ];

  getAnnouncements(): Observable<PmoAnnouncement[]> {
    // TODO(api): Replace with HttpClient GET /api/dashboard/announcements
    return of(this.mockAnnouncements);
  }
}
