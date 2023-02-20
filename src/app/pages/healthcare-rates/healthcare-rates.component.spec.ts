import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthcareRatesComponent } from './healthcare-rates.component';

describe('HealthcareRatesComponent', () => {
  let component: HealthcareRatesComponent;
  let fixture: ComponentFixture<HealthcareRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealthcareRatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HealthcareRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
