module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 9000,
          hostname: '*'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.server.options.port %>/index.html',
        app: 'chrome'
      }
    }
  });

  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'connect',
      'open'
    ]);
  });

  // Default task(s).
  grunt.registerTask('default', ['serve']);
};