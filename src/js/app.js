import "./timeslot-input.js";
import "./timeslot-views.js";

import { TimeslotService } from "./timeslot-service.js";

customElements.define("historia-app", class extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `
            <h1>Historia</h1>
            <historia-timeslot-input>Save</historia-timeslot-input>
            <historia-timeslots></historia-timeslots>
        `;
        let input = shadowRoot.querySelector("historia-timeslot-input");
        let timeslots = shadowRoot.querySelector("historia-timeslots");

        timeslots.setTimeslotService(new TimeslotService());

        input.addEventListener("saveSlot", async ({ detail }) => {
            timeslots.addTimeslot(detail);
        });
    }
});