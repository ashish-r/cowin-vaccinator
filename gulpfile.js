const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');

function javascriptBuild() {
  return (
    browserify({
      entries: ['src/script.js', 'src/ui.js'],
      transform: [babelify.configure({ presets: ['@babel/preset-env'] })],
    })
      .bundle()
      .pipe(source('bundle.js'))
      // Turn it into a buffer!
      .pipe(buffer())
      // And uglify
      .pipe(uglify())
      .pipe(gulp.dest('bin'))
  );
}

exports.build = javascriptBuild;
