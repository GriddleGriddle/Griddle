module.exports = {
  entry: './scripts/griddle.jsx',
  output: {
    path: __dirname,
    filename: 'build/bundle.js',
    publicPath: '/',
    library: "Griddle",
    libraryTarget: "var"
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      {test: /\.jsx$/, loader: 'jsx'},
    ]
  },
  externals: {
    "react/addons": "React"
  }
};
