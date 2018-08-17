const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    index: './examples/src/index.js',
    origin: './examples/src/origin.js'
  },
  output: {
    path: path.resolve(__dirname, '../examples/dist'),
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js'
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['transform-vue-jsx']
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.html',
      favicon: './examples/favicon.ico',
      minify: true
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'sync',
      async: /^origin\.[0-9a-f]{8}\.js$/
    })
  ],
  devServer: {
    port: 8080
  }
};
