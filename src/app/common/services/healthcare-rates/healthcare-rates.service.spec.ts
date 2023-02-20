import { TestBed } from '@angular/core/testing';

import { HealthcareRatesService } from './healthcare-rates.service';

describe('HealthcareRatesService', () => {
  let service: HealthcareRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HealthcareRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
