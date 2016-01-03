var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './index'
  ],
  output: {
    path: __dirname + '/build/',
    filename: 'griddle.js',
    publicPath: '/build/',
    library: 'Griddle',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      "react": __dirname + '/node_modules/react',
      "react/addons": __dirname + '/node_modules/react/addons'
    }
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
