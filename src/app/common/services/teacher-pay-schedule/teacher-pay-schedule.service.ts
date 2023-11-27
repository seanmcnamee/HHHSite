import { Injectable } from '@angular/core';
import { ITeacherPayScheduleService, PayBreakdownResults } from '@/common/services/teacher-pay-schedule/teacher-pay-schedule.service.interface';
import { PayPeriod } from '@/common/models/PayPeriod';

@Injectable({
  providedIn: 'root'
})
export class TeacherPayScheduleService implements ITeacherPayScheduleService {
  private updatedDate: string = "09/01/2023";
  private forSchoolYears: string = "2023-2024";

  private FIRST_PAY_DATE: Date = new Date('2023-09-08T00:00:00');
  private PAY_DAYS = 22.0;
  private DAYS_BETWEEN_PAY = 14;
  private LAST_PAY_DATE: Date = this.getDateWithOffset(this.FIRST_PAY_DATE, this.DAYS_BETWEEN_PAY * (this.PAY_DAYS - 1))
  private DAYS_IN_FIRST_PAY: number = 2.0;
  private BUSINESS_DAYS_BETWEEN_PAY = 10.0;

  constructor() { }
  getYears(): string {
    return this.forSchoolYears;
  }
  getUpdatedDate(): string {
    return this.updatedDate;
  }
  getPayPeriodTypes(): PayPeriod[] {
    return [
      { text: "22", value: 22.0 },
      { text: "26", value: 26.0 },
    ]
  }
  getFirstPayDate(): string {
    return this.getDateStr(this.FIRST_PAY_DATE);
  }
  getLastPayDate(): string {
    return this.getDateStr(this.LAST_PAY_DATE);
  }
  getPayBreakdownResults(inputSalary: number, payPeriod: number): PayBreakdownResults {
    const result: PayBreakdownResults = {
      totalPay: this.truncateResultAt2Places(inputSalary),
      prelimBiWeekly: {
        result: this.truncateResultAt2Places(this.salaryPayPrelimBiweekly(inputSalary, payPeriod)),
        expression: this.salaryPayPrelimBiweeklyDisplay(inputSalary, payPeriod)
      },
      prelimDaily: {
        result: this.truncateResultAt2Places(this.salaryPayPrelimDaily(inputSalary, payPeriod)),
        expression: this.salaryPayPrelimDailyDisplay(inputSalary, payPeriod)
      },
      firstPay: {
        result: this.truncateResultAt2Places(this.salaryPayTypeFirst(inputSalary, payPeriod)),
        expression: this.salaryPayTypeFirstDisplay(inputSalary, payPeriod)
      },
      recurringPayBiWeekly: {
        result: this.truncateResultAt2Places(this.salaryPayTypeRecurring(inputSalary, payPeriod)),
        expression: this.salaryPayTypeRecurringDisplay(inputSalary, payPeriod)
      },
      finalPay: {
        result: this.truncateResultAt2Places(this.salaryPayTypeFinal(inputSalary, payPeriod)),
        expression: this.salaryPayTypeFinalDisplay(inputSalary, payPeriod)
      }
    };
    return result;
  }

  private getDateStr(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100;

    return `${month}/${day}/${year}`;
  }
  private getDateWithOffset(date: Date, days: number) {
    const tempDate = new Date(date);
    tempDate.setDate(date.getDate() + days);
    return tempDate;
  }
  

  //For calculation result
  private truncateResultAt2Places(result: number) {
    console.log("Truncating...", result);
    return result.toFixed(2).toString();
  }

  private salaryPayPrelimBiweekly(salary: number, payPeriodOption: number) {
    return (salary / payPeriodOption);
  }

  private salaryPayPrelimDaily(salary: number, payPeriodOption: number) {
    return this.salaryPayPrelimBiweekly(salary, payPeriodOption) / this.BUSINESS_DAYS_BETWEEN_PAY;
  }

  private salaryPayTypeFirst(salary: number, payPeriodOption: number) {
    return this.salaryPayPrelimDaily(salary, payPeriodOption) * this.DAYS_IN_FIRST_PAY;
  }

  private salaryPayTypeRecurring(salary: number, payPeriodOption: number) {
    return (salary - this.salaryPayTypeFirst(salary, payPeriodOption)) / (payPeriodOption - 1);
  }

  private salaryPayTypeFinal(salary: number, payPeriodOption: number) {
    return (salary - this.salaryPayTypeFirst(salary, payPeriodOption) - (this.PAY_DAYS - 2) * this.salaryPayTypeRecurring(salary, payPeriodOption));
  }

  //For breakdown
  private salaryPayPrelimBiweeklyDisplay(salary: number, payPeriodOption: number) {
    return `${salary} / ${payPeriodOption}`;
  }

  private salaryPayPrelimDailyDisplay(salary: number, payPeriodOption: number) {
    return `${this.truncateResultAt2Places(
      this.salaryPayPrelimBiweekly(salary, payPeriodOption)
    )} / ${this.BUSINESS_DAYS_BETWEEN_PAY}`;
  }

  private salaryPayTypeFirstDisplay(salary: number, payPeriodOption: number) {
    return `${this.truncateResultAt2Places(
      this.salaryPayPrelimDaily(salary, payPeriodOption)
    )} * ${this.DAYS_IN_FIRST_PAY}`;
  }

  private salaryPayTypeRecurringDisplay(salary: number, payPeriodOption: number) {
    return `(${salary} - ${this.truncateResultAt2Places(
      this.salaryPayTypeFirst(salary, payPeriodOption)
    )}) / ${payPeriodOption - 1}`;
  }

  private salaryPayTypeFinalDisplay(salary: number, payPeriodOption: number) {
    return `${salary} - ${this.truncateResultAt2Places(
      this.salaryPayTypeFirst(salary, payPeriodOption)
    )} - ${this.PAY_DAYS - 2}(${this.truncateResultAt2Places(
      this.salaryPayTypeRecurring(salary, payPeriodOption)
    )})`;
  }
}
