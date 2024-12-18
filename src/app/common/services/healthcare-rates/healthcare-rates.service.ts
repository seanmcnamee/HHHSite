import { Injectable } from '@angular/core';
import { ContractName, IHealthcareRatesService, DeductionResults, SalaryType, CompletedYears } from '@/common/services/healthcare-rates/healthcare-rates.service.interface';
import { PayPeriod } from '@/common/models/PayPeriod';

@Injectable({
    providedIn: "root"
})
export class HealthcareRatesService implements IHealthcareRatesService {
    private readonly ratesUpdateDate: string = "01/01/2025";
    private readonly yearForRates: string = "2025";
    private readonly rates: Rates = {
        //2025 ACTUAL RATES - UPDATED 11/27/24
        hipLow: { individual: 1375.66, family: 3370.37 },
        nyshipEmpire: { individual: 1479.53, family: 3367.80 },
        //AS OF 1/1/25, EXCELSIOR NO LONGER OFFERED
      nyshipExcelsior: { individual: 0, family: 0 },
        hipHigh: { individual: 1921.70, family: 4708.15 },
    };
    private readonly contracts: Map<ContractName, ContractDefinition> = new Map([
        [ContractName.Administrators, {
            salaryType: SalaryType.FlatRate, deductionGetter: SingleDeduction(24.0),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation
        }],
        [ContractName.Teachers, {
            salaryType: SalaryType.SalaryOnly, deductionGetter: SingleDeduction(23.0),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: LimitedHipHigh,
        }],
        [ContractName.Clerical, {
            salaryType: SalaryType.SalaryAndPayPeriod, deductionGetter: PassThroughDeduction(),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: LimitedHipHigh,
        }],
        [ContractName.Custodial, {
            salaryType: SalaryType.SalaryOnly, deductionGetter: SingleDeduction(24.0),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: LimitedHipHigh,
        }],
        [ContractName.Paraprofessional, {
            salaryType: SalaryType.SalaryOnly, deductionGetter: SingleDeduction(19.0),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: LimitedHipHigh
        }],
        [ContractName.FoodService, {
            salaryType: SalaryType.NoService, deductionGetter: SingleDeduction(0.0),
            hipLowCalculation: ContactMessage,
            nyshipEmpireCalculation: CalculationDisabled,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: CalculationDisabled,
        }],
        [ContractName.Transportation, {
            salaryType: SalaryType.SalaryAndYearsAndPayPeriod, deductionGetter: PassThroughDeduction(),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation,
        }],
        [ContractName.Monitors, {
            salaryType: SalaryType.NoService, deductionGetter: SingleDeduction(0.0),
            hipLowCalculation: NotAvailable,
            nyshipEmpireCalculation: NotAvailable,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: NotAvailable,
        }],
        [ContractName.Security, {
            salaryType: SalaryType.FullCost, deductionGetter: SingleDeduction(19.0),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: NotAvailable,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: NotAvailable,
        }],
        [ContractName.ManagerialConfidential, {
            salaryType: SalaryType.SalaryOnly, deductionGetter: SingleDeduction(24.0),
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation,
        }]
    ]);

    getYearForRates(): string {
        return this.yearForRates;
    }

    getRatesUpdatedDate(): string {
        return this.ratesUpdateDate;
    }

    getContractKeys(): ContractName[] {
        return Array.from(this.contracts.keys());
    }

    getContractSalaryType(contractName: ContractName | undefined): SalaryType | undefined {
        if (contractName === undefined) return undefined;
        return this.contracts.get(contractName)?.salaryType;
    }

    getCompletedYearsOptions(): CompletedYears[] {
        return Object.values(CompletedYears);
    }
    getPayPeriodOptions(): PayPeriod[] {
        return [
            { text: "10 month", value: 19.0 },
            { text: "12 month", value: 24.0 },
        ]
    }

    getContractDeductions(contractName: ContractName | undefined, payPeriods: number | undefined): number | undefined {
        if (contractName === undefined) return undefined;

        const selectedContract = this.contracts.get(contractName);
        if (selectedContract === undefined) return undefined;

        return selectedContract.deductionGetter(payPeriods)
    }

    getDeductionResults(contractName: ContractName, inputSalary: number, completedYears: CompletedYears | undefined, payPeriods: number | undefined): DeductionResults {
        const selectedContract = this.contracts.get(contractName);
        if (selectedContract === undefined) {
            console.error("Unable to retrieve contract from: ", contractName);
            const emptyResult: DeductionResults = {
                perPayroll: {
                    hipLow: {},
                    nyshipEmpire: {},
                    nyshipExcelsior: {},
                    hipHigh: {}
                },
                perMonth: {
                    hipLow: {},
                    nyshipEmpire: {},
                    nyshipExcelsior: {},
                    hipHigh: {}
                },
            };
            return emptyResult;
        }

        const contractSalaryType = selectedContract.salaryType;
        const contractDeduction = selectedContract.deductionGetter(payPeriods);

        const percent = Math.max(this.getSalaryPercent(contractSalaryType, inputSalary), this.getYearsPercent(contractSalaryType, completedYears));

        const monthsInYear = 12;
        const calculatedResult: DeductionResults = {
            perPayroll: {
                hipLow: {
                    individual: selectedContract.hipLowCalculation(contractDeduction, percent, this.rates.hipLow.individual, 0),
                    family: selectedContract.hipLowCalculation(contractDeduction, percent, this.rates.hipLow.family, 0),
                },
                nyshipEmpire: {
                    individual: selectedContract.nyshipEmpireCalculation(contractDeduction, percent, this.rates.nyshipEmpire.individual, 0),
                    family: selectedContract.nyshipEmpireCalculation(contractDeduction, percent, this.rates.nyshipEmpire.family, 0),
                },
                nyshipExcelsior: {
                    individual: selectedContract.nyshipExcelsiorCalculation(contractDeduction, percent, this.rates.nyshipExcelsior.individual, 0),
                    family: selectedContract.nyshipExcelsiorCalculation(contractDeduction, percent, this.rates.nyshipExcelsior.family, 0),
                },
                hipHigh: {
                    individual: selectedContract.hipHighCalculation(contractDeduction, percent, this.rates.hipHigh.individual, this.rates.nyshipEmpire.individual),
                    family: selectedContract.hipHighCalculation(contractDeduction, percent, this.rates.hipHigh.family, this.rates.nyshipEmpire.family),
                }
            },
            perMonth: {
                hipLow: {
                    individual: selectedContract.hipLowCalculation(monthsInYear, percent, this.rates.hipLow.individual, 0),
                    family: selectedContract.hipLowCalculation(monthsInYear, percent, this.rates.hipLow.family, 0),
                },
                nyshipEmpire: {
                    individual: selectedContract.nyshipEmpireCalculation(monthsInYear, percent, this.rates.nyshipEmpire.individual, 0),
                    family: selectedContract.nyshipEmpireCalculation(monthsInYear, percent, this.rates.nyshipEmpire.family, 0),
                },
                nyshipExcelsior: {
                    individual: selectedContract.nyshipExcelsiorCalculation(monthsInYear, percent, this.rates.nyshipExcelsior.individual, 0),
                    family: selectedContract.nyshipExcelsiorCalculation(monthsInYear, percent, this.rates.nyshipExcelsior.family, 0),
                },
                hipHigh: {
                    individual: selectedContract.hipHighCalculation(monthsInYear, percent, this.rates.hipHigh.individual, this.rates.nyshipEmpire.individual),
                    family: selectedContract.hipHighCalculation(monthsInYear, percent, this.rates.hipHigh.family, this.rates.nyshipEmpire.family),
                }
            }
        };
        return calculatedResult;
    }

    private getSalaryPercent(salaryType: SalaryType, inputSalary: number | undefined) {
        if (salaryType === SalaryType.NoService) {
            return PercentPaid.None;
        } else if (salaryType === SalaryType.FullCost) {
          return PercentPaid.Full;
        } else if (salaryType === SalaryType.FlatRate) {
            return PercentPaid.High;
        } else if (inputSalary !== undefined && inputSalary < MaxSalaryOfCategoriesExclusive.LVL_1) {
            return PercentPaid.Low;
        } else if (inputSalary !== undefined && inputSalary < MaxSalaryOfCategoriesExclusive.LVL_2) {
            return PercentPaid.Mid;
        } else {
            return PercentPaid.High;
        }
    }

    private getYearsPercent(salaryType: SalaryType, inputYears: CompletedYears | undefined) {
        if (salaryType !== SalaryType.SalaryAndYearsAndPayPeriod || inputYears === undefined) {
            return 0;
        } else if (inputYears === CompletedYears.ZeroToOne) {
            return PercentPaid.High;
        } else if (inputYears === CompletedYears.TwoToThree) {
            return PercentPaid.Mid;
        } else {
            return PercentPaid.Low;
        }
    }
}

interface Rates {
    hipLow: RateDefinition,
    nyshipEmpire: RateDefinition,
    nyshipExcelsior: RateDefinition,
    hipHigh: RateDefinition,
}
interface RateDefinition {
    individual: number;
    family: number;
}

enum PercentPaid {
    None = 0,
    Low = .15,
    Mid = .2,
    High = .25,
    Full = 1.0
};

//EXCLUSIVE MAX!!! (level 2 is [60000, 99999.99])
enum MaxSalaryOfCategoriesExclusive {
    LVL_1 = 60000,
    LVL_2 = 100000
}

interface ContractDefinition {
    salaryType: SalaryType,
    deductionGetter: DeductionGetter,
    hipHighCalculation: ContractDefinitionCalculation
    hipLowCalculation: ContractDefinitionCalculation
    nyshipEmpireCalculation: ContractDefinitionCalculation
    nyshipExcelsiorCalculation: ContractDefinitionCalculation
}
//Deduction Getters
type DeductionGetter = (key: number | undefined) => number;

function SingleDeduction(deduction: number): DeductionGetter {
    return (_: number | undefined): number => deduction;
}
function PassThroughDeduction(): DeductionGetter {
    return (key: number | undefined): number => {
        return key ?? 0;
    };
}



//Contract Definition Calculation
type ContractDefinitionCalculation = (deduction: number, percentPaying: number, rate: number, rateAlt: number) => string | undefined;

function roundResult(result: number) {
    return (result + .005).toFixed(2).toString();
}

function LimitedHipHigh(deduction: number, percentPaying: number, rateHip: number, rateNyship: number) {
    const result = (12 * rateHip * percentPaying / deduction) + 12 * (1 - percentPaying) * (rateHip - rateNyship) / deduction;
    return roundResult(result);
}

function TypicalCalculation(deduction: number, percentPaying: number, rate: number, _: number) {
    const result = 12 * rate * percentPaying / deduction;
    return roundResult(result);
}

function ContactMessage(_: number, __: number, ___: number, ____: number) {
    return "Contact the Benefits Department";
}
function NotAvailable(_: number, __: number, ___: number, ____: number) {
    return "Not available";
}

function CalculationDisabled(_: number, __: number, ___: number, ____: number) {
    return undefined;
}
