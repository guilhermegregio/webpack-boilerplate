var gulp = require('gulp');
var sprity = require('sprity');
var gulpif = require('gulp-if');

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
