import { DefaultArgumentsInterface } from "./default-arguments.interface";
import { SupportFilesInterface } from "./support-files.interface";

export interface GlueJobInterface {
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
  Description: string;
  role: string;
  MaxConcurrentRuns?: number;
  WorkerType?: "G1.X" | "G2.X";
  NumberOfWorkers?: number;
  Connections?: string[];
  scriptS3Location?: string;
  commandName?: "glueetl" | "pythonshell";
  DefaultArguments: DefaultArgumentsInterface;
  Tags?: Map<string,string>;
  Timeout: number;
  MaxRetries: number;
  SupportFiles: SupportFilesInterface[];
}
