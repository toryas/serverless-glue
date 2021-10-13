export default class GlueJob {
    constructor(name, script) {
        this.name = name;
        this.script = script;
    }

    setS3ScriptLocation(s3url) {
        this.s3ScriptLocation = s3url;
    }

    setCommandName(commandName) {
        switch (commandName) {
            case 'spark': this.commandName = 'glueetl'
                break;
            case 'pythonshell': this.commandName = 'pythonshell'
                break;
        }
    }

    setGlueVersion(glueVersion) {
        let parts = glueVersion.split('-')
        let pythonVersion = parts[0].match(new RegExp(`([0-9])`))[0];
        let language = parts[0].match(new RegExp(`([a-z])*`))[0];

        this.pythonVersion = pythonVersion;
        this.glueVersion = parts[1];
        this.language = language;
    }

    setRole(role) {
        this.role = role
    }

    setType(type) {
        this.type = type;
    }

    setMaxConcurrentRuns(maxConcurrentRuns) {
        this.maxConcurrentRuns = maxConcurrentRuns;
    }

    setWorkerType(workerType) {
        this.WorkerType = workerType;
    }

    setNumberOfWorkers(numberOfWorkers) {
        this.NumberOfWorkers = numberOfWorkers
    }

    setTempDir(tmpDir) {
        this.tmpDir = tmpDir;
    }

    setConnections(connections) {
        this.connections = connections;
    }

    setOnlyPropertiesSpark(cfn) {
        if (this.commandName === 'glueetl') {
            if (this.WorkerType) {
                cfn.Properties.WorkerType = this.WorkerType
            }
            if (this.NumberOfWorkers) {
                cfn.Properties.NumberOfWorkers = this.NumberOfWorkers
            }
        }

        return cfn;
    }

    getCFGlueJob() {
        let cfn = {
            Type: "AWS::Glue::Job",
            Properties: {
                Command: {
                    "Name": this.commandName,
                    "PythonVersion": this.pythonVersion,
                    "ScriptLocation": this.s3ScriptLocation
                },
                "Connections": this.connections,
                "GlueVersion": this.glueVersion,
                "Name": this.name,
                "Role": this.role,
                "ExecutionProperty": {
                    "MaxConcurrentRuns": this.maxConcurrentRuns || 1
                },
                "DefaultArguments": {
                    "--job-language": this.language,
                    "--TempDir": this.tmpDir || ""
                },
            }
        };

        cfn = this.setOnlyPropertiesSpark(cfn);

        return cfn;
    }

}
