var gulp = require('gulp');
var spawn = require('child_process').spawn;
var jsonServer;

gulp.task('json-server', function(done) {
    if (jsonServer) jsonServer.kill();

    jsonServer = spawn('node', ['./server/json-server.js']);
    var started = false;

    jsonServer.stdout.on('data', function(data) {
        if (started) return;
        started = true;
        done();
    });
});

process.on('exit', function() {
    if (jsonServer) jsonServer.kill();
});
