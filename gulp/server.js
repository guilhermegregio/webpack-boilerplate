var gulp = require('gulp');
var browserSync = require('browser-sync');
var url = require('url');
var proxy = require('proxy-middleware');
var opn = require('opn');

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
        port: 7000
    });
});

gulp.task('dev', ['dev:prepare'], function() {
    opn('http://127.0.0.1:7000');
});
