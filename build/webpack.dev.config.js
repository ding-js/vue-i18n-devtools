const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './examples/index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'examples.js'
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.html',
      minify: true
    })
  ],
  devServer: {
    port: 8080
  }
};
