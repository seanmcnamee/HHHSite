import { TestBed } from '@angular/core/testing';

import { ErrorAlertsService } from './error-alerts.service';

describe('ErrorAlertsService', () => {
  let service: ErrorAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorAlertsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});