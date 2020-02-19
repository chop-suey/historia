import "./components.js";

customElements.define("historia-app", class extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `<h1>Historia</h1>`;
        this.timeslots = document.createElement("historia-timeslots");
        shadowRoot.appendChild(this.timeslots);

        let button = document.createElement("button");
        button.addEventListener("click", event => this.addTimeslot());
        button.innerText = "+";
        shadowRoot.appendChild(button);

        this.addTimeslot();
    }

    addTimeslot() {
        this.timeslots.appendChild(document.createElement("historia-timeslot"));
    }
});