module.exports = function (grunt) {

    var package = require('./package.json');

    grunt.initConfig({
        pkg: '<json:package.json>',
        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            files: {
                src: [
                    'js-hierarchy.ts',
                    'test/**/*.ts',
                    'lib/**/*.ts',
                    '!js-hierarchy.d.ts',
                    '!test/**/*.d.ts',
                    '!lib/**/*.d.ts'
                ]
            }
        },
        clean: {
            doc: ['doc'],
            coverage: ['test/coverage'],
            declaration: ['js-hierarchy.declaration.*']
        },
        ts: {
            default: {
                tsconfig: true
            },
            generateDeclaration: {
                tsconfig: 'tsconfig.declaration.json'
            }
        },
        copy: {
            test: {
                files: {
                    'test/coverage/instrument/': 'test/**/*.js'
                },
                options: {
                    expand: true
                }
            },
            declaration: {
                files: {
                    'js-hierarchy.d.ts': 'js-hierarchy.declaration.d.ts'
                }
            }
        },
        instrument: {
            files: ['js-hierarchy.js', 'lib/**/*.js'],
            options: {
                lazy: true,
                basePath: 'test/coverage/instrument/'
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    quiet: false
                },
                src: ['test/coverage/instrument/test/**/*.js']
            }
        },
        storeCoverage: {
            options: {
                dir: 'test/coverage/reports'
            }
        },
        remapIstanbul: {
            build: {
                src: 'test/coverage/reports/coverage.json',
                options: {
                    reports: {
                        'json': 'test/coverage/reports/coverage-mapped.json'
                    }
                }
            }
        },
        makeReport: {
            src: 'test/coverage/reports/coverage-mapped.json',
            options: {
                type: 'lcov',
                dir: 'test/coverage/reports',
                print: 'detail'
            }
        },
        typedoc: {
            default: {
                options: {
                    out: 'doc/',
                    name: 'js-hierarchy',
                    readme: 'README.md'
                },
                src: ['js-hierarchy.ts']
            }
        },
        browserify: {
            default: {
                options: {
                    plugin: [
                        [
                            'tsify',
                            {}
                        ]
                    ],
                    browserifyOptions: {
                        standalone: 'jshierarchy'
                    }
                },
                files: {
                    'browser.js': ['js-hierarchy.ts']
                }
            },
            test: {
                options: {
                    plugin: [
                        [
                            'tsify',
                            {}
                        ]
                    ]
                },
                files: {
                    'test/test.browser.js': ['test/**/*.ts']
                }
            }
        },
        webdriver: {
            default: {
                configFile: 'wdio.conf.js'
            }
        },
        exec: {
            uglify: 'node_modules/.bin/uglifyjs --output browser.min.js --compress --mangle -- browser.js'
        },
        coveralls: {
            default: {
                src: 'test/coverage/reports/lcov.info'
            }
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('remap-istanbul');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-typedoc');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-webdriver');

    grunt.registerTask(
        'build',
        [
            'tslint',
            'ts:default'
        ]
    );

    grunt.registerTask(
        'default',
        [
            'build'
        ]
    );

    grunt.registerTask(
        'test',
        [
            'build',
            'clean:coverage',
            'copy:test',
            'instrument',
            'mochaTest:test',
            'storeCoverage',
            'remapIstanbul',
            'makeReport'
        ]
    );

    grunt.registerTask(
        'browsertest',
        [
            'build',
            'browserify:test',
            'webdriver'
        ]
    );

    grunt.registerTask(
        'doc',
        [
            'clean:doc',
            'typedoc'
        ]
    )

    grunt.registerTask(
        'release',
        [
            'test',
            'browsertest',
            'doc',
            'browserify:default',
            'exec:uglify'
        ]
    );

};