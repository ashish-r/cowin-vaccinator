const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');
const jeditor = require('gulp-json-editor');

exports.buildJs = gulp.task('buildJs', function () {
  return (
    browserify({
      entries: ['src/data.js', 'src/ui.js', 'src/script.js'],
      transform: [babelify.configure({ presets: ['@babel/preset-env'] })],
    })
      .bundle()
      .pipe(source('main.js'))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest('bin/build'))
  );
});

exports.copyManifest = gulp.task('copyManifest', function () {
  return gulp
    .src('./manifest.json')
    .pipe(
      jeditor(function (json) {
        json.content_scripts[0] = { ...json.content_scripts[0], js: ['main.js'] };
        return json; // must return JSON object.
      })
    )
    .pipe(gulp.dest('bin/build'));
});

exports.copyLogos = gulp.task('copyLogos', function () {
  return gulp.src('logo/*').pipe(gulp.dest('bin/build/logo'));
});

exports.zipAssets = gulp.task('zipAssets', function () {
  return gulp.src(['bin/build/**']).pipe(zip('cowin-vaccinator.zip')).pipe(gulp.dest('bin'));
});

gulp.task('build', gulp.series('buildJs', 'copyManifest', 'copyLogos', 'zipAssets'));
