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
        Contact benefits@hhh.k12.ny.us for more information
        </div>
        `;
    }
}

customElements.define('footer-component', Footer);
