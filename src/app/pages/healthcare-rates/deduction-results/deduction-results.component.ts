import { DeductionResults, DeductionResultType } from "@/app/common/services/healthcare-rates/healthcare-rates.service.interface";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-deduction-results",
  templateUrl: "./deduction-results.component.html",
  styleUrls: ["./deduction-results.component.scss"]
})
export class DeductionResultsComponent {
  @Input() deductionResults: DeductionResults | undefined;

  constructor() { }

  isDeductionResultTypeValid(deductionResultType: DeductionResultType): boolean {
    return deductionResultType.family !== undefined && deductionResultType.individual !== undefined;
  }
}
