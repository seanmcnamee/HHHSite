import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorAlertsService } from 'src/app/common/services/error-alerts/error-alerts.service';
import { IErrorAlertsService } from 'src/app/common/services/error-alerts/error-alerts.service.interface';

import { ErrorAlertsComponent } from './error-alerts.component';

describe('ErrorAlertsComponent', () => {
  let component: ErrorAlertsComponent;
  let fixture: ComponentFixture<ErrorAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorAlertsComponent ],
      providers: [{ provide: IErrorAlertsService, useClass: ErrorAlertsService }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
