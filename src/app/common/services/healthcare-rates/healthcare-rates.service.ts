import { Injectable } from '@angular/core';
import { ContractName, IHealthcareRatesService, DeductionResults, SalaryType, CompletedYears, HireDate } from '@/common/services/healthcare-rates/healthcare-rates.service.interface';
import { PayPeriod } from '@/common/models/PayPeriod';

@Injectable({
    providedIn: "root"
})
export class HealthcareRatesService implements IHealthcareRatesService {
    private readonly ratesUpdateDate: string = "01/01/2024";
    private readonly yearForRates: string = "2024";
    private readonly rates: Rates = {
        //2024 ACTUAL RATES - UPDATED 11/27/23
        hipLow: { individual: 1254.56, family: 3073.65 },
        nyshipEmpire: { individual: 1445.66, family: 3367.09 },
        nyshipExcelsior: { individual: 1344.47, family: 3131.42 },
        hipHigh: { individual: 1763.65, family: 4320.93 },
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
            salaryType: SalaryType.SalaryAndHireDate, deductionGetter: SingleDeduction(19.0),
            hipLowCalculation: WhenHireDateIs(HireDate.Before_2022_07_01, TypicalCalculation, CalculationDisabled),
            nyshipEmpireCalculation: WhenHireDateIs(HireDate.Before_2022_07_01, TypicalCalculation, CalculationDisabled),
            nyshipExcelsiorCalculation: WhenHireDateIs(HireDate.OnOrAfter_2022_07_01, TypicalCalculation, CalculationDisabled),
            hipHighCalculation: WhenHireDateIs(HireDate.Before_2022_07_01, LimitedHipHigh, CalculationDisabled)
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
    getHireDateOptions(): HireDate[] {
        return Object.values(HireDate);
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

    getDeductionResults(contractName: ContractName, inputSalary: number, completedYears: CompletedYears | undefined, hireDate: HireDate | undefined, payPeriods: number | undefined): DeductionResults {
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
                    individual: selectedContract.hipLowCalculation(contractDeduction, percent, this.rates.hipLow.individual, 0, hireDate),
                    family: selectedContract.hipLowCalculation(contractDeduction, percent, this.rates.hipLow.family, 0, hireDate),
                },
                nyshipEmpire: {
                    individual: selectedContract.nyshipEmpireCalculation(contractDeduction, percent, this.rates.nyshipEmpire.individual, 0, hireDate),
                    family: selectedContract.nyshipEmpireCalculation(contractDeduction, percent, this.rates.nyshipEmpire.family, 0, hireDate),
                },
                nyshipExcelsior: {
                    individual: selectedContract.nyshipExcelsiorCalculation(contractDeduction, percent, this.rates.nyshipExcelsior.individual, 0, hireDate),
                    family: selectedContract.nyshipExcelsiorCalculation(contractDeduction, percent, this.rates.nyshipExcelsior.family, 0, hireDate),
                },
                hipHigh: {
                    individual: selectedContract.hipHighCalculation(contractDeduction, percent, this.rates.hipHigh.individual, this.rates.nyshipEmpire.individual, hireDate),
                    family: selectedContract.hipHighCalculation(contractDeduction, percent, this.rates.hipHigh.family, this.rates.nyshipEmpire.family, hireDate),
                }
            },
            perMonth: {
                hipLow: {
                    individual: selectedContract.hipLowCalculation(monthsInYear, percent, this.rates.hipLow.individual, 0, hireDate),
                    family: selectedContract.hipLowCalculation(monthsInYear, percent, this.rates.hipLow.family, 0, hireDate),
                },
                nyshipEmpire: {
                    individual: selectedContract.nyshipEmpireCalculation(monthsInYear, percent, this.rates.nyshipEmpire.individual, 0, hireDate),
                    family: selectedContract.nyshipEmpireCalculation(monthsInYear, percent, this.rates.nyshipEmpire.family, 0, hireDate),
                },
                nyshipExcelsior: {
                    individual: selectedContract.nyshipExcelsiorCalculation(monthsInYear, percent, this.rates.nyshipExcelsior.individual, 0, hireDate),
                    family: selectedContract.nyshipExcelsiorCalculation(monthsInYear, percent, this.rates.nyshipExcelsior.family, 0, hireDate),
                },
                hipHigh: {
                    individual: selectedContract.hipHighCalculation(monthsInYear, percent, this.rates.hipHigh.individual, this.rates.nyshipEmpire.individual, hireDate),
                    family: selectedContract.hipHighCalculation(monthsInYear, percent, this.rates.hipHigh.family, this.rates.nyshipEmpire.family, hireDate),
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
type ContractDefinitionCalculation = (deduction: number, percentPaying: number, rate: number, rateAlt: number, hireDate: HireDate | undefined) => string | undefined;

function roundResult(result: number) {
    return (result + .005).toFixed(2).toString();
}

function LimitedHipHigh(deduction: number, percentPaying: number, rateHip: number, rateNyship: number, _: HireDate | undefined) {
    const result = (12 * rateHip * percentPaying / deduction) + 12 * (1 - percentPaying) * (rateHip - rateNyship) / deduction;
    return roundResult(result);
}

function TypicalCalculation(deduction: number, percentPaying: number, rate: number, _: number, __: HireDate | undefined) {
    const result = 12 * rate * percentPaying / deduction;
    return roundResult(result);
}

function WhenHireDateIs(hireDateEquals: HireDate, trueCalc: ContractDefinitionCalculation, falseCalc: ContractDefinitionCalculation): ContractDefinitionCalculation {
    return (deduction: number, percentPaying: number, rateHip: number, rateNyship: number, hireDate: HireDate | undefined) => {
        if (hireDate === hireDateEquals) {
            return trueCalc(deduction, percentPaying, rateHip, rateNyship, hireDate);
        } else {
            return falseCalc(deduction, percentPaying, rateHip, rateNyship, hireDate);
        }
    }
}

function ContactMessage(_: number, __: number, ___: number, ____: number, _____: HireDate | undefined) {
    return "Contact the Benefits Department";
}
function NotAvailable(_: number, __: number, ___: number, ____: number, _____: HireDate | undefined) {
    return "Not available";
}

function CalculationDisabled(_: number, __: number, ___: number, ____: number, _____: HireDate | undefined) {
    return undefined;
}
