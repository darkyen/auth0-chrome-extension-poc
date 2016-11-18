const path = require('path');
const webpack = require('webpack');

const config = {

  context: __dirname,

  entry: [
    './src/AuthService.js',
    './src/Auth0Chrome.js',
  ],

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'auth0chrome.js'
  },

  module: {
    loaders: [
      { test: require.resolve("./src/Auth0Chrome"), loader: "expose-loader?Auth0Chrome" },
      { test: require.resolve("./src/AuthService"), loader: "expose-loader?AuthService" },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
    ]
  }
}

module.exports = config;