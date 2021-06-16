const FIRST_PAY_DATE = new Date('2021-09-03T00:00:00');
const DAYS_IN_FIRST_PAY = 3.0;
const PAY_DAYS = 22.0;
const DAYS_BETWEEN_PAY = 14;
const BUSINESS_DAYS_BETWEEN_PAY = 10.0;

const PayPeriodOptions = [
    {period: 26.0, type: "Summer" },
    {period: 22.0, type: "Even"}
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

    var inputSalary = +(salaryTextArea.value.replaceAll(",", "").replaceAll("$", ""));
    var payPeriod = -1;
    for (const element of payPeriodRadioButtons.children) {
        if (element.checked) {
            payPeriod = element.value;
            break;
        }
    }

    if (!moneyAmountIsValid(inputSalary)) {
        return false;
    }
    if (!validateRadioButton(payPeriod, "your pay period")) {
        return false;
    }
    var payPeriodOption = PayPeriodOptions[payPeriod].period;

    console.log("Salary: ", inputSalary);
    console.log("Pay type: ", PayPeriodOptions[payPeriod].type);
    console.log("Pay period: ", payPeriodOption);

    console.log("% first: ", salaryPayTypeFirstPercent(payPeriodOption));
    console.log("% recurring: ", salaryPayTypeRecurringPercent(payPeriodOption));


    salaries = getSalariesFor(inputSalary, payPeriodOption);

    setBreakdownTablesVisible(true);
    listMathBreakdown(inputSalary, getSalariesFor(inputSalary, PayPeriod.SummerSum.period), getSalariesFor(inputSalary, PayPeriod.Fixed.period));

    clearCalendar();
    listPayDays(salaries);
}

function getSalariesFor(inputSalary, payPeriodOption) {
    var salaries = [];
    salaries[SalaryType.First] = salaryPayTypeFirst(inputSalary, payPeriodOption);
    salaries[SalaryType.Recurring] = salaryPayTypeRecurring(inputSalary, payPeriodOption);
    salaries[SalaryType.Last] = salaryPayTypeFinal(inputSalary, payPeriodOption);
    return salaries;
}

//For display
function salaryPayTypeFirstPercent(payPeriodOption) {
    return (DAYS_IN_FIRST_PAY / (payPeriodOption * BUSINESS_DAYS_BETWEEN_PAY));
}

function salaryPayTypeRecurringPercent(payPeriodOption) {
    return (1 - salaryPayTypeFirstPercent(payPeriodOption)) / (payPeriodOption - 1);
}

function salaryPayTypeFirst(salary, payPeriodOption) {
    return (salary * salaryPayTypeFirstPercent(payPeriodOption)).toFixed(2) + "";
}

function salaryPayTypeRecurring(salary, payPeriodOption) {
    return (salary * salaryPayTypeRecurringPercent(payPeriodOption)).toFixed(2) + "";
}

function salaryPayTypeFinal(salary, payPeriodOption) {
    return (salary - salaryPayTypeFirst(salary, payPeriodOption) - (PAY_DAYS-2)*salaryPayTypeRecurring(salary, payPeriodOption)).toFixed(2) + "";
}

//For breakdown
function salaryPayTypeFirstDisplay(salary, payPeriodOption) {
    return "(" + salary + " * (" + DAYS_IN_FIRST_PAY + " / (" + (payPeriodOption * BUSINESS_DAYS_BETWEEN_PAY) + ")))";
}

function salaryLeftAfterFirst(salary, salaries) {
    return salary + " - " + salaries[SalaryType.First];
}

function salaryPayTypeRecurringDisplay(salary, payPeriodOption) {
    return salary + " * (1 - (" + DAYS_IN_FIRST_PAY + " / (" + (payPeriodOption * BUSINESS_DAYS_BETWEEN_PAY) + "))) / (" + (payPeriodOption - 1) + ")";
}

function salaryPayTypeFinalDisplay(salary, salaries) {
    return salary + " - " + salaries[SalaryType.First] + " - (" + (PAY_DAYS-2) + " * " + salaries[SalaryType.Recurring] + ")";
}

function listMathBreakdown(inputSalary, salaries26, salaries22) {
    document.getElementById("TotalPay26").innerText = inputSalary;
    document.getElementById("TotalPay22").innerText = inputSalary;
    
    document.getElementById("FirstPay26").innerText = salaryPayTypeFirstDisplay(inputSalary, PayPeriod.SummerSum.period) + " = " + salaries26[SalaryType.First];
    document.getElementById("FirstPay22").innerText = salaryPayTypeFirstDisplay(inputSalary, PayPeriod.Fixed.period) + " = " + salaries22[SalaryType.First];

    document.getElementById("RemainingAfterFirst26").innerText = salaryLeftAfterFirst(inputSalary, salaries26) + " = " + (inputSalary-salaries26[SalaryType.First]);
    document.getElementById("RemainingAfterFirst22").innerText = salaryLeftAfterFirst(inputSalary, salaries22) + " = " + (inputSalary-salaries22[SalaryType.First]);

    document.getElementById("RecurringPay26").innerText = salaryPayTypeRecurringDisplay(inputSalary, PayPeriod.SummerSum.period) + " = " + salaries26[SalaryType.Recurring];
    document.getElementById("RecurringPay22").innerText = salaryPayTypeRecurringDisplay(inputSalary, PayPeriod.Fixed.period) + " = " + salaries22[SalaryType.Recurring];

    document.getElementById("FinalPay26").innerText = salaryPayTypeFinalDisplay(inputSalary, salaries26) + " = " + salaries26[SalaryType.Last];
    document.getElementById("FinalPay22").innerText = salaryPayTypeFinalDisplay(inputSalary, salaries22) + " = " + salaries22[SalaryType.Last];

}

function listPayDays(salaries) {
    for (var weeksPast = 0; weeksPast < PAY_DAYS; weeksPast++) {
        var currentWeek = new Date(FIRST_PAY_DATE);
        currentWeek.setDate(FIRST_PAY_DATE.getDate() + DAYS_BETWEEN_PAY*weeksPast); 
        var day = currentWeek.getDate();
        var month = currentWeek.getMonth() + 1;
        var year = currentWeek.getFullYear() % 100;

        addSalaryDateToCalendar(`${month}/${day}`, salaries, (weeksPast == 0)? SalaryType.First : (weeksPast == PAY_DAYS-1)? SalaryType.Last : SalaryType.Recurring);
    }
}

function hideOutputs() {
    clearCalendar();
    setBreakdownTablesVisible(false);
}

function clearCalendar() {
    var calendarBar = document.getElementById("Calendar");
    calendarBar.innerHTML = "";
}

function setBreakdownTablesVisible(shouldShow) {
    var breakdownTables = document.getElementById("BreakdownTables");
    breakdownTables.classList.add((shouldShow)? "shown": "hidden");
    breakdownTables.classList.remove((shouldShow)? "hidden": "shown");
}

function addSalaryDateToCalendar(date, salaries, salaryPayType) {
    var calendarBar = document.getElementById("Calendar");
    calendarBar.innerHTML +=    
        `<div class='bubblesBar-item'>
            <span class="dot centered salaryPayType-${salaryPayType}"><br />
                <span class="date">${date}</span><br />
                <span class="paycheck">${salaries[salaryPayType]}</span>
            </span>
        </div>`;
}