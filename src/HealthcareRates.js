const Rates = {
//2022 ACTUAL RATES - UPDATED 11/19/21
    HipLow: {Individual: 1008.32, Family: 2470.38},
    NyshipEmpire: {Individual: 1196.12, Family: 2763.74},
    NyshipExcelsior: {Individual: 878.20, Family: 1680.24},
    HipHigh: {Individual: 1442.35, Family: 3533.76},
}

const PercentPaid = {
    None: 0,
    Low: .15,
    Mid: .2,
    High: .25
};

//EXCLUSIVE MAX!!! (level 2 is [60000, 99999.99])
const MaxSalaryOfCategories = {
    LVL_1: 60000,
    LVL_2: 100000
}

//INCLUSIVE MAX
const MaxYearsOfCategories = {
    LVL_1: 1,
    LVL_2: 3
}

const SalaryTypes = {
    NoService: 0,
    SalaryAndYears: 1,
    SalaryOnly: 2,
    FlatRate: 3
}

const ContractName = {
    Administrators: "Administrators",
    Teachers: "Teachers",
    Clerical: "Clerical/Office Personnel",
    Custodial: "Custodial",
    Paraprofessional: "Paraprofessional",
    FoodService: "Food Service",
    Transportation: "Transportation",
    Monitors: "Monitors",
    Security: "Security",
    ManagerialConfidential: "Managerial Confidential",
}

const Contracts = [
    { salaryType: SalaryTypes.FlatRate,         deduction: 24.0,  HipHighCalculation: TypicalHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Administrators},
    { salaryType: SalaryTypes.SalaryOnly,       deduction: 23.0,  HipHighCalculation: LimitedHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Teachers},
    { salaryType: SalaryTypes.SalaryOnly,       deduction: 24.0,  HipHighCalculation: LimitedHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Clerical},
    { salaryType: SalaryTypes.SalaryOnly,       deduction: 24.0,  HipHighCalculation: LimitedHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Custodial},
    { salaryType: SalaryTypes.SalaryOnly,       deduction: 19.0,  HipHighCalculation: LimitedHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Paraprofessional},
    { salaryType: SalaryTypes.NoService,        deduction: 0.0,   HipHighCalculation: TypicalHipHigh,       HipLowCalculation: ContactMessage,      contractName: ContractName.FoodService},
    { salaryType: SalaryTypes.SalaryAndYears,   deduction: 19.0,  HipHighCalculation: TypicalHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Transportation},
    { salaryType: SalaryTypes.NoService,        deduction: 0.0,   HipHighCalculation: TypicalHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Monitors},
    { salaryType: SalaryTypes.NoService,        deduction: 0.0,   HipHighCalculation: TypicalHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.Security},
    { salaryType: SalaryTypes.SalaryOnly,       deduction: 24.0,  HipHighCalculation: TypicalHipHigh,       HipLowCalculation: HipLowAndNyship,     contractName: ContractName.ManagerialConfidential}
];

function LimitedHipHigh(contract, rateHip, percentPaying, rateNyship) {
    return ((12 * rateHip * percentPaying / contract.deduction) + 12 * (1 - percentPaying) * (rateHip - rateNyship) / contract.deduction + .005).toFixed(2) + "";
}

function TypicalHipHigh(contract, rate, percentPaying, uselessButNeeded) {
    return ((12 * rate * percentPaying / contract.deduction) + .005).toFixed(2) + "";
}

function HipLowAndNyship(contract, rate, percentPaying) {
    return (12 * rate * percentPaying / contract.deduction + .005).toFixed(2) + "";
}

function ContactMessage(contract, rate, percentPaying) {
    return "Contact the Benefits Department";
}





//Fill contracts dropdown
var contractsDropdown = document.getElementById("Contracts");
for (var contract in Contracts) {
    contractsDropdown.innerHTML += '<option value="' + contract + '">' + Contracts[contract].contractName + '</option>';
}

//Show/hide inputs based on selected job type
function onContractSelected(selectedContractName) {
    var salaryTextArea = document.getElementById("YearlySalaryContainer");
    var yearsRadiobuttons = document.getElementById("CompletedYearsContainer");
    var startDateCheckbox = document.getElementById("StartDateContainer");

    console.log("clicked: " + selectedContractName.selectedIndex + "  -  " + selectedContractName.value);
    var selectedSalaryType = Contracts[selectedContractName.value].salaryType;
    var selectedContract = Contracts[selectedContractName.value].contractName;

    //DON'T show yeary salary textarea for Noservice or FlatRate.
    setVisible(salaryTextArea, !(selectedSalaryType == SalaryTypes.FlatRate || selectedSalaryType == SalaryTypes.NoService));

    //Show completed years radiobuttons for SalaryAndYears only.
    setVisible(yearsRadiobuttons, (selectedSalaryType === SalaryTypes.SalaryAndYears));

    //Show start date radiobuttons for SalaryAndYears only.
    setVisible(startDateCheckbox, (selectedContract === ContractName.Paraprofessional));
}

//On submission, use all values and calculate deductions
function validateAndCalculate(event) {
    event.preventDefault();

    var contractsDropdown = document.getElementById("Contracts");
    var salaryTextArea = document.getElementById("YearlySalary");
    var yearsRadiobuttons = document.getElementById("CompletedYears");
    var startDateRadiobuttons = document.getElementById("StartDateOnOrAfter20210701");

    var selectedContract = Contracts[contractsDropdown.value];
    var inputSalary = +(salaryTextArea.value.replaceAll(",", "").replaceAll("$", ""));

    var inputYears = getRadioButtonValue(yearsRadiobuttons);
    var inputHireDate = getRadioButtonValue(startDateRadiobuttons);

    if (!validateContractName(selectedContract)) {
        return false;
    }
    if (!validateSalary(selectedContract, inputSalary)) {
        return false;
    } else {
        salaryTextArea.value = inputSalary;
    }
    if (!validatePayPeriod(selectedContract, inputYears)) {
        return false;
    }
    console.log("radios: ", selectedContract, " input", inputHireDate);
    if (!validateHireDate(selectedContract, inputHireDate)) {
        return false;
    }

    calculateAndFillDeductions(selectedContract, inputSalary, inputYears, inputHireDate);
    setDeductionsVisible(true);
}

function validateContractName(selectedContract) {
    if (selectedContract !== null && selectedContract !== undefined) {
        return true;
    }
    alert("Please select a contract name!");
    return false;
}

function validateSalary(selectedContract, inputSalary) {
    return ((selectedContract.salaryType == SalaryTypes.FlatRate || selectedContract.salaryType == SalaryTypes.NoService) || moneyAmountIsValid(inputSalary));
}

function validatePayPeriod(selectedContract, inputYears) {
    return ((selectedContract.salaryType !== SalaryTypes.SalaryAndYears) || validateRadioButton(inputYears, "number of years you've completed"));
}

function validateHireDate(selectedContract, inputHireDate) {
    return ((selectedContract.contractName !== ContractName.Paraprofessional) || validateRadioButton(inputHireDate, "applicable hire date"));
}

function setDeductionsVisible(shouldShow) {
    var deductionsTableArea = document.getElementById("Deductions");
    setVisible(deductionsTableArea, shouldShow)
}

function calculateAndFillDeductions(selectedContract, inputSalary, inputYears, inputHireDate) {
    var percent = Math.max(salaryPercent(selectedContract.salaryType, inputSalary), yearsPercent(selectedContract.salaryType, inputYears));

    document.getElementById("HipLowIndividual").innerText = selectedContract.HipLowCalculation(selectedContract, Rates.HipLow.Individual, percent);
    document.getElementById("HipLowFamily").innerText = selectedContract.HipLowCalculation(selectedContract, Rates.HipLow.Family, percent);
    document.getElementById("NyshipIndividual").innerText = HipLowAndNyship(selectedContract, Rates.NyshipEmpire.Individual, percent);
    document.getElementById("NyshipFamily").innerText = HipLowAndNyship(selectedContract, Rates.NyshipEmpire.Family, percent);
    document.getElementById("NyshipIndividualExcelsior").innerText = HipLowAndNyship(selectedContract, Rates.NyshipExcelsior.Individual, percent);
    document.getElementById("NyshipFamilyExcelsior").innerText = HipLowAndNyship(selectedContract, Rates.NyshipExcelsior.Family, percent);
    document.getElementById("HipHighIndividual").innerText = selectedContract.HipHighCalculation(selectedContract, Rates.HipHigh.Individual, percent, Rates.NyshipEmpire.Individual);
    document.getElementById("HipHighFamily").innerText = selectedContract.HipHighCalculation(selectedContract, Rates.HipHigh.Family, percent, Rates.NyshipEmpire.Family);

    hideAndShowNyship(selectedContract, inputHireDate);
}

function hideAndShowNyship(selectedContract, inputHireDate) {
    var isExcelsior = (selectedContract.contractName == ContractName.Paraprofessional && (inputHireDate > 0));
    var nyshipExcelsior = document.getElementsByClassName("NyshipExcelsior");
    var nyshipEmpire = document.getElementsByClassName("NyshipEmpire");

    console.log("Test quick: ", nyshipExcelsior[0]);
    

    console.log("Contract: ", selectedContract);
    console.log("HireDate: ", inputHireDate);
    console.log("Excelsior: ", isExcelsior);
    console.log("Not Excelsior: ", !isExcelsior);

    for (var i = 0; i < nyshipExcelsior.length; i++) {
        setDisplaying(nyshipExcelsior[i], isExcelsior);
    }

    for (var i = 0; i < nyshipEmpire.length; i++) {
        setDisplaying(nyshipEmpire[i], !isExcelsior);
    }
    
    
}

function salaryPercent(salaryType, inputSalary) {
    if (salaryType === SalaryTypes.NoService) {
        return PercentPaid.None;
    } else if (salaryType === SalaryTypes.FlatRate) {
        return PercentPaid.High;
    } else if (inputSalary < MaxSalaryOfCategories.LVL_1) {
        return PercentPaid.Low;
    } else if (inputSalary < MaxSalaryOfCategories.LVL_2) {
        return PercentPaid.Mid;
    } else {
        return PercentPaid.High;
    }
}

function yearsPercent(salaryType, inputYears) {
    if (salaryType !== SalaryTypes.SalaryAndYears) {
        return 0;
    } else if (inputYears <= MaxYearsOfCategories.LVL_1) {
        return PercentPaid.High;
    } else if (inputYears <= MaxYearsOfCategories.LVL_2) {
        return PercentPaid.Mid;
    } else {
        return PercentPaid.Low;
    }
}
