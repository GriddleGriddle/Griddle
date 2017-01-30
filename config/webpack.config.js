module.exports = {
     devtool: 'source-map',
     entry: './src/module.js',
     output: {
         path: './lib/',
         filename: 'griddle.js',
         library: 'Griddle',
         libraryTarget: 'commonjs2'
     },
     module: {
      loaders: [{
             test: /\.jsx?$/,
             loader: 'babel-loader',
             exclude: /node_modules/,
             query: {
               presets: ['es2015', 'stage-0', 'react']
             }
             
         }]
     }
 };