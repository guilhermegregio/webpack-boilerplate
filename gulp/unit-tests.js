var gulp = require('gulp');
var env = require('gulp-env')
var gutil = require('gutil');
var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update;
var karma = require('karma').server;
var argv = require('optimist').argv;

var testConfig = {};
testConfig.type = argv['type'] || 'unit';

gulp.task('test', function() {
    if (testConfig.type === 'unit') {
        gulp.start('test-unit');
    } else {
        gulp.start('test-local-browser');
    }
});

gulp.task('test-unit', function(cb) {

    env({
        vars: {
            NODE_ENV: 'test'
        }
    });

    var config = {
        configFile: __dirname + '/../config/karma.config.js',
        singleRun: true
    };

    karma.start(config, cb);
});

gulp.task('webdriver_update', webdriver_update);

gulp.task('test-local-browser', ['dev:prepare'], function(cb) {
    var args = [
        '--baseUrl',
        'http://127.0.0.1:7000',
    ];

    gulp.src("./test/e2e/*.spec.js")
        .pipe(protractor({
            configFile: __dirname + "/../config/protractor.config.js",
            args: args
        }))
        .on('error', function(e) {
            gutil.log(e);
            cb();
            process.exit();
        })
        .on('end', function() {
            cb();
            process.exit();
        });
});
