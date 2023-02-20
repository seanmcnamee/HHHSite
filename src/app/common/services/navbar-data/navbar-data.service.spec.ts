import { TestBed } from '@angular/core/testing';

import { NavbarDataService } from './navbar-data.service';

describe('NavbarDataService', () => {
  let service: NavbarDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
