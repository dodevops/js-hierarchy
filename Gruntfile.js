module.exports = function (grunt) {

    grunt.initConfig({
        tslint: {
            options: {
                configuration: 'tslint.json'
            },
            files: {
                src: [
                    'index.ts',
                    'test/**/*.ts',
                    'lib/**/*.ts',
                    '!index.d.ts',
                    '!test/**/*.d.ts',
                    '!lib/**/*.d.ts'
                ]
            }
        },
        clean: {
            coverage: ['test/coverage'],
            declaration: ['index.declaration.*']
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
                    'index.d.ts': 'index.declaration.d.ts'
                }
            }
        },
        instrument: {
            files: ['index.js', 'lib/**/*.js'],
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
        }
    });

    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-tslint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-istanbul');
    grunt.loadNpmTasks('remap-istanbul');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

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
        'release',
        [
            'test',
            'ts:generateDeclaration',
            'copy:declaration',
            'clean:declaration'
        ]
    );

};