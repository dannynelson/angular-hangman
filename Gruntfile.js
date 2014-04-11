'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    config: grunt.file.readJSON('./app.config.json'),

    clean: {
      public: ['public'],
      less: ['<%= concat.less.dest %>'],
      wrappedJS: ['<%= config.dist %>/client']
    },

    // concat all state less files to the end of index.less
    concat: {
      less: {
        src: ['<%= config.index.less %>', '<%= config.app.less %>'],
        dest: 'client/bundle.less'
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: 'public',
          keepalive: true
        }
      }
    },

    copy: {
      assets: {
        files: [
          {expand: true, cwd: 'client', src: ['assets/**'], dest: '<%= config.dist %>/'},
        ]
      }
    },

    // Insert angular templates into index.html
    htmlbuild: {
      templates: {
        src: '<%= config.index.html %>',
        dest: '<%= config.dist %>',
        options: {
          sections: {
            templates: '<%= config.app.html %>',
          },
        }
      }
    },

    jsbeautifier: {
      verify: {
        src: [
          'client/src/**/*.js',
          'index.js',
          'Gruntfile.js'
        ],
        options: {
          mode: 'VERIFY_ONLY',
          js: {
            indentSize: 2
          }
        }
      },
      all: {
        src: [
          'client/src/**/*.js',
          'index.js',
          'Gruntfile.js'
        ],
        options: {
          js: {
            indentSize: 2
          }
        }
      }
    },

    karma: {
      options: {
        configFile: 'test/karma.conf.js',
      },
      browser: {
        autoWatch: true,
        singleRun: false,
        browsers: ['Chrome', 'Firefox']
      },
      continuous: {
        singleRun: true,
      },
      coverage: {
        reporters: ['coverage'],
      },
      watch: {
        autoWatch: true,
        singleRun: false
      },
      debug: {
        autoWatch: true,
        singleRun: false,
        browsers: ['Chrome']
      }
    },

    less: {
      dev: {
        files: {
          "<%= config.dist %>/bundle.css": "<%= concat.less.dest %>"
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
          require: ['./test/server/src/bootstrap']
        },
        src: ['test/server/unit/**/*.js']
      }
    },


    protractor: {
      all: {
        options: {
          configFile: "test/protractor.conf.js", // Target-specific config file
          args: {} // Target-specific arguments
        }
      },
    },

    // Follow instructions https://github.com/angular/protractor to install selenium web driver
    protractor_webdriver: {
      main: {
        options: {
          command: 'webdriver-manager start',
        },
      },
    },

    uglify: {
      dev: {
        options: {
          mangle: false,
          compress: false,
          beautify: true,
          sourceMap: true,
          sourceMapIncludeSources: true
        },
        files: {
          '<%= config.dist %>/bundle.js': ['<%= config.vendor %>', '<%= config.index.js %>', '<%= config.app.js %>']
        }
      }
    },

    watch: {
      all: {
        files: [
          '<%= config.index.html %>',
          '<%= config.index.js %>',
          '<%= config.index.less %>',
          '<%= config.app.html %>',
          '<%= config.app.js %>',
          '<%= config.app.less %>',
          '<%= config.test %>',
          'Gruntfile.js'
        ],
        tasks: ['build'],
      },
      livereload: {
        options: {
          livereload: true
        },
        files: ['<%= config.dist %>/**'],
      }
    }
  });

  grunt.registerTask('default', [
    'test',
    'build'
  ]);

  grunt.registerTask('test', [
    'karma:continuous'
  ]);

  grunt.registerTask('e2e', [
    'protractor_webdriver',
    'protractor'
  ]);

  grunt.registerTask('build', [
    'clean:public',
    // templates
    'htmlbuild:templates',
    // javascript
    'uglify:dev',
    // less
    'concat:less',
    'less:dev',
    'clean:less',
    // assets
    'copy:assets'
  ]);

  grunt.registerTask('build:prod', [
    'jshint',
    'clean:public',
    'copy:public',
    'requirejs:prod',
    'processhtml'
  ]);
};
