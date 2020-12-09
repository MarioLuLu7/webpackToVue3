/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ProgressPlugin = require('progress-bar-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
const isProduction = process.env.NODE_ENV === 'production';
const inlineLimit = 4096;

module.exports = {
  mode: isProduction ? 'production' : 'development',
  target: 'web',
  context: path.resolve(__dirname, '../'),
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'js/[name].js',
    publicPath: isProduction ? './' : '/',
  },
  stats: { children: false },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.vue', '.json', '.scss'],
    alias: {
      '@': resolve('src'),
    },
    modules: ['node_modules', resolve('node_modules')],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ['vue-loader'],
      },
      {
        test: /\.tsx$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              appendTsxSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.sass$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: inlineLimit,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[hash:8].[ext]',
            },
          },
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/i,
        loader: 'url-loader',
        options: {
          limit: inlineLimit,
          fallback: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]',
            },
          },
        },
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(), //vue-loader伴生插件
    new CleanWebpackPlugin(), //清除。.dist文件夹
    new ProgressPlugin(), //显示打包进度
    //自动注入打包后的.js文件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('/public/index.html'),
    }),
    // //直接拷贝静态文件至输出文件夹
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          to: './public',
          toType: 'dir',
        },
      ],
    }),
    // 异步检查ts代码
    new ForkTsCheckerWebpackPlugin({
      formatter: 'codeframe',
      async: true,
      typescript: {
        extensions: {
          vue: {
            enabled: true,
            compiler: '@vue/compiler-sfc',
          },
        },
      },
    }),
  ],
};
