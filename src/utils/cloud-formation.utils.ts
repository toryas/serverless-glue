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
        GlueVersion: glueJob.glueVersionJob,
        Name: glueJob.name,
        Description: glueJob.Description,
        Role: glueJob.role,
        ExecutionProperty: {
          MaxConcurrentRuns: glueJob.MaxConcurrentRuns ?? 1,
        },
        DefaultArguments: {
          "--job-language": glueJob.DefaultArguments?.jobLanguage,
          "--TempDir": glueJob.DefaultArguments?.tempDir ?? "",
          "--class": glueJob.DefaultArguments?.class,
          "--scriptLocation": glueJob.DefaultArguments?.scriptLocation,
          "--extra-py-files": glueJob.DefaultArguments?.extraPyFiles,
          "--extra-jars": glueJob.DefaultArguments?.extraJars,
          "--user-jars-first": glueJob.DefaultArguments?.userJarsFirst,
          "--use-postgres-driver": glueJob.DefaultArguments?.usePostgresDriver,
          "--extra-files": glueJob.DefaultArguments?.extraFiles,
          "--disable-proxy": glueJob.DefaultArguments?.disableProxy,
          "--job-bookmark-option": glueJob.DefaultArguments?.jobBookmarkOption,
          "--enable-auto-scaling": glueJob.DefaultArguments?.enableAutoScaling,
          "--enable-s3-parquet-optimized-committer":
            glueJob.DefaultArguments?.enableS3ParquetOptimizedCommitter,
          "--enable-rename-algorithm-v2":
            glueJob.DefaultArguments?.enableRenameAlgorithmV2,
          "--enable-glue-datacatalog":
            glueJob.DefaultArguments?.enableGlueDatacatalog,
          "--enable-metrics": glueJob.DefaultArguments?.enableMetrics,
          "--enable-continuous-cloudwatch-log":
            glueJob.DefaultArguments?.enableContinuousCloudwatchLog,
          "--enable-continuous-log-filter":
            glueJob.DefaultArguments?.enableContinuousLogFilter,
          "--continuous-log-logGroup":
            glueJob.DefaultArguments?.continuousLogLogGroup,
          "--continuous-log-logStreamPrefix":
            glueJob.DefaultArguments?.continuousLogLogStreamPrefix,
          "--continuous-log-conversionPattern":
            glueJob.DefaultArguments?.continuousLogConversionPattern,
          "--enable-spark-ui": glueJob.DefaultArguments?.enableSparkUi,
          "--spark-event-logs-path":
            glueJob.DefaultArguments?.sparkEventLogsPath,
        },
        Tags: glueJob.Tags,
        Timeout: glueJob.Timeout,
        MaxRetries: glueJob.MaxRetries
      },
    };
    if (glueJob.DefaultArguments.customArguments) {
      const customArguments = CloudFormationUtils.parseCustomArguments(glueJob.DefaultArguments.customArguments);
      cfn.Properties.DefaultArguments = {
        ...cfn.Properties.DefaultArguments,
        ...customArguments
      }
    }
    if (glueJob.Connections) {
      cfn.Properties.Connections = {
        Connections: glueJob.Connections,
      };
    }
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

  static parseCustomArguments(customArguments: { [k: string]: any }) {
    const customArgumentsJson: { [k: string]: any } = {};
    const keyArguments = Object.keys(customArguments);
    for (const argumentName of keyArguments) {
      const _argumentName = argumentName.startsWith("--")
        ? argumentName
        : `--${argumentName}`;
      customArgumentsJson[_argumentName] = customArguments[argumentName];
    }
    return customArgumentsJson;
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
        Description: trigger.Description,
        Tags: trigger.Tags,
        StartOnCreation: trigger.StartOnCreation,
        ...(trigger.schedule && { Schedule: trigger.schedule }),
      },
    };
  }
}
