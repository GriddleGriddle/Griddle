var webpack = require('webpack')

module.exports = {
  entry: [
    './src/griddle'
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
      { test: /\.jsx?$/,
        loaders: 'babel',
        exclude: /node_modules/,
        cacheDirectory: true,
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
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
