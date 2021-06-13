class NavBar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = 
        `
        <style>
            .navBar {
                width: 100%;
                overflow: hidden;
                display: inline-block;
                border: none;
                outline: 0;
                position: static;
                white-space: normal
            }
            .navBar-item {
                float: left;
                width: auto;
                border: none;
                display: block;
                outline: 0;
                padding: 8px 16px;
                text-align: left;
                white-space: normal;
            }
            .nav-left {
                float: left;
            }
            .nav-right {
                float: right;
            }
        </style>
        <div class="navBar darker-background">
            <div class="nav-left">
                <a class="navBar-item button" href="HealthcareRates.html">Healthcare Payroll Deduction Calculator</a>
                <a class="navBar-item button" href="TeacherPaySchedule.html">Teacher Pay Schedule</a>
                <a class="navBar-item button" href="https://search.yahoo.com/search?p=How+to+do+a+google+search&fr=yfp-t&ei=UTF-8&fp=1">Have extra questions?</a>
            </div>
            <div class="nav-right">
                <a class="navBar-item button" href="#">To be added!</a>
            </div>
        </div>
        `;
    }
}

customElements.define('navigation-component', NavBar);