const TIMESLOTS_KEY = "app-historia";

export class TimeslotService {
    constructor() {
        this.timeslots = [];
    }

    async getTimeslots() {
        return this.timeslots;
    }

    async saveTimeslots(timeslots) {
        if (Array.isArray(timeslots)) {
            this.timeslots = [ ...timeslots ];
        }
        return this.timeslots;
    }
}