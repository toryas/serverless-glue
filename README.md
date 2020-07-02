# Serverless Glue

This is a plugin for Serverless framework that provide the posibliti to deploy AWS Glue Jobs

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

Configure yours glue jobs in custom section like this:

```yml
custom:
  Glue:
    bucketDeploy: someBucket # Required 
    jobs:
      - job:
          name: super-glue-job # Required
          script: src/glueJobs/test-job.py # Required
          tempDir: true # Optional true | false
          type: spark # spark / pythonshell # Required
          glueVersion: python3-2.0 # Required python3-1.0 | python3-2.0 | python2-1.0 | python2-0.9 | scala2-1.0 | scala2-0.9 | scala2-2.0 
          role: arn:aws:iam::000000000:role/someRole # Required
          MaxConcurrentRuns: 3 # Optional
          WorkerType: Standard  # Optional  | Standard  | G1.X | G2.X
          NumberOfWorkers: 1 # Optional
```

you can define a lot of jobs..

```yml
custom:
    Glue:
    bucketDeploy: someBucket
    jobs:
        - job:
            ...
        - job:
            ...

```

### Glue configuration parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|bucketDeploy|String|S3 Bucket name|true|
|jobs|Array|Array of glue jobs to deploy|true|

### Jobs configurations parameters

|Parameter|Type|Description|Required|
|-|-|-|-|
|name|String|name of job|true|
|script|String|script path in the project|true|
|tempDir|Boolean|flag indicate if job required a temp folder, if true plugin create a bucket for tmp|false|
|type|String|Indicate if the type of your job. Values can use are : `spark` or  `pythonshell`|true|
|glueVersion|String|Indicate language and glue version to use ( `[language][version]-[glue version]`) the value can you use are: <ul><li>python3-1.0</li><li>python3-2.0</li><li>python2-1.0</li><li>python2-0.9</li><li>scala2-1.0</li><li>scala2-0.9</li><li>scala2-2.0</li></ul>|true|
|role|String| arn role to execute job|true|
|MaxConcurrentRuns|Double|max concurrent runs of the job|false|
|WorkerType|String|worker type, default value if you dont indicate is `Standar`|false|
|NumberOfWorkers|Integer|number of workers|false|


## And now?...

Only run `serverless deploy`