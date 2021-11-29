export interface GlueTriggerActionInterface {
    name:string;
    args?: {[k:string]:string};
    timeout?: number;
    
}