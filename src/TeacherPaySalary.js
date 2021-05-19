const FIRST_PAY_DATE = new Date('2020-09-04T00:00:00');
const DAYS_IN_FIRST_PAY = 3.0;
const PAY_DAYS = 22.0;
const DAYS_BETWEEN_PAY = 14;
const BUSINESS_DAYS_BETWEEN_PAY = 10.0;

const PayPeriodOptions = [
    {period: 26.0, type: "Summer" },
    {period: 22.0, type: "Even"}

];

var testSalary = 100000;


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


    salaries = [salaryPayTypeFirst(inputSalary, payPeriodOption), salaryPayTypeRecurring(inputSalary, payPeriodOption), salaryPayTypeFinal(inputSalary, payPeriodOption)];
    listPayDays(salaries);
}

console.log()

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

function listPayDays(salaries) {
    for (var weeksPast = 0; weeksPast < PAY_DAYS; weeksPast++) {
        var currentWeek = new Date(FIRST_PAY_DATE);
        currentWeek.setDate(FIRST_PAY_DATE.getDate() + DAYS_BETWEEN_PAY*weeksPast); 
        var day = currentWeek.getDate();
        var month = currentWeek.getMonth() + 1;
        var year = currentWeek.getFullYear() % 100;

        addSalaryDateToCalendar(`${month}/${day}`, salaries, (weeksPast == 0)? 1 : (weeksPast == PAY_DAYS-1)? 3: 2);
    }
}

function clearCalendar() {
    var calendarBar = document.getElementById("Calendar");
    calendarBar.innerHTML = "";
}

function addSalaryDateToCalendar(date, salaries, salaryPayType) {
    var calendarBar = document.getElementById("Calendar");
    calendarBar.innerHTML +=    
        `<div class='bubblesBar-item'>
            <span class="dot centered salaryPayType-${salaryPayType}"><br />
                <span class="date">${date}</span><br />
                <span class="paycheck">${salaries[salaryPayType-1]}</span>
            </span>
        </div>`;
}