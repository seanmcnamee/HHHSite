import { PayPeriod } from "@/common/models/PayPeriod";

export abstract class IHealthcareRatesService {
  constructor() { }
  abstract getYearForRates(): string;
  abstract getRatesUpdatedDate(): string;
  abstract getContractKeys(): ContractName[];
  abstract getContractSalaryType(contractName: ContractName | undefined): SalaryType | undefined;
  abstract getCompletedYearsOptions(): CompletedYears[];
  abstract getHireDateOptions(): HireDate[];
  abstract getPayPeriodOptions(): PayPeriod[];
  abstract getDeductionResults(contractName: ContractName, inputSalary: number | undefined, completedYears: CompletedYears | undefined, hireDate: HireDate | undefined, payPeriods: number | undefined): DeductionResults
}

export enum SalaryType {
  NoService = 0,
  SalaryAndYearsAndPayPeriod = 1,
  SalaryAndHireDate = 2,
  SalaryOnly = 3,
  FlatRate = 4
}

export enum ContractName {
  Administrators = "Administrators",
  Teachers = "Teachers",
  Clerical = "Clerical/Office Personnel",
  Custodial = "Custodial",
  Paraprofessional = "Paraprofessional",
  FoodService = "Food Service",
  Transportation = "Transportation",
  Monitors = "Monitors",
  Security = "Security",
  ManagerialConfidential = "Managerial Confidential"
}

export enum CompletedYears {
  ZeroToOne = "0-1",
  TwoToThree = "2-3",
  FourOrMore = "4+"
}

export enum HireDate {
  OnOrAfter_2022_07_01 = "Yes",
  Before_2022_07_01 = "No",
}

export interface DeductionResults {
  hipLow: DeductionResultType,
  nyshipEmpire: DeductionResultType,
  nyshipExcelsior: DeductionResultType,
  hipHigh: DeductionResultType,
}

export interface DeductionResultType {
  individual?: string,
  family?: string
}
