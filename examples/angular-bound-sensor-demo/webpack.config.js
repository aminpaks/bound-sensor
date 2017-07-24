const path = require('path');
const merge = require('webpack-merge');

function webpackConfigs({ production = false } = {}) {

  const commonConfig = require('./webpack/webpack-common.config.js');
  const envConfig = production
    ? require('./webpack/webpack-prod.config.js')
    : require('./webpack/webpack-dev.config.js');

  const result = merge.smart(commonConfig, envConfig);

  return result;
};

module.exports = webpackConfigs;
