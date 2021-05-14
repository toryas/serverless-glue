export default class GlueTriggerAction {

    constructor(name) {
        this.name = name;
    }

    setArguments(args) {
        this.args = args;
    }

    setTimeout(timeout) {
        this.timeout = timeout;
    }

    getCFAction() {
        return {
            "JobName": this.name,
            "Arguments": this.args,
            "Timeout": this.timeout
        };
    }
}
