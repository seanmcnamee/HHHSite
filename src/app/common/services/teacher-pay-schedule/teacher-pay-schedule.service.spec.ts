import { TestBed } from '@angular/core/testing';

import { TeacherPayScheduleService } from './teacher-pay-schedule.service';

describe('TeacherPayScheduleService', () => {
  let service: TeacherPayScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherPayScheduleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
