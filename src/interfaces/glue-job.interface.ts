import { DefaultArgumentsInterface } from "./default-arguments.interface";
import { SupportFilesInterface } from "./support-files.interface";
import { GlueVersionType } from "../domain/glue-job";

export interface GlueJobInterface {
  name: string;
  id?: string;
  scriptPath: string;
  tempDir?: boolean;
  type: "spark" | "spark_streaming" | "pythonshell";
  glueVersion: GlueVersionType
  Description: string;
  role: string;
  MaxCapacity?: number;
  MaxConcurrentRuns?: number;
  WorkerType?: "G.1X" | "G.2X" | "Standard";
  NumberOfWorkers?: number;
  Connections?: string[];
  scriptS3Location?: string;
  commandName?: "glueetl" | "gluestreaming" | "pythonshell";
  DefaultArguments: DefaultArgumentsInterface;
  Tags?: Map<string, string>;
  Timeout: number;
  MaxRetries: number;
  SupportFiles: SupportFilesInterface[];
  SecurityConfiguration?: string;
}
