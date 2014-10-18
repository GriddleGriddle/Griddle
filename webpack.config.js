module.exports = {
  entry: './scripts/griddle.jsx',
  output: {
    path: __dirname,
    filename: 'build/griddle.js',
    publicPath: '/',
    library: "Griddle",
    libraryTarget: "umd"
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
    "react/addons": "React",
    "underscore": "_"
  }
};
