import { GluePluginConfigInterface } from "../interfaces/glue-plugin-config.interce";

export class ServerlessHelper {
  resources: any;
  output: any;
  constructor(private serverless: any) {
    this.resources =
      this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
    this.output =
      this.serverless.service.provider.compiledCloudFormationTemplate.Outputs;
  }

  getPluginConfig(): GluePluginConfigInterface {
    return this.serverless.configSchemaHandler.serverless.configurationInput
      .Glue;
  }

  appendToTemplate(
    node: "resources" | "outputs",
    elementName: string,
    cfElement: any
  ) {
    switch (node) {
      case "resources":
        this.resources[elementName] = cfElement;
        break;
      case "outputs":
        this.output[elementName] = cfElement;
        break;
    }
  }

  log(message: string) {
    this.serverless.cli.log(`[Serverless-Glue]: ${message}`);
  }
}
