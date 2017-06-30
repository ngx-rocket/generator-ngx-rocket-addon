'use strict';

const chalk = require('chalk');
const Insight = require('insight');
const camelCase = require('lodash.camelcase');
const upperFirst = require('lodash.upperfirst');
const Generator = require('@ngx-rocket/core');
const asciiLogo = require('@ngx-rocket/ascii-logo');

const options = require('./options.json');
const prompts = require('./prompts');
const pkg = require('../../package.json');

class NgxAddonGenerator extends Generator {

  initializing() {
    this.version = pkg.version;
    this.insight = new Insight({trackingCode: 'UA-93069862-2', pkg});

    this.argument('appName', {
      desc: 'Name of the addon to generate',
      type: String,
      required: false
    });

    this.insight.optOut = !this.options.analytics || process.env.DISABLE_NGX_ANALYTICS;

    if (!this.options['skip-welcome']) {
      this.log(asciiLogo());
    }

    this.insight.track('generator', this.version);
    this.insight.track('node', process.version);
    this.insight.track('platform', process.platform);
  }

  configuring() {
    this.insight.track('generator', this.props.advanced ? 'advanced' : 'simple');
    this.props.className = upperFirst(camelCase(this.props.appName));
  }

  install() {
    const skipInstall = this.options['skip-install'];

    if (!skipInstall) {
      this.log(`\nRunning ${chalk.yellow('npm install')}, please wait...`);
    }

    this.installDependencies({
      skipInstall,
      bower: false,
      skipMessage: true
    });
  }

  end() {
    this.log(`\nAll done! Take a look at ${chalk.green('generators/app')} to get started.\n`);
  }

}

module.exports = Generator.make({
  baseDir: __dirname,
  generator: NgxAddonGenerator,
  options,
  prompts
});
