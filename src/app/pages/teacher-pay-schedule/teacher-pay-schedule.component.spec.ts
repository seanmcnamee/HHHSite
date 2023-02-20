import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherPayScheduleComponent } from './teacher-pay-schedule.component';

describe('TeacherPayScheduleComponent', () => {
  let component: TeacherPayScheduleComponent;
  let fixture: ComponentFixture<TeacherPayScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeacherPayScheduleComponent ]
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
