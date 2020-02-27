import "./components.js";

customElements.define("historia-app", class extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `<h1>Historia</h1>`;

        let timeslots = document.createElement("historia-timeslots");
        
        let timeslotInput = document.createElement("historia-timeslot-input");
        shadowRoot.appendChild(timeslotInput);
        timeslotInput.addEventListener("saveSlot", ({ detail }) => {
            console.log("new slot: ", detail);
            timeslots.dispatchEvent(new CustomEvent("addTimeslot", { detail: detail }));
        });
        
        shadowRoot.appendChild(timeslots);
    }
});