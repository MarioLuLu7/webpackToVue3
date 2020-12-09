/* eslint-disable @typescript-eslint/no-var-requires */
const { HotModuleReplacementPlugin, DefinePlugin } = require('webpack');
const baseConfig = require('./webpack.base');
const webpackMerge = require('webpack-merge');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');

const devConfig = {
  host: 'localhost',
  port: 8080,
};

module.exports = webpackMerge.merge(baseConfig, {
  devtool: 'cheap-module-eval-source-map', // 使用sourceMap
  devServer: {
    contentBase: false, // 由于使用了CopyWebpackPlugin.
    historyApiFallback: true, // 路由为history模式时需开始
    hot: true, //  开启代码热更新
    inline: true,
    host: devConfig.host, // 如果需要局域网内访问，可设置为0.0.0.0
    port: devConfig.port,
    open: false, // 编译后自动打开浏览器
    quiet: true, // 如果使用webpack-dev-server，需要设为true，禁止显示devServer的console信息
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"', // 定义为开发模式
      },
      BASE_URL: '"./"', // 定义站点根路径,当部署路径不为/时，可在此设置，如/app1/
    }),
    // 代码热更新插件
    new HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`running: http://${devConfig.host}:${devConfig.port}`],
      },
      onErrors: function(severity, errors) {
        // 可以收听插件转换和优先级的错误
        // 严重性可以是'错误'或'警告'
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: 'Webpack error',
          message: severity + ': ' + error.name,
          subtitle: error.file || '',
        });
      },
      clearConsole: true,
    }),
  ],
});
