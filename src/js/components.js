customElements.define("historia-timeslots", class extends HTMLElement {
    constructor() {
        super();
    }
});

customElements.define("historia-timeslot", class extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `<style>
        :host {
            display: block;
        }
        </style>`;
        this.initialiseInputs(shadowRoot);
    }

    initialiseInputs(shadowRoot) {
        this.dateInput = this.createHistoriaCustomInput("date");
        shadowRoot.appendChild(this.dateInput);
        this.fromInput = this.createHistoriaCustomInput("time");
        shadowRoot.appendChild(this.fromInput);
        this.toInput = this.createHistoriaCustomInput("time");
        shadowRoot.appendChild(this.toInput);
    }

    createHistoriaCustomInput(type) {
        let input = document.createElement("historia-moment-input");
        input.type = type;
        return input;
    }
});

customElements.define("historia-moment-input", class extends HTMLElement {
    constructor() {
        super();
        let shadowRoot = this.attachShadow({ mode: "open" });
        this.input = this.createInput();
        shadowRoot.appendChild(this.input);
        this.nowButton = this.createNowButton();
        shadowRoot.appendChild(this.nowButton);
        this.setNowValueProvider();
    }

    set type(type) {
        if (type) {
            this.setAttribute("type", type);
        } else {
            this.removeAttribute("type");
        }
        this.setNowValueProvider(type);
        this.input.setAttribute("type", type);
        this.input.value = this.getNowValue();
    }

    get value() {
        return this.input.value;
    }

    createInput() {
        let input = document.createElement("input");
        return input;
    }

    createNowButton() {
        let button = document.createElement("button");
        button.innerText = "NOW";
        button.addEventListener("click", event => this.input.value = this.getNowValue());
        return button;
    }

    setNowValueProvider(type) {
        if (type === "time") {
            this.getNowValue = this.getTimeNowValueProvider();
        } else if (type === "date") {
            this.getNowValue = this.getDateNowValueProvider();
        } else {
            this.getNowValue = () => "";
        }
    }

    getTimeNowValueProvider() {
        return () => {
            let now = new Date();
            let hour = now.getHours();
            let minute = now.getMinutes();
            return `${this.padTwoDigits(hour)}:${this.padTwoDigits(minute)}`;
        }
    }

    getDateNowValueProvider() {
        return () => {
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth() + 1;
            let day = now.getDate();
            return `${year}-${this.padTwoDigits(month)}-${this.padTwoDigits(day)}`;
        }
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