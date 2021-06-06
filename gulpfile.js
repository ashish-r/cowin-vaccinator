const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const zip = require('gulp-zip');
const jeditor = require('gulp-json-editor');
const concat = require('gulp-concat');

exports.concatJs = gulp.task('concatJs', function () {
  return gulp.src(['src/data.js', 'src/script.js']).pipe(concat('main.js')).pipe(gulp.dest('bin/build'));
});

exports.buildJs = gulp.task('buildJs', function () {
  return (
    browserify({
      entries: ['bin/build/main.js'],
      transform: [babelify.configure({ presets: ['@babel/preset-env'], plugins: ['@babel/plugin-transform-runtime'] })],
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

gulp.task('build', gulp.series('concatJs', 'buildJs', 'copyManifest', 'copyLogos', 'zipAssets'));
