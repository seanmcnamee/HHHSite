class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = 
        `
        <style>
            .logo-position {
                display: block;
                margin-left: 20%;
                margin-right: auto;
            }
        </style>
        <header class="grid-split-horizontal largeText" style="background-color: white;">
            <div class="leftHalf">
                <img style="width: 35%" id="logo" class="logo-position" src="pictures/New Half Hollow Hills Logo.png">
            </div>
            <div class="rightHalf middle left">
                <div>Terri McNamee Web Calculations</div>
            </div>
        </header>
        `;
    }
}

customElements.define('header-component', Header);