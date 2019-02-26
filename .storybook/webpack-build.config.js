const path = require('path');
const include = path.resolve(__dirname, '../');

// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add addional webpack configurations.
// For more information refer the docs: https://goo.gl/qPbSyX

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

module.exports = {
  devtool: 'source-map',
  entry: './stories/index.tsx',
  output: {
    path: path.join(__dirname, '/dist/examples/'),
    filename: 'storybook.js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'awesome-typescript-loader'
          },
          {
            loader: 'react-docgen-typescript-loader'
          }
        ],
        exclude: ['/node_modules/']
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ],
        exclude: ['/node_modules/']
      }
    ]
  }
};
