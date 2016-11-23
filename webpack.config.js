const path = require('path');
const webpack = require('webpack');

const config = {

  context: __dirname,

  entry: [
    './src/ChromeClient.js',
  ],

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'auth0chrome.js',
    library: 'Auth0Chrome'
  },

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
