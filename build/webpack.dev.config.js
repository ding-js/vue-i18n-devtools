const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: './examples/src/index.js',
  output: {
    path: path.resolve(__dirname, '../examples/dist'),
    filename: 'examples.js'
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
      template: './examples/src/index.html',
      minify: true
    })
  ],
  devServer: {
    port: 8080
  }
};
