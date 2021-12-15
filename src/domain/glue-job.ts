import { DefaultArgumentsInterface } from "../interfaces/default-arguments.interface";
import { GlueJobInterface } from "../interfaces/glue-job.interface";

export class GlueJob implements GlueJobInterface {
  name: string;
  scriptPath: string;
  tempDir?: boolean;
  type: "spark" | "pythonshell";
  glueVersion:
    | "python3-1.0"
    | "python3-2.0"
    | "python2-1.0"
    | "python2-0.9"
    | "scala2-1.0"
    | "scala2-0.9"
    | "scala2-2.0";
  role: string;
  MaxConcurrentRuns?: number;
  WorkerType?: "Standard" | "G1.X" | "G2.X" | undefined;
  NumberOfWorkers?: number | undefined;
  Connections?: string[] | undefined;
  scriptS3Location?: string;
  commandName?: "glueetl" | "pythonshell";
  pythonVersion?: string;
  glueVersionJob?: string;
  DefaultArguments: DefaultArgumentsInterface;

  constructor(job: GlueJobInterface) {
    this.DefaultArguments = job.DefaultArguments ?? {}
    this.name = job.name;
    this.scriptPath = job.scriptPath;
    this.role = job.role;
    this.glueVersion = job.glueVersion;
    this.type = job.type;
    this.MaxConcurrentRuns = job.MaxConcurrentRuns;
    this.WorkerType = job.WorkerType;
    this.NumberOfWorkers = job.NumberOfWorkers;
    this.Connections = job.Connections;
    this.defineCommandName(job.type);
    this.setGlueVersion(this.glueVersion);
  }

  setScriptS3Location(s3url: string) {
    this.scriptS3Location = s3url;
  }

  defineCommandName(type: "spark" | "pythonshell") {
    switch (type) {
      case "spark":
        this.commandName = "glueetl";
        break;
      case "pythonshell":
        this.commandName = "pythonshell";
        break;
    }
  }

  setGlueVersion(
    glueVersion:
      | "python3-1.0"
      | "python3-2.0"
      | "python2-1.0"
      | "python2-0.9"
      | "scala2-1.0"
      | "scala2-0.9"
      | "scala2-2.0"
  ) {
    let parts = glueVersion.split("-");
    let pythonVersion = parts[0].match(/\d/)?.toString();
    let language = parts[0].match(/[A-Za-z]*/)?.toString();
    this.pythonVersion = pythonVersion;
    this.glueVersionJob = parts[1];
    this.DefaultArguments.jobLanguage = language;
  }
}
