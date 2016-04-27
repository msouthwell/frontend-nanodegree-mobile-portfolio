module.exports = function(grunt) {
    "use strict";
    var mozjpeg = require('imagemin-mozjpeg');
    var ngrok   = require('ngrok');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            my_target: {
              files: [{
                  expand: true,
                  cwd: 'src/',
                  src: '**/*.js',
                  dest: 'dist/'
              }]
            }
          },
        imagemin: {                          // Task 
            dynamic: {                         // Another target 
              files: [{
                expand: true,                  // Enable dynamic expansion 
                cwd: 'src/',                   // Src matches are relative to this path 
                src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match 
                dest: 'dist/'                  // Destination path prefix 
              }]
            }
          },
        watch: {
            scripts: {
                files: ['src/**/*.js'],
                tasks: ['jshint', 'uglify'],
                options: {
                    spawn: false,
                },
            },
            source: {
                files: ['src/**/*.html'],
                tasks: ['htmlmin']
            },
            images: {
                files: ['src/**/*.{png,jpg,gif}'],
                tasks: ['imagemin']
            }
        },
        cssmin: {
  target: {
    files: [{
      expand: true,
      cwd: 'src/views/css',
      src: ['*.css', '!*.min.css'],
      dest: 'dist/views/css',
      ext: '.min.css'
    }]
  }
},
        pagespeed: {
            options: { 
                nokey: true,
                locale: 'en_GB', 
                threshold: 40 
            }, 
            local: {
                options: {
                    strategy: 'desktop' 
                } 
            }, 
            mobile: {
                options: {
                    strategy: 'mobile' 
                } 
            } 
        }, 
          htmlmin: {                                     // Task 
            dist: {                                      // Target 
              options: {                                 // Target options 
                removeComments: true,
                collapseWhitespace: true
              },
              files: [{
                  expand: true,
                  cwd: 'src/',
                  src: '**/*.html',
                  dest: 'dist/'
              }]
            }
          }
    });

    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() { 
        var done = this.async(); 
        var port = 8000;
        ngrok.connect(port, function(err, url) {
          if (err !== null) {
            grunt.fail.fatal(err);
            return done();
          }
          grunt.config.set('pagespeed.options.url', url);
          grunt.task.run('pagespeed');
          done();
        });  
    });
    grunt.registerTask('default', ['htmlmin', 'uglify', 'cssmin']);
    grunt.loadNpmTasks('grunt-pagespeed');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    
};