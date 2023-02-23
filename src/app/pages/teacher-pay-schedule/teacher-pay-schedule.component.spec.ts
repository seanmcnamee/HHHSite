import { ErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service';
import { IErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service.interface';
import { NavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service';
import { INavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { TeacherPayScheduleService } from '@/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service';
import { ITeacherPayScheduleService } from '@/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PayBreakdownResultsComponent } from '@/pages/teacher-pay-schedule/pay-breakdown-results/pay-breakdown-results.component';

import { TeacherPayScheduleComponent } from './teacher-pay-schedule.component';

describe('TeacherPayScheduleComponent', () => {
  let component: TeacherPayScheduleComponent;
  let fixture: ComponentFixture<TeacherPayScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
      ],
      declarations: [ TeacherPayScheduleComponent, PayBreakdownResultsComponent ],
      providers: [
        { provide: IErrorAlertsService, useClass: ErrorAlertsService },
        { provide: INavbarDataService, useClass: NavbarDataService },
        { provide: ITeacherPayScheduleService, useClass: TeacherPayScheduleService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherPayScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
