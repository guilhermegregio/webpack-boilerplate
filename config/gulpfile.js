var gulp = require('gulp');
var browserSync = require('browser-sync');
var pm2 = require('pm2');
var jade = require('gulp-jade');
var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");
var env = require('gulp-env')
var gutil = require('gutil');
var protractor = require('gulp-protractor').protractor;
var webdriver_standalone = require('gulp-protractor').webdriver_standalone;
var webdriver_update = require('gulp-protractor').webdriver_update;
var karma = require('karma').server;
var argv = require('optimist').argv;
var sprity = require('sprity');
var gulpif = require('gulp-if');
var del = require('del');

var testConfig = {};
testConfig.type = argv['type'] || 'unit';

function webpackConfig() {
    var options = {
        context: __dirname + '/../src',
        entry: './index.js',
        output: {
            path: __dirname + '/../build/',
            filename: 'bundle.js'
        },
        plugins: [
            new webpack.DefinePlugin({
                ON_TEST: process.env.NODE_ENV === 'test'
            })
        ],
        module: {
            loaders: [{
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }, {
                test: /\.html$/,
                loader: 'raw',
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                loader: 'style!css',
                exclude: /node_modules/
            }, {
                test: /\.styl$/,
                loader: 'style!css!stylus',
                exclude: /node_modules/
            }]
        }
    };

    return options;
}

gulp.task('server', ['sprites', 'webpack-dev-server'], function(cb) {
    pm2.connect(function() {
        pm2.start({
            script: __dirname + '/../server.js', // Script to be run
            exec_mode: 'cluster', // Allow your app to be clustered
            instances: 4, // Optional: Scale your app by 4
            max_memory_restart: '100M' // Optional: Restart your app if it reaches 100Mo
        }, function(err, apps) {
            cb();
        });
    });
});

gulp.task('json-server', function(cb) {
    pm2.connect(function() {
        pm2.start({
            script: __dirname + '/../server/json-server.js', // Script to be run
            exec_mode: 'cluster', // Allow your app to be clustered
            instances: 4, // Optional: Scale your app by 4
            max_memory_restart: '100M' // Optional: Restart your app if it reaches 100Mo
        }, function(err, apps) {
            cb();
        });
    });
});

gulp.task('dev', ['server', 'json-server'], function() {
    browserSync.init(null, {
        proxy: '127.0.0.1:3000',
        browser: 'google chrome',
        port: 7000
    });
});

gulp.task('index', function() {
    var stream = gulp.src('../src/index.jade')
        .pipe(jade({
            pretty: true,
        }))
        .pipe(gulp.dest('../build/'));

    return stream;
});

gulp.task('webpack-dev-server', ['index'], function(done) {
    var compiler = webpack(webpackConfig());

    new webpackDevServer(compiler, {
        contentBase: '../build',
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

        done();
    });
});

gulp.task('test', function() {
    if (testConfig.type === 'unit') {
        gulp.start('test-unit');
    } else {
        gulp.start('test-local-browser');
    }
});

gulp.task('test-unit', function(done) {

    env({
        vars: {
            NODE_ENV: 'test'
        }
    });

    var config = {
        configFile: __dirname + '/karma.config.js',
        singleRun: true
    };

    karma.start(config, done);
});

gulp.task('webdriver_update', webdriver_update);

gulp.task('test-local-browser', ['server', 'json-server' /*, 'webdriver_update'*/ ], function(done) {
    var args = [
        '--baseUrl',
        'http://127.0.0.1:3000',
    ];

    gulp.src("../test/e2e/*.spec.js")
        .pipe(protractor({
            configFile: __dirname + "/protractor.config.js",
            args: args
        }))
        .on('error', function(e) {
            gutil.log(e);
            pm2.disconnect();
            done();
        })
        .on('end', function() {
            pm2.disconnect();
            done();
            process.exit();
        });
});

gulp.task('sprites', ['clean:sprites'], function() {
    return sprity.src({
            src: '../src/images/**/*.{png,jpg}',
            style: './sprite.css',
        })
        .pipe(gulpif('*.png', gulp.dest('../build/images/'), gulp.dest('../build/css/')))
});


gulp.task('clean:sprites', function (cb) {
  del([
	'../build/images/',
	'../build/css/'
  ], cb);
});
