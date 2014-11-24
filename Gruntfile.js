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
        url: 'http://localhost:<%= connect.server.options.port %>/index.html'
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
  }
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-react');
  grunt.loadNpmTasks('grunt-jsxhint');

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'open',
      'connect'
    ]);
  });

  // Default task(s).
  grunt.registerTask('default', ['serve']);
};
