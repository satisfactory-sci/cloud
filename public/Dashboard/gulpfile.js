var gulp = require("gulp")
var browserify = require("browserify")
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var babelify = require("babelify")

gulp.task("build", function() {
  var b = browserify({
    entries: './src/index.js',
    debug: true,
    transform: ['babelify']
  })
  return b.bundle()
    .pipe(source('build.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest('./public'));
})

gulp.task('product', function() {
  var b = browserify({
    entries: './src/index.js',
    transform: ['babelify']
  })
  return b.bundle()
  .pipe(source('build.js'))
  .pipe(buffer())
  .pipe(uglify())
  .on('error', gutil.log)
  .pipe(gulp.dest('./public/'));
})

gulp.task("watch", function() {
  gulp.watch('src/*.js', ['build'])
  gulp.watch('src/Components/*.js', ['build'])
})

gulp.task("default", function() {
  if(!!gutil.env.production){
    gulp.start('product')
  }else{
    gulp.start('build', 'watch')
  }
})
