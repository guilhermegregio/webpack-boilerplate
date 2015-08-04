var gulp = require('gulp');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");
var env = require('gulp-env')
var gutil = require('gutil');
var opn = require('opn');
var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update;
var karma = require('karma').server;
var argv = require('optimist').argv;
var sprity = require('sprity');
var gulpif = require('gulp-if');
var del = require('del');
var spawn = require('child_process').spawn;
var proc2;
var url = require('url');
var proxy = require('proxy-middleware');
var runSequence = require('run-sequence');

var buildConfig = {};
buildConfig.type = argv['build-type'] || 'development';
buildConfig.environment = argv['build-environment'] || 'development';

var testConfig = {};
testConfig.type = argv['type'] || 'unit';

function webpackConfig() {
    return require('./config/webpack.config.js');
}

process.on('exit', function() {
    if (proc2) proc2.kill();
});

gulp.task('json-server', function(cb) {
    if (proc2) proc2.kill();

    proc2 = spawn('node', ['./server/json-server.js']);
    var started = false;

    proc2.stdout.on('data', function(data) {
        if (started) return;
        started = true;
        cb();
    });
});

gulp.task('dev:prepare', ['sprites', 'webpack-dev-server', 'json-server'], function() {
    var webpackServer = url.parse('http://127.0.0.1:9001');

    var jsonServer = url.parse('http://127.0.0.1:9002');
    jsonServer.route = '/api';

    browserSync.init({
        server: {
            baseDir: './build',
            middleware: [proxy(jsonServer), proxy(webpackServer)]
        },
        open: false,
        browser: 'google chrome',
        port: 7000
    });
});

gulp.task('dev', ['dev:prepare'], function() {
    opn('http://127.0.0.1:7000');
});

gulp.task('index', function() {
	var pretty = process.env.NODE_ENV !== 'production';

    var stream = gulp.src('./src/index.jade')
        .pipe(jade({
            pretty: pretty,
        }))
        .pipe(gulp.dest('./build/'));

    return stream;
});

gulp.task('webpack-dev-server', ['index'], function(cb) {
    var compiler = webpack(webpackConfig());

    new webpackDevServer(compiler, {
        contentBase: './build',
        publicPath: '/build/',
        quiet: false,
        noInfo: false,
        watchDelay: 300,
        historyApiFallback: true,
        stats: {
            colors: true
        }
    }).listen(9001, '127.0.0.1', function(err) {
        if (err) {
            throw new gutil.PluginError('webpack-dev-server', err);
        }

        cb();
    });
});

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
        configFile: __dirname + '/config/karma.config.js',
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
            configFile: __dirname + "/config/protractor.config.js",
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

gulp.task('sprites', ['clean:sprites'], function() {
    return sprity.src({
            src: './src/images/**/*.{png,jpg}',
            prefix: 'gmg',
            split: false,
            orientation: 'vertical',
            style: './sprite.css',
        })
        .pipe(gulpif('*.png', gulp.dest('./build/images/'), gulp.dest('./build/css/')))
});

gulp.task('clean:sprites', function(cb) {
    del([
        './build/images/',
        './build/css/'
    ], cb);
});

gulp.task('clean', function(cb) {
    del([
        './build/'
    ], cb);
});

gulp.task('build', function(done) {
    env({
        vars: {
            NODE_ENV: 'production'
        }
    });

    runSequence(
        'clean',
        'index',
		'sprites',
        'webpack:build',
        done
    );
});

gulp.task('webpack:build', function(done){
	var compiler = webpack(webpackConfig());

    compiler.run(function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack-build', err);
        }

        gutil.log("[build]", stats.toString({
            colors: true
        }));

        done();
    });
});
