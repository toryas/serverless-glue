import { DefaultArgumentsInterface } from "../interfaces/default-arguments.interface";

export class DefaultArguments implements DefaultArgumentsInterface {
  jobLanguage?: string | undefined;
  class?: string | undefined;
  scriptLocation?: string | undefined;
  extraPyFiles?: string | undefined;
  extraJars?: string | undefined;
  userJarsFirst?: string | undefined;
  usePostgresDriver?: string | undefined;
  extraFiles?: string | undefined;
  disableProxy?: string | undefined;
  jobBookmarkOption?: string | undefined;
  enableAutoScaling?: string | undefined;
  enableS3ParquetOptimizedCommitter?: string | undefined;
  enableRenameAlgorithmV2?: string | undefined;
  enableGlueDatacatalog?: string | undefined;
  enableMetrics?: string | undefined;
  enableContinuousCloudwatchLog?: string | undefined;
  enableContinuousLogFilter?: string | undefined;
  continuousLogLogGroup?: string | undefined;
  continuousLogLogStreamPrefix?: string | undefined;
  continuousLogConversionPattern?: string | undefined;
  enableSparkUi?: string | undefined;
  sparkEventLogsPath?: string | undefined;
  tempDir?: any;
  customArguments?: Map<string, string> | undefined;
}
