import { NavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service';
import { INavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorAlertsComponent } from '@/common/components/error-alerts/error-alerts.component';

import { NavbarComponent } from './navbar.component';
import { IErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service.interface';
import { ErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavbarComponent, ErrorAlertsComponent],
      providers: [
        { provide: INavbarDataService, useClass: NavbarDataService },
        { provide: IErrorAlertsService, useClass: ErrorAlertsService },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
