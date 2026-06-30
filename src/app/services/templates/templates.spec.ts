import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { TemplatesService } from './templates';

describe('TemplatesService', () => {
  let service: TemplatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(TemplatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
