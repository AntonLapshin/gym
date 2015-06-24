var gulp = require('gulp');
var exec = require('gulp-exec');

gulp.task('build', function() {
    // place code for your default task here
    gulp.run('r-js');
});

gulp.task('r-js', function(){
    gulp.src('')
        .pipe(exec('build.bat', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        })
    );
});