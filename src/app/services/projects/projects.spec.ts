import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ProjectsService } from './projects';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(ProjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns contract-shaped registry rows', (done) => {
    service.getProjects().subscribe((rows) => {
      expect(rows.length).toBeGreaterThan(0);
      expect(rows[0].tier).toMatch(/Tier[123]/);
      done();
    });
  });
});
