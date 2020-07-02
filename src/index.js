'use strict';

const { default: GlueHelper } = require("./helper/glue.helper");

class GluePlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.hooks = {
      'aws:package:finalize:mergeCustomProviderResources': this.deploy.bind(this)
    };
  }

  async deploy() {
    let glueH = new GlueHelper(this.serverless);
    await glueH.run();
  }

}

module.exports = GluePlugin;
