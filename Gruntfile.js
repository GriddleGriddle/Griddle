// jshint ignore: start

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: '*',
          livereload: true
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.server.options.port %>/docs/html/'
      }
    },
    jshint: {
      all: {
        src: ['Gruntfile.js', 'scripts/**/*.jsx', 'scripts/**/*.js'],
        options: {
          jshintrc: '.jshintrc'
        }
      }
    },
    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'docs/dist/**/*.md',
            dest: 'docs/html/',
            flatten: true,
            ext: '.html'
          }
        ],
        options: {
          template: 'docs/src/template/template.jst',
          preCompile: function(src, context) {},
          postCompile: function(src, context) {},
          templateContext: {},
          markdownOptions: {
            gfm: true,
            highlight: 'manual',
            codeLines: {
              before: '<span>',
              after: '</span>'
            }
          }
        }
      }
    },
    includereplace: {
      docs: {
        options: {
          includesDir: "examples/"
          // Task-specific options go here.
        },
        // Files to perform replacements and includes with
        src: 'docs/src/**/*.md',
        // Destination directory to copy files to
        dest: 'docs/dist/',
      }
    },
    clean: {
      docs: [ "docs/html"],
      includes: [ "docs/dist"],
      compiled: ["compiled"]
    },
    copy: {
      docs: {
        files: [
          { expand: true, cwd: 'docs/assets/', src: ['**'], dest: 'docs/html/', flatten: false},
          { expand: true, src: ['examples/assets/scripts/testComponent.js', 'examples/assets/scripts/fakeData.js', 'examples/assets/scripts/swapi.min.js', 'examples/assets/scripts/freezeframe.min.js', 'examples/assets/scripts/GriddleWithCallback.js'], dest: 'docs/html/scripts', flatten: true}
        ]
      },
      modules: {
        files: [
          {expand: true, src: ['compiled/columnProperties.js', 'compiled/rowProperties.js', 'compiled/deep.js'], dest: 'modules', flatten: true}
        ]
      }
    },
    webpack: {
      default: {
        entry: {
          Griddle: ['./compiled/griddle.jsx'],
        },
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
            {test: /\.jsx$/, loader: 'babel'}
          ]
        },
        externals: {
          "react": "React",
          "underscore": "_",

        }
      },
      docs: {
        entry: {
            Griddle: ['./compiled/griddle.jsx'],
            ChartistGraph: ['./node_modules/react-chartist/index.js']
        },
        output: {
          path: __dirname,
          filename: 'docs/html/scripts/[name].js',
          publicPath: '/',
          library: "[name]",
          libraryTarget: "umd"
        },
        resolve: {
          extensions: ['', '.js', '.jsx']
        },
        module: {
          loaders: [{
            test: /\.jsx?$/,
            loader: 'babel',
          }]
        },
        externals: {
          "react": "React",
          "underscore": "_",
          "Chartist": "chartist"
        }
      }
    },
    "babel": {
      options: {
        sourceMap: false
      },
      build: {
        files: [{
            expand: true,
            cwd: 'scripts/',
            src: ['**/*.js', '**/*.jsx'],
            dest: 'compiled/'
          }]
      },
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'compiled/',
            src: ['**/*.jsx'],
            dest: 'modules/',
            ext: '.jsx.js'
          }
        ]
      }
    },
    watch: {
      scripts: {
        files: ['**/*.jsx', "docs/assets/**/*.css", "docs/assets/**/*.html", "docs/src/**/*.*", "examples/**/*.*", "scripts/**/*.js"],
        tasks: ['build'],
        options: {
          spawn: false,
          interrupt: true,
          livereload: true
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-include-replace');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'build',
      'connect',
      'open',
      'watch',
    ]);
  });

  grunt.registerTask('build', function(target){
    grunt.task.run([
      'clean',
      'includereplace',
      'markdown',
      'clean:includes',
      'clean:compiled',
      'babel:build',
      'webpack:docs',
      'webpack:default',
      'copy',
      'babel:dynamic_mappings',
      'clean:compiled'
    ]);
  })

  // Default task(s).
  grunt.registerTask('default', ['serve']);
};
