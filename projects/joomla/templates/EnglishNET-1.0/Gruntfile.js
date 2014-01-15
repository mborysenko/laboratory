/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %>\n' + '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' + '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' + ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        dist_folder: '<%= pkg.title || pkg.name %> - v<%= pkg.version %>',
        build: {

        },
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                files: {
                    'js/template.js': ['js/**/*.js']
                }
            }
        },
        cssmin: {
            options: {
                banner: '<%= banner %>',
                keepSpecialComments: '0'
            },
            dist: {
                files: {
                    'css/template.min.css': [
                        'css/reset.css',
                        'css/normalize.css',
                        'css/bootstrap.css',
                        'css/grid.css',
                        'css/main.css',
                        'css/styles.css',
                        'css/icons.css',
                        'css/social.css',
                        'css/menus.css'
                    ]
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: 'js/**/*.js',
                dest: 'js/template.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'qunit']
            }
        },
        copy: {
            debug: {
                cwd: ".",
                src: ["css/**", "html/**", "images/**", "js/**", "language/**", "*.php", "*.png", "*.xml", "*.ico"],
                dest: "dist/"
            },
            release: {
                cwd: ".",
                src: ["css/template.min.css", "html/**", "images/**", "js/template.min.js", "language/**", "*.php", "*.png", "*.xml", "*.ico"],
                dest: "dist/"
            }
        },
        clean: ['dist', 'js/template.min.js', 'css/template.min.css'],
        compress: {
            main: {
                options: {
                    archive: 'dist/<%= pkg.name || pkg.title%>-<%=pkg.version%>.zip',
                    mode: 'zip',
                    level: 9
                },
                cwd: 'dist/',
                src: '**/*'
            }
        },

        less: {
            development: {
                options: {
                    paths: "css"
                },
                files: {
                    "css/grid.css": "css/grid.less",
                    "css/icons.css": "css/icons.less",
                    "css/main.css": "css/main.less",
                    "css/menus.css": "css/menus.less",
                    "css/social.css": "css/social.less",
                    "css/styles.css": "css/styles.less"
                }
            },
            release: {
                options: {
                    paths: "css"
                },
                files: {
                    "css/template.min.css": [
                        "css/grid.less",
                        "css/icons.less",
                        "css/main.less",
                        "css/menus.less",
                        "css/social.less",
                        "css/styles.less"
                    ]
                }
            }

        }
    });



    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-less');

    // Default task.
    grunt.registerTask('default', ['clean', 'cssmin', 'uglify', 'copy:release', 'compress']);
    grunt.registerTask('build', ['less']);
    grunt.registerTask('debug', ['clean', 'copy:debug', 'compress']);

};
