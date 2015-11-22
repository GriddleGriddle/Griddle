'use strict';

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      './node_modules/phantomjs-polyfill/bind-polyfill.js',
      './scripts/__tests__/**/*.js'
    ],
    exclude: [
      'node_modules/**.*.js'
    ],
    preprocessors: {
      './js/**/*.js': ['webpack'],
      './scripts/__tests__/**/*.js': ['webpack']
    },

    webpack: {
      resolve: {
        extensions: ['', '.js', '.jsx']
      },
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          }
        ]
      },
      plugins: [
      ]
    },

    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Chrome'],
    singleRun: false,

    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-babel-preprocessor',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher'
    ]
  });
};
