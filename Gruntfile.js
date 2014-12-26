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
          keepalive: true
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.server.options.port %>/docs/html/old.html'
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
          { expand: true, src: ['build/*'], dest: 'docs/html/scripts', flatten: true},
          { expand: true, cwd: 'docs/old/', src: ['**'], dest: 'docs/html/', flatten: false},
          { expand: true, src: ['examples/assets/scripts/testComponent.js', 'examples/assets/scripts/fakeData.js'], dest: 'docs/html/scripts', flatten: true}         
        ]
      }
    },
    webpack: {
      default: {
        entry: {
          Griddle: ['./scripts/griddle.jsx'], 
          GriddleWithCallback: './scripts/griddleWithCallback.jsx'},
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
          "underscore": "_"
        }
      },
      docs: {
        entry: {
            Griddle: ['./scripts/griddle.jsx'], 
            GriddleWithCallback: './scripts/griddleWithCallback.jsx', 
            TestChart: './examples/basic/testChart.jsx'
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
          "underscore": "_"
        }
      }
    }
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
      'clean',
      'includereplace',
      'markdown',
      'clean:includes',
      'webpack:docs',
      'copy',
      'open',
      'connect'
    ]);
  });

  // Default task(s).
  grunt.registerTask('default', ['serve']);
};
