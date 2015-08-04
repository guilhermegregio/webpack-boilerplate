var gulp = require('gulp');
var del = require('del');

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
