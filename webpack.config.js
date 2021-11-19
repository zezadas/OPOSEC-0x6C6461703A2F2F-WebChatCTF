const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: "./client/src/index.js",
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist',
    hot: true,
     disableHostCheck: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
};
