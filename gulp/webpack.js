var gulp = require('gulp');
var webpack = require('webpack');
var webpackDevServer = require("webpack-dev-server");
var gutil = require('gutil');

function webpackConfig() {
    return require('../config/webpack.config.js');
}

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
