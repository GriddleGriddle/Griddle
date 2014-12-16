module.exports = {
  entry: {Griddle: ['./scripts/griddle.jsx'], GriddleWithCallback: './scripts/griddleWithCallback.jsx' },
  output: {
    path: __dirname,
    filename: 'build/[name].js',
    publicPath: '/',
    library: "[name]",
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
    "react": "React",
    "underscore": "_"
  }
};
