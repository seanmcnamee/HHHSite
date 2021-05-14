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
                overflow: hidden
                display: inline-block;
                float: left;
                border: none;
                outline: 0
                position: static;
                white-space: normal
            }
            .navBar-item {
                float: left;
                width: auto;
                border: none;
                display: block;
                outline: 0
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
                <a class="navBar-item button" href="index.html">Healthcare Payroll Deduction Calculator</a>
                <a class="navBar-item button" href="teacherpayschedule.html">Teacher Salary Schedule</a>
                <a class="navBar-item button" href="#">To be added!</a>
            </div>
            <div class="nav-right">
                <a class="navBar-item button" href="#">To be added!</a>
            </div>
        </div>
        `;
    }
}

customElements.define('navigation-component', NavBar);