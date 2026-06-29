import { TestBed } from '@angular/core/testing';

import { Submissions } from './submissions';

describe('Submissions', () => {
  let service: Submissions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Submissions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
