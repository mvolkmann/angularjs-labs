'use strict';
/*jshint esnext: true */
var http = require('http');

module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['build'],
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', '*.js', 'features/**/*.js']
    },
    csslint: {
      strict: {
        options: {
          'box-model': false, // allows setting width/height with box properties
          ids: false, // allows ids to be used in CSS selectors
          'overqualified-elements': false // allows element name with class
        },
        src: ['build/styles/*.css']
      }
    },
    less: {
      all: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['*.less'],
          dest: 'build/styles',
          ext: '.css'
        }]
      }
    },
    protractor: {
      options: {
        configFile: 'protractor.conf.js',
        keepAlive: true,
        noColor: false
      },
      all: {
      }
    },
    touch: { // used to force livereload after server restart
      /*
      options: {
        force: true,
        mtime: true
      },
      */
      src: ['index.html'],
    },
    traceur: {
      options: {
        includeRuntime: true, // includes runtime code in generated file
        traceurOptions: '--experimental --sourcemap'
      },
      server: {
        files: {
          // Just need to transpile main file which imports others.
          'build/server.js': ['server.js']
        }
      },
      webapp: {
        files: {
          // Just need to transpile main file which imports others.
          'build/app.js': ['app.js']
        }
      }
    },
    watch: {
      app: {
        options: { livereload: true },
        files: ['build/app.js']
      },
      css: {
        options: { livereload: true },
        files: ['build/styles/*.css'],
        // TODO: Why does livereload only work if "touch" is used?
        tasks: ['csslint', 'touch']
      },
      less: {
        files: ['styles/*.less'],
        tasks: ['less']
      },
      html: {
        options: { livereload: true },
        files: ['index.html', 'features/**/*.html'],
        tasks: []
      },
      js: {
        files: ['Gruntfile.js', 'app.js', 'features/**/*.js'],
        tasks: ['jshint', 'traceur:webapp']
      },
      server: {
        files: ['server.js'],
        tasks: ['jshint', 'traceur:server', 'restart', 'touch']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('restart', function () {
    var done = this.async(); // This is an asynchronous Grunt task.
    var req = http.get('http://localhost:3000/shutdown', function (res) {
      // Give server time to shutdown.
      setTimeout(function () {
        grunt.task.run('server');
        done();
      }, 1000);
    });
    req.end();
  });

  grunt.registerTask('server', function () {
    var options = {
      cmd: 'node',
      args: ['build/server.js'],
      opts: {stdio: 'inherit'}
    };
    // Must give this a callback, but it doesn't need to do anything.
    grunt.util.spawn(options, function () {});
  });

  grunt.registerTask('default',
    ['jshint', 'less', 'traceur', 'server', 'watch']);
};
