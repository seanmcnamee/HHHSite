const FIRST_PAY_DATE = new Date('2022-09-02T00:00:00');
const DAYS_IN_FIRST_PAY = 2.0;
const PAY_DAYS = 22.0;
const DAYS_BETWEEN_PAY = 14;
const BUSINESS_DAYS_BETWEEN_PAY = 10.0;

const PayPeriodOptions = [
    { period: 26.0, type: "Summer" },
    { period: 22.0, type: "Even" }
];

const PayPeriod = {
    SummerSum: PayPeriodOptions[0],
    Fixed: PayPeriodOptions[1]
};

const SalaryType = {
    First: 0,
    Recurring: 1,
    Last: 2
};

function validateAndCalculate() {
    var salaryTextArea = document.getElementById("YearlySalary");
    var payPeriodRadioButtons = document.getElementById("PayPeriodOption");

    var inputSalary = +sanitizeMonetaryStringInput(salaryTextArea.value);
    var payPeriod = -1;
    for (const element of payPeriodRadioButtons.children) {
        if (element.checked) {
            payPeriod = element.value;
            break;
        }
    }

    if (!moneyAmountIsValid(inputSalary)) {
        return false;
    } else {
        salaryTextArea.value = inputSalary;
    }
    if (!validateRadioButton(payPeriod, "pay period")) {
        return false;
    }
    var payPeriodOption = PayPeriodOptions[payPeriod].period;

    console.log("Salary: ", inputSalary);
    console.log("Pay type: ", PayPeriodOptions[payPeriod].type);
    console.log("Pay period: ", payPeriodOption);

    console.log("% first: ", salaryPayTypeFirstPercent(payPeriodOption));
    console.log("% recurring: ", salaryPayTypeRecurringPercent(payPeriodOption));


    setBreakdownTablesVisible(true);
    listMathBreakdown(inputSalary, payPeriodOption);
}

//For calculation result
function salaryPayTypeFirstPercent(payPeriodOption) {
    return (DAYS_IN_FIRST_PAY / (payPeriodOption * BUSINESS_DAYS_BETWEEN_PAY));
}

function salaryPayTypeRecurringPercent(payPeriodOption) {
    return (1 - salaryPayTypeFirstPercent(payPeriodOption)) / (payPeriodOption - 1);
}



function salaryPayPrelimBiweekly(salary, payPeriodOption) {
    return (salary / payPeriodOption);
}

function salaryPayPrelimDaily(salary, payPeriodOption) {
    return salaryPayPrelimBiweekly(salary, payPeriodOption) / BUSINESS_DAYS_BETWEEN_PAY;
}

function salaryPayTypeFirst(salary, payPeriodOption) {
    return salaryPayPrelimDaily(salary, payPeriodOption) * DAYS_IN_FIRST_PAY;
}

function salaryPayTypeRecurring(salary, payPeriodOption) {
    return (salary - salaryPayTypeFirst(salary, payPeriodOption)) / (payPeriodOption - 1);
}

function salaryPayTypeFinal(salary, payPeriodOption) {
    return (salary - salaryPayTypeFirst(salary, payPeriodOption) - (PAY_DAYS - 2) * salaryPayTypeRecurring(salary, payPeriodOption));
}

//For breakdown
function salaryPayPrelimBiweeklyDisplay(salary, payPeriodOption) {
    return `${salary} / ${payPeriodOption}`;
}

function salaryPayPrelimDailyDisplay(salary, payPeriodOption) {
    return `${salaryPayPrelimBiweekly(salary, payPeriodOption).toFixed(2)} / ${BUSINESS_DAYS_BETWEEN_PAY}`;
}

function salaryPayTypeFirstDisplay(salary, payPeriodOption) {
    return `${salaryPayPrelimDaily(salary, payPeriodOption).toFixed(2)} * ${DAYS_IN_FIRST_PAY}`;
}

function salaryPayTypeRecurringDisplay(salary, payPeriodOption) {
    return `(${salary} - ${salaryPayTypeFirst(salary, payPeriodOption).toFixed(2)}) / ${payPeriodOption - 1}`;
}

function salaryPayTypeFinalDisplay(salary, payPeriodOption) {
    return `${salary} - ${salaryPayTypeFirst(salary, payPeriodOption).toFixed(2)} - ${PAY_DAYS - 2}(${salaryPayTypeRecurring(salary, payPeriodOption).toFixed(2)})`;
}

function listMathBreakdown(inputSalary, payPeriod) {

    document.getElementById("PayTypeHeader").innerText = `${payPeriod.toFixed(0)} paychecks per year`;
    document.getElementById("TotalPay").innerText = `$${inputSalary}`;

    document.getElementById("PrelimBiWeekly").innerText = `$${salaryPayPrelimBiweekly(inputSalary, payPeriod).toFixed(2)} = ${salaryPayPrelimBiweeklyDisplay(inputSalary, payPeriod)}`;
    
    document.getElementById("PrelimDaily").innerText = `$${salaryPayPrelimDaily(inputSalary, payPeriod).toFixed(2)} = ${salaryPayPrelimDailyDisplay(inputSalary, payPeriod)}`;

    document.getElementById("FirstPay").innerText = `$${salaryPayTypeFirst(inputSalary, payPeriod).toFixed(2)} = ${salaryPayTypeFirstDisplay(inputSalary, payPeriod)}`;
    document.getElementById("FirstPayDate").innerText = getDateStr(FIRST_PAY_DATE)
    
    document.getElementById("RecurringPayAmount").innerText = `${salaryPayTypeRecurring(inputSalary, payPeriod).toFixed(2)}`;
    document.getElementById("RecurringPayExpression").innerText = ` = ${salaryPayTypeRecurringDisplay(inputSalary, payPeriod)}`;

    var finalPayDate = getDateWithOffset(FIRST_PAY_DATE, DAYS_BETWEEN_PAY * (PAY_DAYS-1));
    document.getElementById("FinalPay").innerText = `$${salaryPayTypeFinal(inputSalary, payPeriod).toFixed(2)} = ${salaryPayTypeFinalDisplay(inputSalary, payPeriod)}`;
    document.getElementById("FinalPayDate").innerText = getDateStr(finalPayDate);

    function getDateStr(dateInput) {
        var date = new Date(dateInput);
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear() % 100;

        return `${month}/${day}/${year}`;
    }

    function getDateWithOffset(dateInput, days) {
        var date = new Date(dateInput);
        date.setDate(date.getDate() + days);
        return date;
    }
};

function hideOutputsAndClearRadios() {
    setBreakdownTablesVisible(false);
    for (const element of document.getElementById("PayPeriodOption").children) {
        element.checked = false;
    }
}

function setBreakdownTablesVisible(shouldShow) {
    var breakdownTables = document.getElementById("BreakdownTables");
    breakdownTables.classList.add((shouldShow) ? "shown" : "hidden");
    breakdownTables.classList.remove((shouldShow) ? "hidden" : "shown");
}