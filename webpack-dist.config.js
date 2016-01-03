var webpack = require('webpack')

module.exports = {
  entry: [
    './index'
  ],
  output: {
    path: __dirname + '/build/',
    filename: 'griddle.js',
    publicPath: '/build/',
    library: 'Griddle',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/, loaders: ['babel?{"plugins":["babel-plugin-object-assign"]}'], exclude: /node_modules/ }
    ]
  },
  externals: [
    {
      react: {
        root: 'React',
        commonjs2: 'react',
        commonjs: 'react',
        amd: 'react'
      }
    }
  ],
};
