const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: './src/module.js',
  output: {
    path: path.join(__dirname, '/dist/umd/'),
    filename: 'griddle.js',
    publicPath: '/build/',
    library: 'Griddle',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader?cacheDirectory',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        exclude: ['/node_modules/', '/stories/', '/storybook-static/']
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJsPlugin()
  ],
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ]
};
