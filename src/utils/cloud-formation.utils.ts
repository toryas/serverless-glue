import { GlueJob } from "../domain/glue-job";
import { GlueTrigger } from "../domain/glue-trigger";
import { GlueTriggerActionInterface } from "../interfaces/glue-trigger-action.interface";

export class CloudFormationUtils {
  static glueJobToCF(glueJob: GlueJob) {
    let cfn: { [k: string]: any } = {
      Type: "AWS::Glue::Job",
      Properties: {
        Command: {
          Name: glueJob.commandName,
          PythonVersion: glueJob.pythonVersion,
          ScriptLocation: glueJob.scriptS3Location,
        },
        Connections: {
          Connections: glueJob.Connections,
        },
        GlueVersion: glueJob.glueVersionJob,
        Name: glueJob.name,
        Role: glueJob.role,
        ExecutionProperty: {
          MaxConcurrentRuns: glueJob.MaxConcurrentRuns ?? 1,
        },
        DefaultArguments: {
          "--job-language": glueJob.language,
          "--TempDir": glueJob.tempDirRef || "",
          ...glueJob.DefaultArguments
        },
      },
    };

    if (glueJob.commandName === "glueetl") {
      if (glueJob.WorkerType) {
        cfn.Properties.WorkerType = glueJob.WorkerType;
      }
      if (glueJob.NumberOfWorkers) {
        cfn.Properties.NumberOfWorkers = glueJob.NumberOfWorkers;
      }
    }

    return cfn;
  }

  static generateBucketTemplate(bucketName: string) {
    return {
      Type: "AWS::S3::Bucket",
      Properties: {
        BucketName: bucketName,
      },
    };
  }

  static glueTriggerToCF(trigger: GlueTrigger) {
    const actions = trigger.actions.map(
      (action: GlueTriggerActionInterface) => {
        return {
          JobName: action.name,
          Arguments: action.args,
          Timeout: action.timeout,
        };
      }
    );
    return {
      Type: "AWS::Glue::Trigger",
      Properties: {
        Type: trigger.type,
        Actions: actions,
        Name: trigger.name,
        ...(trigger.schedule && { Schedule: trigger.schedule }),
      },
    };
  }
}
