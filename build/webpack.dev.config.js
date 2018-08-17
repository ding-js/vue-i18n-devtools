const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  entry: {
    devtools: './examples/src/index.js',
    origin: './examples/src/origin'
  },
  output: {
    path: path.resolve(__dirname, '../examples/dist'),
    filename: '[name].js'
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
      minify: true
    })
  ],
  devServer: {
    port: 8080
  }
};
