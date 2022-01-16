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
## How it works

The plugin creates CloufFormation resources of your configuration before making the serverless deploy then add it to the serverless template.

So any glue-job deployed with this plugin is part of your stack too.

## How to configure your GlueJob(s)

Configure your glue jobs in the root of servelress.yml like this:

```yml
Glue:
  bucketDeploy: someBucket # Required
  s3Prefix: some/s3/key/location/ # optional, default = 'glueJobs/'
  tempDirBucket: someBucket # optional, default = '{serverless.serviceName}-{provider.stage}-gluejobstemp'
  tempDirS3Prefix: some/s3/key/location/ # optional, default = ''. The job name will be appended to the prefix name
  jobs:
    - name: super-glue-job # Required
      scriptPath: src/script.py # Required script will be named with the name after '/' and uploaded to s3Prefix location
      Description: # Optional, string
      tempDir: true # Optional true | false
      type: spark # spark / pythonshell # Required
      glueVersion: python3-2.0 # Required python3-1.0 | python3-2.0 | python2-1.0 | python2-0.9 | scala2-1.0 | scala2-0.9 | scala2-2.0
      role: arn:aws:iam::000000000:role/someRole # Required
      MaxConcurrentRuns: 3 # Optional
      WorkerType: Standard # Optional, G1.X | G2.X
      NumberOfWorkers: 1 # Optional
      Connections: # Optional
        - some-conection-string
        - other-conection-string
      Timeout: # Optional, number
      MaxRetries: # Optional, number
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
        customArguments: # Optional; these are user-specified custom default arguments that are passed into cloudformation with a leading -- (required for glue)
          custom_arg_1: custom_value
          custom_arg_2: other_custom_value
      SupportFiles: # Optional
        - local_path: path/to/file/or/folder/ # Required if SupportFiles is given, you can pass a folder path or a file path
          s3_bucket: bucket-name-where-to-upload-files # Required if SupportFiles is given
          s3_prefix: some/s3/key/location/ # Required if SupportFiles is given
          execute_upload: True # Boolean, True to execute upload, False to not upload. Required if SupportFiles is given
      Tags:
        first_tag_example: example1
        second_tag_example: example2
  triggers:
    - name: some-trigger-name # Required
      Description: # Optional, string
      StartOnCreation: True # Optional, True or False
      schedule: 30 12 * * ? * # Optional, CRON expression. The trigger will be created with On-Demand type if the schedule is not provided.
      Tags:
        trigger_type: weekends      
      actions: # Required. One or more jobs to trigger
        - name: super-glue-job # Required
          args: # Optional
            custom_arg_1: custom_value
            custom_arg_2: other_custom_value
          timeout: 30 # Optional, if set, it overwrites specific jobs timeout when job starts via trigger

```

You can define a lot of jobs..

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
|Description|String|Description of the job|False|
|scriptPath|String|script path in the project|true|
|tempDir|Boolean|flag indicate if job required a temp folder, if true plugin create a bucket for tmp|false|
|type|String|Indicate if the type of your job. Values can use are : `spark` or  `pythonshell`|true|
|glueVersion|String|Indicate language and glue version to use ( `[language][version]-[glue version]`) the value can you use are: <ul><li>python3-1.0</li><li>python3-2.0</li><li>python2-1.0</li><li>python2-0.9</li><li>scala2-1.0</li><li>scala2-0.9</li><li>scala2-2.0</li></ul>|true|
|role|String| arn role to execute job|true|
|MaxConcurrentRuns|Double|max concurrent runs of the job|false|
|MaxRetries|Int|Maximum number of retires in case of failure|False|
|Timeout|Int|Job timeout in number of minutes|False|
|WorkerType|String|The type of predefined worker that is allocated when a job runs. Accepts a value of Standard, G.1X, or G.2X.|false|
|NumberOfWorkers|Integer|number of workers|false|
|Connections|List|a list of connections used by the job|false|
|DefaultArguments|object|Special Parameters Used by AWS Glue for mor information see this read the [AWS documentation](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-programming-etl-glue-arguments.html)|false|
|SupportFiles|List|List of supporting files for the glue job that need upload to S3|false|
|Tags|JSON|The tags to use with this job. You may use tags to limit access to the job. For more information about tags in AWS Glue, see AWS Tags in AWS Glue in the developer guide.|false|

### Triggers configuration parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|name|String|name of the trigger|true|
|schedule|String|CRON expression|false|
|actions|Array|An array of jobs to trigger|true|
|Description|String|Description of the Trigger|False|
|StartOnCreation|Boolean|Whether the trigger starts when created. Not supperted for ON_DEMAND triggers|False|

Only On-Demand and Scheduled triggers are supported.

### Trigger job configuration parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|name|String|The name of the Glue job to trigger|true|
|timeout|Integer|Job execution timeout. It overwrites|false|
|args|Map|job arguments|false|
|Tags|JSON|The tags to use with this triggers. For more information about tags in AWS Glue, see AWS Tags in AWS Glue in the developer guide.|false|


## And now?...

Only run `serverless deploy`
---

# Changelog
<a name="changelog"></a>

## [2.4.0] - 2022-01-17
### Fix
- Fix NumberOwfWorkers typo.

### Add
- Added `Tiemout`, `MaxRetires` and `Description` parameters to Glue Job arguments. Added `Description` and `StartOnCreation` parameters to Glue Job Trigger arguments.
- Added `SupportFiles` to Glue Job arguments handling the upload to S3 of relevant-to-the-Glue-Job(s) files


## [2.3.0] - 2021-12-23

### Add
- Implement Custom Arguments for Jobs
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