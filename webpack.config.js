const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const resolve = (dir) => path.join(__dirname, '.', dir);

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    'jarvis-js-sdk': './src/client.js',
  },
  output: {
    path: resolve('dist'), // 输出目录
    filename: '[name].js', // 输出文件
    libraryTarget: 'umd', // 采用通用模块定义
    library: 'jarvis-js-sdk', // 库名称
    libraryExport: 'default',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: isProd
    ? []
    : [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  optimization: isProd
    ? { minimizer: [new TerserPlugin()] }
    : {},
};
