export interface DefaultArgumentsInterface {
  jobLanguage?: string;
  tempDir?: any;
  class?: string;
  scriptLocation?: string;
  extraPyFiles?: string;
  extraJars?: string;
  userJarsFirst?: string;
  usePostgresDriver?: string;
  extraFiles?: string;
  disableProxy?: string;
  jobBookmarkOption?: string;
  enableAutoScaling?: string;
  enableS3ParquetOptimizedCommitter?: string;
  enableRenameAlgorithmV2?: string;
  enableGlueDatacatalog?: string;
  enableMetrics?: string;
  enableContinuousCloudwatchLog?: string;
  enableContinuousLogFilter?: string;
  continuousLogLogGroup?: string;
  continuousLogLogStreamPrefix?: string;
  continuousLogConversionPattern?: string;
  enableSparkUi?: string;
  sparkEventLogsPath?: string;
  customArguments?: Map<string,string>;
}
