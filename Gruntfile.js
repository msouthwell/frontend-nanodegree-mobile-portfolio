module.exports = function(grunt) {
    var mozjpeg = require('imagemin-mozjpeg');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
            },
            js: {
                src: ['js/*.js'],
                dest: 'dist/built.js'
            },
            css: {
                src: ['css/*.css'],
                dest: 'dist/styles.css'
            },
        },
        uglify: {
            my_target: {
                files: {
                    'js/perfmatters.min.js': 'js/perfmatters.js'
                }
            }
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'css/print.min.css': ['css/print.css'],
                    'css/style.min.css': ['css/style.css'],
                    'views/css/bootstrap-grid.min.css': 'views/css/bootstrap-grid.css',
                    'views/css/style.min.css' : 'views/css/style.css'
                }
            }
        },
        imagemin: { // Task
            dynamic: { // Target
                files: [{
                    expand: true,
                    cwd: 'img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'img/'

                }]
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false,
                },
            },
        },
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
}