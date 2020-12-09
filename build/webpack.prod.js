/* eslint-disable @typescript-eslint/no-var-requires */
const baseConfig = require('./webpack.base');
const webpackMerge = require('webpack-merge');

module.exports = webpackMerge.merge(baseConfig, {});
