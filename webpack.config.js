var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './src/dev'
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
      { test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
        cacheDirectory: true,
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  externals: [

  ],
};
