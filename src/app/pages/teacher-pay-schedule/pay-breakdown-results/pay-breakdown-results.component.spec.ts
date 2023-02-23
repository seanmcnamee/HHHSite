import { TeacherPayScheduleService } from '@/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service';
import { ITeacherPayScheduleService } from '@/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service.interface';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayBreakdownResultsComponent } from './pay-breakdown-results.component';

describe('PayBreakdownResultsComponent', () => {
  let component: PayBreakdownResultsComponent;
  let fixture: ComponentFixture<PayBreakdownResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayBreakdownResultsComponent ],
      providers: [
        { provide: ITeacherPayScheduleService, useClass: TeacherPayScheduleService },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayBreakdownResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
