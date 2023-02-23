import { PayPeriod } from '@/app/common/models/PayPeriod';
import { ITeacherPayScheduleService, PayBreakdownResults } from '@/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service.interface';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pay-breakdown-results',
  templateUrl: './pay-breakdown-results.component.html',
  styleUrls: ['./pay-breakdown-results.component.scss']
})
export class PayBreakdownResultsComponent {
  @Input() payPeriod: PayPeriod | undefined;
  @Input() payBreakdownResults: PayBreakdownResults | undefined;
  firstPayDate: string;
  lastPayDate: string;

  constructor(private _teacherPayScheduleService: ITeacherPayScheduleService) {
    this.firstPayDate = this._teacherPayScheduleService.getFirstPayDate();
    this.lastPayDate = this._teacherPayScheduleService.getLastPayDate();
  }
}
