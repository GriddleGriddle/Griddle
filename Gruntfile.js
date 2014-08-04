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
    browserify: {
      options:{
        transform: [ require('grunt-react').browserify]
      },
      client: {
        src: ['scripts/**/*.jsx'],
        dest: 'build/griddle.js'
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.server.options.port %>/index.html'
      }
    }
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'open',
      'connect'
    ]);
  });

  grunt.registerTask('build', ['browserify']);

  // Default task(s).
  grunt.registerTask('default', ['serve']);
};
