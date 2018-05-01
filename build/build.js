require('./check-versions')();

process.env.NODE_ENV = 'production';

const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const webpackLandingConfig = require('./webpack.landing.conf');

const handler = (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }
  const jsonStats = stats.toJson();

  if (stats.hasErrors()) {
    console.log(chalk.redBright('  Build failed with errors.\n'));
    console.log(chalk.redBright(`${jsonStats.errors}\n`));
    process.exit(1);
  }
  console.log(chalk.cyan('  Build complete.\n'));
  console.log(chalk.yellow(
    '  Tip: built files are meant to be served over an HTTP server.\n' +
    '  Opening index.html over file:// won\'t work.\n'
  ));
};

rm(path.join(config.build.assetsRoot), err => {
  if (err) throw err;
  webpack([webpackConfig, webpackLandingConfig], handler);
});
