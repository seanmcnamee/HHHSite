import { ErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service';
import { IErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service.interface';
import { HealthcareRatesService } from '@/app/common/services/healthcare-rates/healthcare-rates.service';
import { IHealthcareRatesService } from '@/app/common/services/healthcare-rates/healthcare-rates.service.interface';
import { NavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service';
import { INavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DeductionResultsComponent } from '@/pages/healthcare-rates/deduction-results/deduction-results.component';

import { HealthcareRatesComponent } from './healthcare-rates.component';

describe('HealthcareRatesComponent', () => {
  let component: HealthcareRatesComponent;
  let fixture: ComponentFixture<HealthcareRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [ HealthcareRatesComponent, DeductionResultsComponent ],
      providers: [
        { provide: IErrorAlertsService, useClass: ErrorAlertsService },
        { provide: INavbarDataService, useClass: NavbarDataService },
        { provide: IHealthcareRatesService, useClass: HealthcareRatesService },
      ]
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
