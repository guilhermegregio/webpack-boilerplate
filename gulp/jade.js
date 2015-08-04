var gulp = require('gulp');
var jade = require('gulp-jade');

gulp.task('index', function() {
	var pretty = process.env.NODE_ENV !== 'production';

    var stream = gulp.src('./src/index.jade')
        .pipe(jade({
            pretty: pretty,
        }))
        .pipe(gulp.dest('./build/'));

    return stream;
});
