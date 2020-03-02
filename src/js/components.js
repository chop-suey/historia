class Timeslot {
    constructor (date, timeFrom, timeTo, subject) {
        this.date = date;
        this.timeFrom = timeFrom;
        this.timeTo = timeTo;
        this.subject = subject;
    }

    getDecimalDuration() {
        let minutesFrom = this.toMinutes(this.timeFrom);
        let minutesTo = this.toMinutes(this.timeTo);
        return (minutesTo - minutesFrom) / 60;
    }

    toMinutes(time) {
        let parts = time.split(":");
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    toString() {
        return `Date: ${this.date} From: ${this.timeFrom} To: ${this.timeTo} Subject: ${this.subject} Duration: ${this.getDecimalDuration()}`
    }
}

customElements.define("historia-timeslot-input", class extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 0.5em;
                }

                :host([hidden]) { display: none; }

                input, button {
                    padding: 0.5em;

                    font-family: sans-serif;
                    font-size: 1em;

                    border: 1px solid lightgrey;
                    border-radius: 0.5em;
                }
            </style>

            <input id="date" type="date" />
            <input id="timeFrom" type="time" />
            <input id="timeTo" type="time" />
            <button id="nowButton">To=NOW</button>
            <input id="subject" type="text" placeholder="Subject" />
            <button id="emitButton"><slot></slot></button>
        `;
        this.dateInput = this.shadowRoot.querySelector("#date");
        this.timeFromInput = this.shadowRoot.querySelector("#timeFrom");
        this.timeToInput = this.shadowRoot.querySelector("#timeTo");

        this.subjectInput = this.shadowRoot.querySelector("#subject");

        this.shadowRoot.querySelector("#nowButton")
            .addEventListener("click", event => this.timeToInput.value = this.getCurrentTime());

        this.shadowRoot.querySelector("#emitButton")
            .addEventListener("click", event => {
                this.dispatchEvent(new CustomEvent("saveSlot", {
                    detail: new Timeslot(
                        this.dateInput.value,
                        this.timeFromInput.value,
                        this.timeToInput.value,
                        this.subjectInput.value
                    )
                }));
                this.refreshDefaultValues();
            });
        this.refreshDefaultValues();
    }

    refreshDefaultValues() {
        this.dateInput.value = this.getCurrentDate();
        let currentTime = this.getCurrentTime();
        this.timeFromInput.value = currentTime;
        this.timeToInput.value = currentTime;
        this.subjectInput.value = "";
    }

    getCurrentDate() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1;
        let day = now.getDate();
        return `${year}-${this.padTwoDigits(month)}-${this.padTwoDigits(day)}`;
    }

    getCurrentTime() {
        let now = new Date();
        let hour = now.getHours();
        let minute = now.getMinutes();
        return `${this.padTwoDigits(hour)}:${this.padTwoDigits(minute)}`;
    }

    padTwoDigits(value) {
        if (isFinite(value)) {
            let number = Math.round(value);
            return number < 10 ? `0${number}` : number;
        } else {
            return "00";
        }
    }
});

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
    }

    addTimeslot(slot) {
        let slotElement = document.createElement("historia-timeslot");
        slotElement.setSlotItem(slot);
        this.appendChild(slotElement);
    }
});
