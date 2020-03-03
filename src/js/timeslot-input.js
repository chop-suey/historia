import { Timeslot } from "./model.js";

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