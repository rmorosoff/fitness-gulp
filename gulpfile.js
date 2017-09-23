'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var cssvalidate = require('gulp-w3c-css');
var path = require('path');
var gutil = require('gulp-util');
var htmlhint = require('gulp-htmlhint');
var babel = require('gulp-babel');
var beautify = require('gulp-beautify');
var about = require('gulp-about');
var assets = require("gulp-assets");
var cssScss = require('gulp-css-scss');

// variables to hold some of the paths needed for gulp tasks
var srcPath = path.join(__dirname, './assets/css/*.css');
var dstPath = path.join(__dirname, '././assets/error');
var babelPath = path.join(__dirname, '././assets/js/babel');

// task to convert css to scss.  was curious to see how it worked
// not set up to run by default.  seems like more of a one off type thing
gulp.task('cssScss', function() {
    return gulp.src('./assets/css/*.css')
    .pipe(cssScss())
    .pipe(gulp.dest('./assets/css/newscss'));
  });

// task to comb through html and output any included js or css files
// again, not a default type function, but a handy one off
gulp.task('assets', function() {
    gulp.src("./index.html")
    .pipe(assets({
        js: true,
        css: false
    }))
    .pipe(gulp.dest("./dist"));
  });

// produces an about doc based off the package.json
gulp.task('about', function() {
    return gulp.src('./package.json')
    .pipe(about())
    .pipe(gulp.dest('./'));  // writes about.json 
  });

gulp.task('sass', function() {
  return gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css/'));
});

gulp.task('cssvalidate', function() {
    gulp.src(srcPath)
    .pipe(cssvalidate())
    .pipe(gulp.dest(dstPath));
});

gulp.task('htmlhint', function() {
    gulp.src("./*.html")
    .pipe(htmlhint())
    .pipe(htmlhint.reporter())
});

gulp.task('babel', function() {
    gulp.src('./assets/js/*.js')
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest(babelPath))
});

gulp.task('beautify', function() {
    gulp.src('./assets/js/*.js')
    .pipe(beautify({indent_size: 2}))
    .pipe(gulp.dest('./assets/js/'))
});

gulp.task('watch', function () {
  gulp.watch('./assets/sass/**/*.scss', ['sass']);
});

gulp.task('htmltasks', ['htmlhint']);

gulp.task('csstasks', ['sass', 'cssvalidate']);

gulp.task('jstasks', ['babel', 'beautify']);

gulp.task('default', ['csstasks', 'htmltasks','jstasks', 'about']);