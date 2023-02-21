import { ErrorAlertItem, IErrorAlertsService } from '@/app/common/services/error-alerts/error-alerts.service.interface';
import { CompletedYears, ContractName, DeductionResults, HireDate, IHealthcareRatesService, SalaryType } from '@/app/common/services/healthcare-rates/healthcare-rates.service.interface';
import { INavbarDataService } from '@/app/common/services/navbar-data/navbar-data.service.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: "app-healthcare-rates",
  templateUrl: "./healthcare-rates.component.html",
  styleUrls: ["./healthcare-rates.component.scss"]
})
export class HealthcareRatesComponent implements OnInit, OnDestroy {
  SalaryType = SalaryType;
  private readonly healthCareRatesErrorScope: string = "HealthcareRatesComponent";

  contractNameOptions: ContractName[];
  contractName: ContractName | undefined;
  private contractSalaryType: SalaryType | undefined;

  isShowingSalaryInput: boolean;
  salary: number | undefined;

  isShowingCompletedYears: boolean;
  completedYearsOptions: CompletedYears[];
  completedYears: CompletedYears | undefined;

  isShowingHireDate: boolean;
  hireDateOptions: HireDate[];
  hireDate: HireDate | undefined;

  deductionResults: DeductionResults | undefined;

  constructor(private readonly _healthcareService: IHealthcareRatesService, private readonly _errorAlertsService: IErrorAlertsService, private readonly _navbarDataService: INavbarDataService) {
    this.contractNameOptions = this._healthcareService.getContractKeys();
    this.completedYearsOptions = this._healthcareService.getCompletedYearsOptions();
    this.hireDateOptions = this._healthcareService.getHireDateOptions();

    this.isShowingSalaryInput = false;
    this.isShowingCompletedYears = false;
    this.isShowingHireDate = false;
  }

  ngOnInit(): void {
    this._navbarDataService.SetNavbarData({
      pageTitle: `${this._healthcareService.getYearForRates()} Healthcare Deduction Calculator`,
      pageSubTitle: `Rates last updated on: ${this._healthcareService.getRatesUpdatedDate()}`,
      showNavLinks: false
    });
  }
  ngOnDestroy(): void {
    this._navbarDataService.ClearNavbarData();
  }

  onSelectContractName(newSelectedContractName: ContractName) {
    this.deductionResults = undefined;
    this.contractName = newSelectedContractName;
    this.contractSalaryType = this._healthcareService.getContractSalaryType(this.contractName);
    if (this.contractSalaryType === undefined) {
      this.isShowingSalaryInput = false;
      this.isShowingCompletedYears = false;
      this.isShowingHireDate = false;
    } else {
      this.isShowingSalaryInput = [SalaryType.SalaryAndYears, SalaryType.SalaryOnly, SalaryType.SalaryAndHireDate].includes(this.contractSalaryType);
      this.isShowingCompletedYears = [SalaryType.SalaryAndYears].includes(this.contractSalaryType);
      this.isShowingHireDate = [SalaryType.SalaryAndHireDate].includes(this.contractSalaryType);
    }
    this.clearUnusedInputs();
  }
  private clearUnusedInputs() {
    if (!this.isShowingSalaryInput) {
      this.salary = undefined;
    }
    if (!this.isShowingCompletedYears) {
      this.completedYears = undefined;
    }
    if (!this.isShowingHireDate) {
      this.hireDate = undefined;
    }
  }
  onChangeInputSalary(newInputSalary: number) {
    this.deductionResults = undefined;
    this.salary = +newInputSalary.toString().replaceAll(/[\,$]/g, "");
  }
  onSelectCompletedYears(newCompletedYears: CompletedYears) {
    this.deductionResults = undefined;
    this.completedYears = newCompletedYears;
  }
  onSelectHireDate(newHireDate: HireDate) {
    this.deductionResults = undefined;
    this.hireDate = newHireDate;
  }
  private getFormErrors(): ErrorAlertItem[] {
    const errors: ErrorAlertItem[] = [];
    const autoDismissDelay = 5000;

    if (this.contractName === undefined || !this.contractNameOptions.includes(this.contractName)) {
      errors.push(new ErrorAlertItem(
        "Please select a contract name!",
        this.healthCareRatesErrorScope, autoDismissDelay));
    }
    if (this.isShowingSalaryInput && (this.salary === undefined || Number.isNaN(this.salary) || this.salary <= 0)) {
      errors.push(new ErrorAlertItem(
        "Please enter a valid salary! Make sure your salary only has numbers (no dollar signs, commas, etc)",
        this.healthCareRatesErrorScope, autoDismissDelay));
    }
    if (this.isShowingCompletedYears && (this.completedYears === undefined || !this.completedYearsOptions.includes(this.completedYears))) {
      errors.push(new ErrorAlertItem(
        "Please select the number of years you've completed",
        this.healthCareRatesErrorScope, autoDismissDelay));
    }
    if (this.isShowingHireDate && (this.hireDate === undefined || !this.hireDateOptions.includes(this.hireDate))) {
      errors.push(new ErrorAlertItem(
        "Please select the applicable hire date",
        this.healthCareRatesErrorScope, autoDismissDelay));
    }

    return errors;
  }
  onSubmit() {

    this._errorAlertsService.AddErrorAndBroadcast(new ErrorAlertItem("This is a test"
      , "random", 5000, false, (item) => alert("BOO HOO")));


    this.deductionResults = undefined;
    this._errorAlertsService.ClearErrorsWithScope(this.healthCareRatesErrorScope);


    const errors = this.getFormErrors().reverse();

    if (errors.length > 0) {
      errors.forEach(error => this._errorAlertsService.AddErrorAndBroadcast(error));
      return;
    }

    this.deductionResults = this._healthcareService.getDeductionResults(this.contractName!, this.salary!, this.completedYears!, this.hireDate);
  }
}
