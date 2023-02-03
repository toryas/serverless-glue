import { DefaultArgumentsInterface } from "./default-arguments.interface";
import { SupportFilesInterface } from "./support-files.interface";

export interface GlueJobInterface {
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
  MaxCapacity?: number;
  MaxConcurrentRuns?: number;
  WorkerType?: "G.1X" | "G.2X" | "Standard";
  NumberOfWorkers?: number;
  Connections?: string[];
  scriptS3Location?: string;
  commandName?: "glueetl" | "gluestreaming" |"pythonshell";
  DefaultArguments: DefaultArgumentsInterface;
  Tags?: Map<string,string>;
  Timeout: number;
  MaxRetries: number;
  SupportFiles: SupportFilesInterface[];
  SecurityConfiguration?: string;
}
