"use strict";

var csso = require("gulp-csso");
var del = require("del");
var gulp = require("gulp");
var htmlmin = require("gulp-htmlmin");
var runSequence = require("run-sequence");
var uglify = require("gulp-uglify");
var bytediff = require("gulp-bytediff");

var size = require("filesize"),
  gutil = require("gulp-util"),
  path = require("path"),
  map = require("map-stream");
var savings = 0;

function byteDiffCB(data) {
  var saved = data.savings > 0 ? " saved " : " gained ";
  var color = data.savings > 0 ? "green" : "yellow";
  var start = size(data.startSize);
  var end = gutil.colors[color](size(data.endSize));
  var report = " (" + start + " -> " + end + ")";
  savings += data.savings;
  return data.fileName + saved + size(Math.abs(data.savings)) + report;
}
// Gulp task to minify CSS files
gulp.task("css", function() {
  return (
    gulp
      .src(["./src/**/*.css"])
      .pipe(bytediff.start())
      // Minify the file
      .pipe(csso())
      // Output
      .pipe(
        bytediff.stop(function(data) {
          return byteDiffCB(data);
        })
      )
      .pipe(gulp.dest("./dist/css"))
  );
});
// Gulp task to minify JavaScript files
gulp.task("js", function() {
  return (
    gulp
      .src("./src/**/*.js")
      .pipe(bytediff.start())
      // Minify the file
      .pipe(uglify())
      // Output
      .pipe(
        bytediff.stop(function(data) {
          return byteDiffCB(data);
        })
      )
      .pipe(gulp.dest("./dist"))
  );
});
// Gulp task to minify HTML files
gulp.task("html", function() {
  return gulp
    .src(["./src/**/*.html"])
    .pipe(bytediff.start())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(
      bytediff.stop(function(data) {
        return byteDiffCB(data);
      })
    )
    .pipe(gulp.dest("./dist"));
});

// Clean output directory
gulp.task("clean", () => del(["dist"]));
gulp.task("print-size", function() {
  console.log("Total Savings: " + size(savings));
});
// Gulp task to minify all files
gulp.task("default", ["clean"], function() {
  runSequence("html", "css", "js", "print-size");
});
