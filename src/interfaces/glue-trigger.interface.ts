import { GlueTriggerActionInterface } from "./glue-trigger-action.interface"

export interface GlueTriggerInterface {
    name: string;
    schedule?: string;
    actions: GlueTriggerActionInterface[];
    Description: string;
    Tags?: Map<string,string>;
    StartOnCreation: boolean;
}

