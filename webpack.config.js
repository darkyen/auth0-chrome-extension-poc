const path = require('path');
const webpack = require('webpack');

const config = {

  context: __dirname,

  entry: {
    'auth0chrome.min': './index.js',
    'auth0chrome': './index.js'
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    library: 'Auth0Chrome',
    libraryTarget: 'umd',
    filename: '[name].js'
  },

  devtool: 'source-map',

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: true,
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  }
}

module.exports = config;
