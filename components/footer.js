class Footer extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = 
        `
        <style>
            footer {
                display: block
            }
        </style>
        
        <div class="darker-background">
        Thank you!
        </div>
        `;
    }
}

customElements.define('footer-component', Footer);