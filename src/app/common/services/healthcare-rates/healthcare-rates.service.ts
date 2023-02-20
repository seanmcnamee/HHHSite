import { Injectable } from '@angular/core';
import { ContractName, IHealthcareRatesService, DeductionResults, SalaryType, CompletedYears, HireDate } from '@/common/services/healthcare-rates/healthcare-rates.service.interface';

@Injectable({
    providedIn: 'root'
})
export class HealthcareRatesService implements IHealthcareRatesService {
    private ratesUpdateDate: string = "11/23/2022";
    private yearForRates: string = "2023";
    private rates: Rates = {
        //2023 ACTUAL RATES - UPDATED 11/23/22
        hipLow: { individual: 1093.73, family: 2679.63 },
        nyshipEmpire: { individual: 1345.06, family: 3175.87 },
        nyshipExcelsior: { individual: 1097.75, family: 2100.30 },
        hipHigh: { individual: 1553.45, family: 3805.95 },
    };
    private contracts: Map<ContractName, ContractDefinition> = new Map([
        [ContractName.Administrators, {
            salaryType: SalaryType.FlatRate, deduction: 24.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation
        }],
        [ContractName.Teachers, {
            salaryType: SalaryType.SalaryOnly, deduction: 23.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: LimitedHipHigh,
        }],
        [ContractName.Clerical, {
            salaryType: SalaryType.SalaryOnly, deduction: 24.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: LimitedHipHigh,
        }],
        [ContractName.Custodial, {
            salaryType: SalaryType.SalaryOnly, deduction: 24.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: LimitedHipHigh,
        }],
        [ContractName.Paraprofessional, {
            salaryType: SalaryType.SalaryAndHireDate, deduction: 19.0,
            hipLowCalculation: WhenHireDateIs(HireDate.Before_2022_07_01, TypicalCalculation, CalculationDisabled),
            nyshipEmpireCalculation: WhenHireDateIs(HireDate.Before_2022_07_01, TypicalCalculation, CalculationDisabled),
            nyshipExcelsiorCalculation: WhenHireDateIs(HireDate.OnOrAfter_2022_07_2022, TypicalCalculation, CalculationDisabled),
            hipHighCalculation: WhenHireDateIs(HireDate.Before_2022_07_01, LimitedHipHigh, CalculationDisabled)
        }],
        [ContractName.FoodService, {
            salaryType: SalaryType.NoService, deduction: 0.0,
            hipLowCalculation: ContactMessage,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation,
        }],
        [ContractName.Transportation, {
            salaryType: SalaryType.SalaryAndYears, deduction: 19.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation,
        }],
        [ContractName.Monitors, {
            salaryType: SalaryType.NoService, deduction: 0.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation,
        }],
        [ContractName.Security, {
            salaryType: SalaryType.NoService, deduction: 0.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation,
        }],
        [ContractName.ManagerialConfidential, {
            salaryType: SalaryType.SalaryOnly, deduction: 24.0,
            hipLowCalculation: TypicalCalculation,
            nyshipEmpireCalculation: TypicalCalculation,
            nyshipExcelsiorCalculation: CalculationDisabled,
            hipHighCalculation: TypicalCalculation,
        }]
    ]);

    constructor() { }

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

    getDeductionResults(contractName: ContractName, inputSalary: number, completedYears: CompletedYears| undefined, hireDate: HireDate | undefined): DeductionResults {
        const selectedContract = this.contracts.get(contractName);
        if (selectedContract === undefined) {
            //TODO: Display Error
            const emptyResult: DeductionResults = {
                hipLow: {},
                nyshipEmpire: {},
                nyshipExcelsior: {},
                hipHigh: {}
            };
            return emptyResult;
        }

        const contractSalaryType = selectedContract.salaryType;
        const contractDeduction = selectedContract.deduction;

        const percent = Math.max(this.getSalaryPercent(contractSalaryType, inputSalary), this.getYearsPercent(contractSalaryType, completedYears));

        const calculatedResult: DeductionResults = {
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
        };
        return calculatedResult;
    }

    private getSalaryPercent(salaryType: SalaryType, inputSalary: number) {
        if (salaryType === SalaryType.NoService) {
            return PercentPaid.None;
        } else if (salaryType === SalaryType.FlatRate) {
            return PercentPaid.High;
        } else if (inputSalary < MaxSalaryOfCategoriesExclusive.LVL_1) {
            return PercentPaid.Low;
        } else if (inputSalary < MaxSalaryOfCategoriesExclusive.LVL_2) {
            return PercentPaid.Mid;
        } else {
            return PercentPaid.High;
        }
    }

    private getYearsPercent(salaryType: SalaryType, inputYears: CompletedYears | undefined) {
        if (salaryType !== SalaryType.SalaryAndYears || inputYears === undefined) {
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
    High = .25
};

//EXCLUSIVE MAX!!! (level 2 is [60000, 99999.99])
enum MaxSalaryOfCategoriesExclusive {
    LVL_1 = 60000,
    LVL_2 = 100000
}

interface ContractDefinition {
    salaryType: SalaryType,
    deduction: number,
    hipHighCalculation: ContractDefinitionCalculation
    hipLowCalculation: ContractDefinitionCalculation
    nyshipEmpireCalculation: ContractDefinitionCalculation
    nyshipExcelsiorCalculation: ContractDefinitionCalculation
}
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

function CalculationDisabled(_: number, __: number, ___: number, ____: number, _____: HireDate | undefined) {
    return undefined;
}