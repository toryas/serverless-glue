export default class GlueTrigger {
    constructor(name, schedule) {
        this.name = name;
        this.setSchedule(schedule);
        this.actions = [];
    }

    setSchedule(cronSchedule) {
        if (cronSchedule) {
            this.type = "SCHEDULED"
            this.schedule = `cron(${cronSchedule})`;
        } else {
            this.type = "ON_DEMAND"
        }
    }

    setActions(actions) {
        this.actions = actions;
    }

    getCFGlueTrigger() {
        const actions = [];
        for (let action of this.actions) {
            actions.push(action.getCFAction());
        }

        return {
            Type: "AWS::Glue::Trigger",
            Properties: {
                "Type": this.type,
                "Actions": actions,
                "Name": this.name,
                ...(this.schedule) && {"Schedule": this.schedule},
            }
        };
    }

}
