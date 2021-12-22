# Serverless Glue

---
## Update Version 2.X.X

I set out to revive this project by refactoring the code, to keep it clean and easy to understand.

The principal changes [here](#changelog)
---

This is a plugin for Serverless framework that provide the posibliti to deploy AWS Glue Jobs and Triggers

## Install

1. run `npm install --save-dev serverless-glue`
2. add **serverless-glue** in serverless.yml plugin section
    ```yml
    plugins:
        - serverless-glue
    ```
## How work

The plugin create CloufFormation resources of your configuration before make the serverless deploy then add it to the serverless template.

So any glue-job deployed with this plugin is part of your stack too.

## How configure your GlueJobs

Configure yours glue jobs in the root of servelress.yml like this:

```yml
Glue:
  bucketDeploy: someBucket # Required
  s3Prefix: some/s3/key/location/ # optional, default = 'glueJobs/'
  tempDirBucket: someBucket # optional, default = '{serverless.serviceName}-{provider.stage}-gluejobstemp'
  tempDirS3Prefix: some/s3/key/location/ # optional, default = ''. The job name will be appended to the prefix name
  jobs:
    - name: super-glue-job # Required
      scriptPath: src/script.py # Required script will be named with the name after '/' and uploaded to s3Prefix location
      tempDir: true # Optional true | false
      type: spark # spark / pythonshell # Required
      glueVersion: python3-2.0 # Required python3-1.0 | python3-2.0 | python2-1.0 | python2-0.9 | scala2-1.0 | scala2-0.9 | scala2-2.0
      role: arn:aws:iam::000000000:role/someRole # Required
      MaxConcurrentRuns: 3 # Optional
      WorkerType: Standard # Optional  | Standard  | G1.X | G2.X
      NumberOfWorkers: 1 # Optional
      Connections: # Optional
        - some-conection-string
        - other-conection-string
      DefaultArguments: # Optional
        class: string # Optional
        scriptLocation: string # Optional
        extraPyFiles: string # Optional
        extraJars: string # Optional
        userJarsFirst: string # Optional
        usePostgresDriver: string # Optional
        extraFiles: string # Optional
        disableProxy: string # Optional
        jobBookmarkOption: string # Optional
        enableAutoScaling: string # Optional
        enableS3ParquetOptimizedCommitter: string # Optional
        enableRenameAlgorithmV2: string # Optional
        enableGlueDatacatalog: string # Optional
        enableMetrics: string # Optional
        enableContinuousCloudwatchLog: string # Optional
        enableContinuousLogFilter: string # Optional
        continuousLogLogGroup: string # Optional
        continuousLogLogStreamPrefix: string # Optional
        continuousLogConversionPattern: string # Optional
        enableSparkUi: string # Optional
        sparkEventLogsPath: string # Optional
        customDefaultArguments: # Optional; these are user-specified custom default arguments that are passed into cloudformation with a leading -- (required for glue)
          custom_arg_1: custom_value
          custom_arg_2: other_custom_value
  triggers:
    - name: some-trigger-name # Required
      schedule: 30 12 * * ? * # Optional, CRON expression. The trigger will be created with On-Demand type if the schedule is not provided.
      actions: # Required. One or more jobs to trigger
        - name: super-glue-job # Required
          args: # Optional
            arg1: value1
            arg2: value2
          timeout: 30 # Optional

```

you can define a lot of jobs..

```yml
  Glue:
    bucketDeploy: someBucket
    jobs:
      - name: jobA
        scriptPath: scriptA
        ...
      - name: jobB
        scriptPath: scriptB
        ...

```

And a lot of triggers..

```yml
  Glue:
    triggers:
        - name:
            ...
        - name:
            ...

```

### Glue configuration parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|bucketDeploy|String|S3 Bucket name|true|
|createBucket|String|If true, a bucket named as `bucketDeploy` will be created before. Helpful if you have not created the bucket first|false|
|s3Prefix|String|S3 prefix name|false|
|tempDirBucket|String|S3 Bucket name for Glue temporary directory. If dont pass argument the bucket'name will generates with pattern {serverless.serviceName}-{provider.stage}-gluejobstemp|false|
|tempDirS3Prefix|String|S3 prefix name for Glue temporary directory|false|
|jobs|Array|Array of glue jobs to deploy|true|

### Jobs configurations parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|name|String|name of job|true|
|scriptPath|String|script path in the project|true|
|tempDir|Boolean|flag indicate if job required a temp folder, if true plugin create a bucket for tmp|false|
|type|String|Indicate if the type of your job. Values can use are : `spark` or  `pythonshell`|true|
|glueVersion|String|Indicate language and glue version to use ( `[language][version]-[glue version]`) the value can you use are: <ul><li>python3-1.0</li><li>python3-2.0</li><li>python2-1.0</li><li>python2-0.9</li><li>scala2-1.0</li><li>scala2-0.9</li><li>scala2-2.0</li></ul>|true|
|role|String| arn role to execute job|true|
|MaxConcurrentRuns|Double|max concurrent runs of the job|false|
|WorkerType|String|The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.|false|
|NumberOfWorkers|Integer|number of workers|false|
|Connections|List|a list of connections used by the job|false|
|DefaultArguments|object|Special Parameters Used by AWS Glue for mor information see this read the [AWS documentation](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)|false|
|Tags|JSON|The tags to use with this job. You may use tags to limit access to the job. For more information about tags in AWS Glue, see AWS Tags in AWS Glue in the developer guide.|false|

### Triggers configuration parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|name|String|name of the trigger|true|
|schedule|String|CRON expression|false|
|actions|Array|An array of jobs to trigger|true|

Only On-Demand and Scheduled triggers are supported.

### Trigger job configuration parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|name|String|The name of the Glue job to trigger|true|
|timeout|Integer|Job execution timeout|false|
|args|Map|job arguments|false|
|Tags|JSON|The tags to use with this job. You may use tags to limit access to the job. For more information about tags in AWS Glue, see AWS Tags in AWS Glue in the developer guide.|false|


## And now?...

Only run `serverless deploy`
---

# Changelog
<a name="changelog"></a>

## [2.2.0] - 2021-12-22

### Add
- Implement Tags for jobs and triggers
## [2.1.1] - 2021-12-21

### Fixed
- Remove empty conections objecto from CF template when don`t specify any conection
## [2.1.0] - 2021-12-15

### Add
- Implement DefaultArguments for jobs
## [2.0.2] - 2021-12-13

### Fixed
- Replace incorrect async loop in serverless

## [2.0.1] - 2021-12-09

### Changed
- Move typescript dependencie to dev
## [2.0.0] - 2021-11-29
### Changed
- Refactoring code from JS to TS, and restructured folders.
- Plugin`s configuration get out from *custom* level in serverless.yml now are in root of file. 
- Remove redundant level *job* in jobs config.
- **script** attribute are rename to ***scriptPath**
- Remove redundant level *Conections* in **Conections** config.
- Remove redundant level trigger from triggers config.
- Rename **job** attribute to **action** in trigger config.
### Fixed
- Improve documentation for **Conections** config.