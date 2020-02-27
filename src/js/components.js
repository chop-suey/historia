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
        let shadowRoot = this.attachShadow({ mode: "open" });

        this.dateInput = this.createInput("date");
        shadowRoot.appendChild(this.dateInput);
        this.timeFromInput = this.createInput("time");
        shadowRoot.appendChild(this.timeFromInput);
        this.timeToInput = this.createInput("time");
        shadowRoot.appendChild(this.timeToInput);

        this.subjectInput = this.createInput("text");
        this.subjectInput.placeholder = "Subject";
        shadowRoot.appendChild(this.subjectInput);

        shadowRoot.appendChild(
            this.createButton("To=NOW", event => timeToInput.value = this.getCurrentTime())
        );

        shadowRoot.appendChild(this.createButton("Apply", event => {
            this.dispatchEvent(new CustomEvent("saveSlot", {
                detail: new Timeslot(
                    this.dateInput.value,
                    this.timeFromInput.value,
                    this.timeToInput.value,
                    this.subjectInput.value
                )
            }));
            this.refreshDefaultValues();
        }));

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

    createInput(type) {
        let input = document.createElement("input");
        input.type = type;
        return input;
    }

    createButton(text, clickListener) {
        let button = document.createElement("button");
        button.innerText = text;
        button.addEventListener("click", clickListener);
        return button;
    }
});

customElements.define("historia-timeslot", class extends HTMLElement {
    constructor() {
        super();
        this.paragraph = document.createElement("p");
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(this.paragraph);
        this.addEventListener("setSlotItem", ({detail}) => this.setSlotItem(detail));
    }

    setSlotItem(item) {
        this.paragraph.innerText = item.toString();
    }
});

customElements.define("historia-timeslots", class extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("addTimeslot", ({ detail }) => this.addTimeslot(detail));
    }

    addTimeslot(slot) {
        let slotElement = document.createElement("historia-timeslot");
        slotElement.dispatchEvent(new CustomEvent("setSlotItem", { detail: slot }));
        this.appendChild(slotElement);
    }
});
