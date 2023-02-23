import { PayPeriod } from "@/common/models/PayPeriod";

export abstract class ITeacherPayScheduleService {
  constructor() { }
  abstract getYears(): string;
  abstract getUpdatedDate(): string;
  abstract getPayPeriodTypes(): PayPeriod[];
  abstract getFirstPayDate(): string;
  abstract getLastPayDate(): string;
  abstract getPayBreakdownResults(salary: number, payPeriods: number): PayBreakdownResults;
}


export interface PayBreakdownResults {
  totalPay: string,
  prelimBiWeekly: PayBreakdownItem,
  prelimDaily: PayBreakdownItem,
  firstPay: PayBreakdownItem,
  recurringPayBiWeekly: PayBreakdownItem,
  finalPay: PayBreakdownItem
}

export interface PayBreakdownItem {
  result: number | string;
  expression: string;
}