import { GlueTriggerActionInterface } from "./glue-trigger-action.interface"

export interface GlueTriggerInterface {
    name:string;
    schedule?: string;
    actions: GlueTriggerActionInterface[];
    Tags?: Map<string,string>;
}

