import { GlueTriggerActionInterface} from "../interfaces/glue-trigger-action.interface";
import { GlueTriggerInterface } from "../interfaces/glue-trigger.interface";

export class GlueTrigger implements GlueTriggerInterface{
    
    name: string;
    schedule?: string;
    type?:string;
    actions: GlueTriggerActionInterface[];
    Tags?: Map<string,string>;

    constructor(trigger:GlueTriggerInterface){
        this.name = trigger.name;
        this.actions = trigger.actions;
        this.setSchedule(trigger.schedule);
        this.Tags = trigger.Tags;
    }

    setSchedule(cronSchedule:string| undefined) {
        if (cronSchedule) {
            this.type = "SCHEDULED"
            this.schedule = `cron(${cronSchedule})`;
        } else {
            this.type = "ON_DEMAND"
        }
    }
    
}
