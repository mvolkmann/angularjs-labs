'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['build'],
    connect: { // not using this at the moment
      server: {
        options: {
          port: 3000,
          base: '.'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', '*.js', 'features/**/*.js']
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
      options: { livereload: true },
      css: {
        files: ['styles/*.css'],
        tasks: ['csslint']
      },
      less: {
        files: ['styles/*.less'],
        tasks: ['less']
      },
      html: {
        files: ['index.html', 'features/**/*.html'],
        tasks: []
      },
      js: {
        files: ['Gruntfile.js', '*.js', 'features/**/*.js'],
        tasks: ['jshint', 'traceur']
      }
    }
  });

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('server', function () {
    grunt.util.spawn({
      cmd: 'node',
      args: ['build/server.js'],
      opts: {stdio: 'inherit'}
    });
  });

  grunt.registerTask('default',
    ['jshint', 'less', 'traceur', 'server', 'watch']);
};
