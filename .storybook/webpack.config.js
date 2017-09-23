const failPlugin = require('webpack-fail-plugin');
const path = require("path");
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
    filename: include + '/dist/examples/storybook.js'
  },
  plugins: [
    failPlugin
  ],
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    loaders: [
      { test: /\.tsx?$/,
        loader: 'babel-loader!ts-loader',
        exclude: /node_modules/,
        cacheDirectory: true,
        include,
      }
    ],
  },
  ts: {
    compilerOptions: {
      noEmit: false,
    },
  },
};
