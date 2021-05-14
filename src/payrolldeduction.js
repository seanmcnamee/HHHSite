const Rates = {
    HipLow: {Individual: 940.81, Family: 2304.98},
    Nyship: {Individual: 1074.87, Family: 2452.24},
    HipHigh: {Individual: 1351.84, Family: 3312.00},
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

const Contracts = {
    "Administration":               { salaryType: SalaryTypes.FlatRate,         deduction: 24.0,  HipHighCalculation: TypicalHipHigh },
    "Teachers":                     { salaryType: SalaryTypes.SalaryOnly,       deduction: 23.0,  HipHighCalculation: TeacherClericalCustodianHipHigh },
    "Clerical/Office Personnel":    { salaryType: SalaryTypes.SalaryOnly,       deduction: 24.0,  HipHighCalculation: TeacherClericalCustodianHipHigh },
    "Custodial":                    { salaryType: SalaryTypes.SalaryOnly,       deduction: 24.0,  HipHighCalculation: TeacherClericalCustodianHipHigh },
    "Paraprofessional":             { salaryType: SalaryTypes.FlatRate,         deduction: 19.0,  HipHighCalculation: TypicalHipHigh },
    "Food Service":                 { salaryType: SalaryTypes.NoService,        deduction: 0.0,   HipHighCalculation: TypicalHipHigh  },
    "Transportation":               { salaryType: SalaryTypes.SalaryAndYears,   deduction: 19.0,  HipHighCalculation: TypicalHipHigh },
    "Monitors":                     { salaryType: SalaryTypes.NoService,        deduction: 0.0,   HipHighCalculation: TypicalHipHigh  },
    "Security":                     { salaryType: SalaryTypes.NoService,        deduction: 0.0,   HipHighCalculation: TypicalHipHigh   },
    "Managerial Confidential":      { salaryType: SalaryTypes.SalaryOnly,       deduction: 24.0,  HipHighCalculation: TypicalHipHigh }
};

function TeacherClericalCustodianHipHigh(contract, rateHip, percentPaying, rateNyship) {
    return ((12 * rateHip * percentPaying / contract.deduction) + 12 * (1 - percentPaying) * (rateHip - rateNyship) / contract.deduction + .005).toFixed(2) + ""
}

function TypicalHipHigh(contract, rate, percentPaying, uselessButNeeded) {
    return ((12 * rate * percentPaying / contract.deduction) + .005).toFixed(2) + ""
}

function HipLowAndNyship(contract, rate, percentPaying) {
    return (12 * rate * percentPaying / contract.deduction + .005).toFixed(2) + ""
}





//Fill contracts dropdown
var contractsDropdown = document.getElementById("Contracts");
for (var contractName in Contracts) {
    contractsDropdown.innerHTML += '<option value="' + contractName + '">' + contractName + '</option>';
}

//Show/hide inputs based on selected job type
function onContractSelected(selectedContractName) {
    var yearsRadiobuttons = document.getElementById("CompletedYearsContainer");
    var salaryTextArea = document.getElementById("YearlySalaryContainer");

    console.log("clicked: " + selectedContractName.selectedIndex + "  -  " + selectedContractName.value);
    var selectedSalaryType = Contracts[selectedContractName.value].salaryType;

    //DON'T show yeary salary textarea for salaryType 3.
    salaryTextArea.classList.add((selectedSalaryType == 3 || selectedSalaryType == 0)? "hidden": "shown");
    salaryTextArea.classList.remove((selectedSalaryType == 3 || selectedSalaryType == 0)? "shown": "hidden");

    //Show completed years radiobuttons for salaryType 1 only.
    yearsRadiobuttons.classList.add((selectedSalaryType === 1)? "shown": "hidden");
    yearsRadiobuttons.classList.remove((selectedSalaryType === 1)? "hidden": "shown");
}

//On submission, use all values and calculate deductions
function validateAndCalculate(event) {
    event.preventDefault();

    var contractsDropdown = document.getElementById("Contracts");
    var salaryTextArea = document.getElementById("YearlySalary");
    var yearsRadiobuttons = document.getElementById("CompletedYears");

    var selectedContract = Contracts[contractsDropdown.value];
    var inputSalary = +salaryTextArea.value;

    var inputYears = -1;
    for (const element of yearsRadiobuttons.children) {
        if (element.checked) {
            inputYears = element.value;
            break;
        }
    }

    if (!validateContractName(selectedContract)) {
        return false;
    }
    if (!validateSalary(selectedContract, inputSalary)) {
        return false;
    }
    console.log(inputSalary);
    if (!validateYearsWorked(selectedContract, inputYears)) {
        return false;
    }

    calculateAndFillDeductions(selectedContract, inputSalary, inputYears);
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
    if ((selectedContract.salaryType == 3 || selectedContract.salaryType == 0) || (inputSalary !== undefined && inputSalary !== "" && !Number.isNaN(inputSalary) && inputSalary !== 0)) {
        return true;
    }
    alert("Please enter a valid salary! Make sure your salary only has numbers (no dollar signs, commas, etc)");
    return false;
}

function validateYearsWorked(selectedContract, inputYears) {
    if ((selectedContract.salaryType !== 1) || inputYears >= 0) {
        return true;
    }
    alert("Please select the number of years you've completed");
    return false;
}

function setDeductionsVisible(shouldShow) {
    var deductionsTableArea = document.getElementById("Deductions");
    deductionsTableArea.classList.add((shouldShow)? "shown": "hidden");
    deductionsTableArea.classList.remove((shouldShow)? "hidden": "shown");
}

function calculateAndFillDeductions(selectedContract, inputSalary, inputYears) {
    var percent = Math.max(salaryPercent(selectedContract.salaryType, inputSalary), yearsPercent(selectedContract.salaryType, inputYears));

    document.getElementById("HipLowIndividual").innerText = HipLowAndNyship(selectedContract, Rates.HipLow.Individual, percent);
    document.getElementById("HipLowFamily").innerText = HipLowAndNyship(selectedContract, Rates.HipLow.Family, percent);
    document.getElementById("NyshipIndividual").innerText = HipLowAndNyship(selectedContract, Rates.Nyship.Individual, percent);
    document.getElementById("NyshipFamily").innerText = HipLowAndNyship(selectedContract, Rates.Nyship.Family, percent);
    document.getElementById("HipHighIndividual").innerText = selectedContract.HipHighCalculation(selectedContract, Rates.HipHigh.Individual, percent, Rates.Nyship.Individual);
    document.getElementById("HipHighFamily").innerText = selectedContract.HipHighCalculation(selectedContract, Rates.HipHigh.Family, percent, Rates.Nyship.Family);
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
    if (salaryType !== 1) {
        return -1;
    } else if (inputYears <= MaxYearsOfCategories.LVL_1) {
        return PercentPaid.High;
    } else if (inputYears <= MaxYearsOfCategories.LVL_2) {
        return PercentPaid.Mid;
    } else {
        return PercentPaid.Low;
    }
}
