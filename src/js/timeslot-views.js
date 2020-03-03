import { Timeslot } from "./model.js";

customElements.define("historia-timeslot", class extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
            :host {
                margin-top: 0.5em;
                padding: 0.5em;
                background: lightgrey;
                border: 1px solid grey;
                border-radius: 0.5em;
            }

            :host([hidden]) { display: none; }

            :host, #times {
                display: flex;
                justify-content: space-between;
            }

            #container, #times {
                display: flex;
                justify-content: space-between;
            }
            #date {
                flex-grow: 1;
            }

            #details {
                flex-grow: 2;
            }

            </style>
            <div id="date"></div>
            <div id="details">
                <div id="times">
                    <div id="from"></div>
                    <div id="to"></div>
                    <div id="duration"></div>
                </div>
            </div>                
        `;
    }

    setSlotItem(item) {
        if (item instanceof Timeslot) {
            let { date, timeFrom, timeTo, subject } = item;
            let duration = item.getDecimalDuration();
            this.shadowRoot.querySelector("#date").innerText = date;
            this.shadowRoot.querySelector("#from").innerText = timeFrom;
            this.shadowRoot.querySelector("#to").innerText = timeTo;
            let durationText = duration.toLocaleString(
                undefined,
                { minimumFractionDigits: 2, maximumFractionDigits: 2 }
            );
            this.shadowRoot.querySelector("#duration").innerHTML = `${durationText} h`;
            if (subject) {
                let subjectDiv = document.createElement("div");
                subjectDiv.innerText = subject;
                this.shadowRoot.querySelector("#details").appendChild(subjectDiv);
            }
        }
    }
});

customElements.define("historia-timeslots", class extends HTMLElement {
    constructor() {
        super();
        this.timeslots = [];
        this.attachShadow({ mode: "open" });
    }

    setTimeslotService(timeslotService) {
        this.timeslotService = timeslotService;
    }

    async addTimeslot(slot) {
        let timeslotsOld = await this.getTimeslots();
        await this.setTimeslots([ ...timeslotsOld, slot ]);
        this.updateView();
    }

    async updateView() {
        this.shadowRoot.innerHTML = "";
        this.timeslots.forEach(slot => {
            let node = document.createElement("historia-timeslot");
            node.setSlotItem(slot);
            this.shadowRoot.appendChild(node);
        });
    }

    async getTimeslots() {
        if (this.timeslotService) {
            this.timeslots = await this.timeslotService.getTimeslots();
        }
        return this.timeslots;
    }

    async setTimeslots(timeslots) {
        this.timeslots = this.timeslotService
            ? await this.timeslotService.saveTimeslots(timeslots)
            : timeslots;
    }
});
