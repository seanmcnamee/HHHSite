import { PayPeriod } from '@/app/common/models/PayPeriod';
import { ErrorAlertItem, IErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service.interface';
import { INavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { ITeacherPayScheduleService, PayBreakdownResults } from '@/app/common/services/teacher-pay-schedule/teacher-pay-schedule.service.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher-pay-schedule',
  templateUrl: './teacher-pay-schedule.component.html',
  styleUrls: ['./teacher-pay-schedule.component.scss']
})
export class TeacherPayScheduleComponent implements OnInit, OnDestroy {
  private teacherPayScheduleErrorScope = "TeacherPayScheduleComponent";
  salary: number | undefined;
  payPeriodOptions: PayPeriod[];
  payPeriod: PayPeriod | undefined;
  payBreakdownResults: PayBreakdownResults | undefined;

  constructor(private _teacherPayScheduleService: ITeacherPayScheduleService, private _errorAlertsService: IErrorAlertsService, private _navbarDataService: INavbarDataService) {
    this.payPeriodOptions = this._teacherPayScheduleService.getPayPeriodTypes();
  }

  ngOnInit(): void {

    
    this._navbarDataService.SetNavbarData({
      pageTitle: `${this._teacherPayScheduleService.getYears()} Teacher Pay Schedule`,
      pageSubTitle: `Page last updated on: ${this._teacherPayScheduleService.getUpdatedDate()}`,
      showNavLinks: false
    });
  }
  ngOnDestroy(): void {
    this._navbarDataService.ClearNavbarData();
  }

  onChangeInputSalary(newSalary: number) {
    this.payBreakdownResults = undefined;
    this.salary = +newSalary.toString().replaceAll(/[\,$]/g, "");;
  }
  onSelectPayPeriod(newPayPeriod: PayPeriod) {
    this.payBreakdownResults = undefined;
    this.payPeriod = newPayPeriod;
  }
  private getFormErrors(): ErrorAlertItem[] {
    const errors: ErrorAlertItem[] = [];
    const autoDismissDelay = 5000;

    if (this.salary === undefined || Number.isNaN(this.salary) || this.salary <= 0) {
      errors.push(new ErrorAlertItem(
        "Please enter a valid salary! Make sure your salary only has numbers (no dollar signs, commas, etc)",
        this.teacherPayScheduleErrorScope, autoDismissDelay));
    }
    if (this.payPeriod === undefined || !this.payPeriodOptions.includes(this.payPeriod)) {
      errors.push(new ErrorAlertItem(
        "Please select the applicable pay period",
        this.teacherPayScheduleErrorScope, autoDismissDelay));
    }

    return errors;
  }
  onSubmit() {
    this._errorAlertsService.ClearErrorsWithScope(this.teacherPayScheduleErrorScope);
    const errors = this.getFormErrors().reverse();

    if (errors.length > 0) {
      errors.forEach(error => this._errorAlertsService.AddErrorAndBroadcast(error));
      return;
    }

    this.payBreakdownResults = this._teacherPayScheduleService.getPayBreakdownResults(this.salary!, this.payPeriod!.value);
  }
}
