//This is updated for the 2020 estimated amounts for NYSHIP. HIP Proposed Amounts
//Easy findings, look for a lot of -----
var Type;
(function (Type) {
    Type[Type["Zero"] = 0] = "Zero";
    Type[Type["One"] = 1] = "One";
    Type[Type["Two"] = 2] = "Two";
    Type[Type["Three"] = 3] = "Three";
})(Type || (Type = {}));
var Years;
(function (Years) {
    Years[Years["FewYears"] = 1] = "FewYears";
    Years[Years["MidYears"] = 3] = "MidYears";
})(Years || (Years = {}));
var Percent;
(function (Percent) {
    Percent[Percent["None"] = 0] = "None";
    Percent[Percent["Low"] = 0.15] = "Low";
    Percent[Percent["Mid"] = 0.2] = "Mid";
    Percent[Percent["High"] = 0.25] = "High";
})(Percent || (Percent = {}));

//--------------------------------Annual Amounts (Used for calculations)-------------------------------------
var Amount;
(function (Amount) {
    Amount[Amount["HipLowIND"] = 925.96] = "HipLowIND";
    Amount[Amount["HipLowFAM"] = 2268.58] = "HipLowFAM";
    Amount[Amount["NyshipIND"] = 1105.00] = "NyshipIND";
    Amount[Amount["NyshipFAM"] = 2550.00] = "NyshipFAM";
    Amount[Amount["HipHighIND"] = 1334.04] = "HipHighIND";
    Amount[Amount["HipHighFAM"] = 3268.41] = "HipHighFAM";
})(Amount || (Amount = {}));
var SalaryContract = /** @class */ (function () {
    function SalaryContract(salaryType) {
        this.levelOneMaxSalary = 60000;
        this.levelTwoMaxSalary = 100000;
        this.type = salaryType;
        if (salaryType === Type.One) {
            this.levelOnePercent = this.levelTwoPercent = this.levelThreePercent = Percent.None;
        }
        else if (salaryType === Type.Three) {
            this.levelOnePercent = this.levelTwoPercent = this.levelThreePercent = Percent.High;
        }
        else {
            this.levelOnePercent = Percent.Low;
            this.levelTwoPercent = Percent.Mid;
            this.levelThreePercent = Percent.High;
        }
        console.log("SalaryType Created. 'Middle Salary' Value: " + this.levelTwoPercent);
    }
    SalaryContract.prototype.getPercent = function (salary, years) {
        if (salary === void 0) { salary = 0; }
        if (years === void 0) { years = 0; }
        var percent1 = 0;
        if (salary < this.levelOneMaxSalary) {
            percent1 = this.levelOnePercent;
        }
        else if (salary < this.levelTwoMaxSalary) {
            percent1 = this.levelTwoPercent;
        }
        else {
            percent1 = this.levelThreePercent;
        }
        var percent2 = percent1;
        if (this.type === Type.Zero) {
            console.log("Dealing with a Transportation Job...");
            if (years <= Years.FewYears) {
                percent2 = this.levelThreePercent;
            }
            else if (years < Years.MidYears) {
                percent2 = this.levelTwoPercent;
            }
            else {
                percent2 = this.levelOnePercent;
            }
        }
        console.log("Percent is : " + Math.max(percent1, percent2));
        return Math.max(percent1, percent2);
    };
    return SalaryContract;
}());
var Job = /** @class */ (function () {
    function Job(type) {
        this.jobSalaries = [Type.Three, Type.Two, Type.Two, Type.Two, Type.Three,
            Type.One, Type.Zero, Type.One, Type.One, Type.Two];
        this.jobDeductions = [24.0, 23.0, 24.0, 24.0, 19.0, 0.0, 19.0, 0.0, 0.0, 24.0];
        this.name = Job.jobs[type];
        this.salary = new SalaryContract(this.jobSalaries[type]);
        console.log("Created a job of type " + this.name);
    }
    Job.jobs = ["Administration", "Teachers", "Clerical/Office Personnel", "Custodial", "Paraprofessional",
        "Food Service", "Transportation", "Monitors", "Security", "Managerial Confidential"];
    return Job;
}());
console.log("Okay");
var jobDiv = document.getElementById("Jobs");
var formDiv = document.getElementById("form");
var salaryDiv = document.getElementById("Salary");
var yearsDiv = document.getElementById("radioButtons");
var job = 0;
var salary;
var years;
for (var num = 0; num < Job.jobs.length; num++) {
    jobDiv.innerHTML += '<option value="' + Job.jobs[num] + '">' + Job.jobs[num] + '</option>';
}
//This shows the possible years worked if you select a transportation job
function itemSelected(selectObject) {
    console.log("clicked: " + selectObject.selectedIndex + "  -  " + selectObject.value);
    job = selectObject.selectedIndex;
    if (selectObject.value === Job.jobs[6]) {
        yearsDiv.classList.add("shown");
    }
    else {
        yearsDiv.classList.remove("shown");
    }
    /*
    if (salaryDiv.value === "") {
        formDiv.removeChild(document.getElementById("Salary"));
    }
    */
}
function yearClicked(year) {
    years = year;
}
function calculate(event) {
    event.preventDefault();
    //Get salary from textbox input
    salary = +salaryDiv.value;
    //Make sure all values are taken in...
    if (job !== undefined && salary !== 0 && job !== 6 || years !== undefined) {
        //Calculate.
        FindValues();
    }
    else {
        alert("One or more of the fields were incorrectly filled out. Please try again.");
    }
}
function FindValues() {
    console.log("FINGIND VALUES!!!");
    var myJob = new Job(job);
    var percent = myJob.salary.getPercent(salary, years);
    document.getElementById("HLI").innerText = (12 * Amount.HipLowIND * percent / myJob.jobDeductions[job] + .005).toFixed(2) + "";
    document.getElementById("HLF").innerText = (12 * Amount.HipLowFAM * percent / myJob.jobDeductions[job] + .005).toFixed(2) + "";
    document.getElementById("NYI").innerText = (12 * Amount.NyshipIND * percent / myJob.jobDeductions[job] + .005).toFixed(2) + "";
    document.getElementById("NYF").innerText = (12 * Amount.NyshipFAM * percent / myJob.jobDeductions[job] + .005).toFixed(2) + "";
    //Figure whatever the alternatives are in here by using an extra attribute from the Job class.
    var hhi = 12 * Amount.HipHighIND * percent / myJob.jobDeductions[job];
    var hhf = 12 * Amount.HipHighFAM * percent / myJob.jobDeductions[job];
    if (job == 1 || job == 2 || job == 3) {
        console.log("Teacher, Office, or Custodian");
        document.getElementById("HHI").innerText = (hhi + 12 * (1 - percent) * (Amount.HipHighIND - Amount.NyshipIND) / myJob.jobDeductions[job] + .005).toFixed(2) + "";
        document.getElementById("HHF").innerText = (hhf + 12 * (1 - percent) * (Amount.HipHighFAM - Amount.NyshipFAM) / myJob.jobDeductions[job] + .005).toFixed(2) + "";
    }
    else {
        console.log("Regular HIP-High Calculation");
        document.getElementById("HHI").innerText = (hhi + .005).toFixed(2) + "";
        document.getElementById("HHF").innerText = (hhf + .005).toFixed(2) + "";
    }

    //Right here is what makes the answer shown on the screen. If you want another thing shown, start if off as hidden, then add it here!
    document.getElementById("title").classList.add("shown");
    document.getElementById("answer").classList.add("shown");
}
//formDiv.innerHTML += '<option value="test2">Nice</option>';
//# sourceMappingURL=index.js.map