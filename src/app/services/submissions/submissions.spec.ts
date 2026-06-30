import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { SubmissionsService } from './submissions';

describe('SubmissionsService', () => {
  let service: SubmissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(SubmissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
