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
    react: {
      dynamic_mappings: {
        files: [
          {
            expand: true,
            cwd: 'scripts/',
            src: ['**/*.jsx'],
            dest: 'modules/',
            ext: '.jsx.js'
          }
        ]
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
      includes: [ "docs/dist"]
    },
    copy: {
      docs: {
        files: [
          { expand: true, cwd: 'docs/assets/', src: ['**'], dest: 'docs/html/', flatten: false},
          { expand: true, src: ['examples/assets/scripts/testComponent.js', 'examples/assets/scripts/fakeData.js', 'examples/assets/scripts/swapi.min.js', 'examples/assets/scripts/freezeframe.min.js', 'examples/assets/scripts/GriddleWithCallback.js'], dest: 'docs/html/scripts', flatten: true}
        ]
      }
    },
    webpack: {
      default: {
        entry: {
          Griddle: ['./scripts/griddle.jsx'],
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
            {test: /\.jsx$/, loader: 'jsx'}
          ]
        },
        externals: {
          "react": "React",
          "underscore": "_",

        }
      },
      docs: {
        entry: {
            Griddle: ['./scripts/griddle.jsx'],
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
          loaders: [
            {test: /\.jsx$/, loader: 'jsx'}
          ]
        },
        externals: {
          "react": "React",
          "underscore": "_",
          "Chartist": "chartist"
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*.jsx', "docs/assets/**/*.css", "docs/assets/**/*.html", "docs/src/**/*.*", "examples/**/*.*"],
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
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-markdown');
  grunt.loadNpmTasks('grunt-include-replace');

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
      'webpack:docs',
      'webpack:default',
      'copy',
    ]);
  })

  // Default task(s).
  grunt.registerTask('default', ['serve']);
};
