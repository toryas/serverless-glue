import { DefaultArgumentsInterface } from "../interfaces/default-arguments.interface";
import { GlueJobInterface } from "../interfaces/glue-job.interface";
import { SupportFilesInterface } from "../interfaces/support-files.interface";

export class GlueJob implements GlueJobInterface {
  name: string;
  id?: string;
  scriptPath: string;
  tempDir?: boolean;
  type: "spark" | "spark_streaming" | "pythonshell";
  glueVersion:
    | "python3.9-1.0"
    | "python3.9-2.0"
    | "python3.9-3.0"
    | "python3-1.0"
    | "python3-2.0"
    | "python3-3.0"
    | "python2-1.0"
    | "python2-0.9"
    | "scala2-1.0"
    | "scala2-0.9"
    | "scala2-2.0"
    | "scala3-3.0";
  Description: string;
  role: string;
  MaxCapacity?:number;
  MaxConcurrentRuns?: number;
  WorkerType?: "G.1X" | "G.2X" | "Standard" | undefined;
  NumberOfWorkers?: number | undefined;
  Connections?: string[] | undefined;
  scriptS3Location?: string;
  commandName?: "glueetl" | "gluestreaming" |"pythonshell";
  pythonVersion?: string;
  glueVersionJob?: string;
  DefaultArguments: DefaultArgumentsInterface;
  Tags?: Map<string,string>;
  Timeout: number;
  MaxRetries: number;
  SupportFiles: SupportFilesInterface[];
  SecurityConfiguration?: string;
  

  constructor(job: GlueJobInterface) {
    this.DefaultArguments = job.DefaultArguments ?? {};
    this.name = job.name;
    this.id = job.id;
    this.scriptPath = job.scriptPath;
    this.role = job.role;
    this.glueVersion = job.glueVersion;
    this.Description = job.Description;
    this.type = job.type;
    this.MaxCapacity = job.MaxCapacity;
    this.MaxConcurrentRuns = job.MaxConcurrentRuns;
    this.MaxRetries = job.MaxRetries;
    this.WorkerType = job.WorkerType;
    this.NumberOfWorkers = job.NumberOfWorkers;
    this.Connections = job.Connections;
    this.defineCommandName(job.type);
    this.setGlueVersion(this.glueVersion);
    this.Tags = job.Tags;
    this.Timeout = job.Timeout;
    this.MaxRetries = job.MaxRetries;
    this.SupportFiles = job.SupportFiles;
    this.SecurityConfiguration = job.SecurityConfiguration;
  }

  setScriptS3Location(s3url: string) {
    this.scriptS3Location = s3url;
  }

  defineCommandName(type: "spark" | "spark_streaming" | "pythonshell") {
    switch (type) {
      case "spark":
        this.commandName = "glueetl";
        break;
      case "spark_streaming":
        this.commandName = "gluestreaming";
        break;
      case "pythonshell":
        this.commandName = "pythonshell";
        break;
    }
  }

  setGlueVersion(
    glueVersion:
      | "python3.9-1.0"
      | "python3.9-2.0"
      | "python3.9-3.0"
      | "python3-1.0"
      | "python3-2.0"
      | "python3-3.0"
      | "python2-1.0"
      | "python2-0.9"
      | "scala2-1.0"
      | "scala2-0.9"
      | "scala2-2.0"
      | "scala3-3.0"
  ) {
    let parts = glueVersion.split("-");
    let pythonVersion = parts[0].replace(/[A-Za-z]*/, '');
    let language = parts[0].match(/[A-Za-z]*/)?.toString();
    this.pythonVersion = pythonVersion;
    this.glueVersionJob = parts[1];
    this.DefaultArguments.jobLanguage = language;
  }
}
