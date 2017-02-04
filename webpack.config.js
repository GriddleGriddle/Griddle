var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: './src/module.js',
  output: {
    path: __dirname + '/lib/',
    filename: 'griddle.js',
    publicPath: '/build/',
    library: 'Griddle',
    libraryTarget: 'commonjs2'
  },
  module: {
    loaders: [
      { test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: [
          '/node_modules/',
          '/stories/',
          '/storybook-static/',
        ],
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
