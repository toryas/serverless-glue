import { GlueTriggerActionInterface} from "../interfaces/glue-trigger-action.interface";
import { GlueTriggerInterface } from "../interfaces/glue-trigger.interface";

export class GlueTrigger implements GlueTriggerInterface{
    
    name: string;
    schedule?: string;
    type?:string;
    actions: GlueTriggerActionInterface[];
    Description: string;
    Tags?: Map<string,string>;
    StartOnCreation: boolean;

    constructor(trigger:GlueTriggerInterface){
        this.name = trigger.name;
        this.actions = trigger.actions;
        this.Description = trigger.Description
        this.setSchedule(trigger.schedule);
        this.Tags = trigger.Tags;
        this.StartOnCreation = trigger.StartOnCreation;
    }

    setSchedule(cronSchedule:string|undefined) {
        if (cronSchedule) {
            this.type = "SCHEDULED"
            this.schedule = `cron(${cronSchedule})`;
        } else {
            this.type = "ON_DEMAND"
        }
    }
    
}
