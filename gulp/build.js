var gulp = require('gulp');
var env = require('gulp-env')
var gutil = require('gutil');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");

function webpackConfig() {
    return require('../config/webpack.config.js');
}

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
