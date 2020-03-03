export class Timeslot {
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