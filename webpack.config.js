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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    },
    host: '0.0.0.0',
    //public: 'xmas2021.sefod.eu',
    contentBase: './dist',
    hot: true,
     disableHostCheck: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
};
