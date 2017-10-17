'use strict';

require('./processRequire.js');

/**
 * Initializes grunt, load extensions and register tasks.
 */
module.exports = function(grunt) {
  const config = {
    eslint: {
      server: {
        src: [
          'server.js',
          'Gruntfile.js',
          'processRequire.js',
          'lib/**/*.js'
        ]
      }
    }
  };

  grunt.initConfig(config);

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-eslint');

};
