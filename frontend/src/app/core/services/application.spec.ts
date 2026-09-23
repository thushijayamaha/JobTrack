import { TestBed } from '@angular/core/testing';

import { ApplicationService } from './application';

describe('Application', () => {
  let service: ApplicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
