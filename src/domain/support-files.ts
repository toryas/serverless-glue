import { SupportFilesInterface } from "../interfaces/support-files.interface";

export class SupportFile implements SupportFilesInterface{

    local_path: string;
    s3_bucket: string;
    s3_prefix: string;
    execute_upload: boolean;

    constructor(SupportFiles:SupportFilesInterface){
        this.local_path = SupportFiles.local_path;
        this.s3_bucket = SupportFiles.s3_bucket;
        this.s3_prefix = SupportFiles.s3_prefix;
        this.execute_upload = SupportFiles.execute_upload;
    }    
    
}