"use strict";

var csso = require("gulp-csso");
var del = require("del");
var gulp = require("gulp");
var htmlmin = require("gulp-htmlmin");
var runSequence = require("run-sequence");
var uglify = require("gulp-uglify");
var bytediff = require("gulp-bytediff");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var luaminify = require("gulp-luaminify");
var through = require("through2");

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

function objMin(data) {
  var stringArray = data.split("\n");
  for (var i = 0; i < stringArray.length; i++) {
    if (stringArray[i][0] == "v") {
      stringArray[i] = stringArray[i].split(" ");
      for (var j = 0; j < stringArray[i].length; j++) {
        if (!isNaN(stringArray[i][j])) {
          stringArray[i][j] = parseFloat(stringArray[i][j]).toFixed(2);
        }
      }
      stringArray[i] = stringArray[i].join(" ");
    }
  }
  stringArray = stringArray
    .filter(n => n[0] != "#")
    .filter(n => n.trim() != "");
  stringArray = stringArray.join("\n");

  return Buffer.from(stringArray, "utf8");
}

const conf = {
  obj: ["src/**/*.obj"],
  js: ["./src/**/*.js"],
  html: ["./src/**/*.html"],
  css: ["./src/**/*.css"],
  lua: ["./src/**/*.lua"],
  svg: ["./src/**/*.svg"],
  img: ["src/**/*.png", "src/**/*.jpg", "src/**/*.jpeg", "src/**/*.gif"]
};
gulp.task("obj", function() {
  return gulp
    .src(conf["obj"])
    .pipe(bytediff.start())
    .pipe(
      through.obj(function(chunk, enc, cb) {
        chunk._contents = objMin(chunk._contents.toString());
        cb(null, chunk);
      })
    )
    .pipe(
      bytediff.stop(function(data) {
        return byteDiffCB(data);
      })
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("lua", function() {
  return gulp
    .src(conf["lua"])
    .pipe(bytediff.start())
    .pipe(luaminify())
    .pipe(
      bytediff.stop(function(data) {
        return byteDiffCB(data);
      })
    )
    .pipe(gulp.dest("./dist"));
});
// Gulp task to minify CSS files
gulp.task("css", function() {
  return (
    gulp
      .src(conf["css"])
      .pipe(bytediff.start())
      // Minify the file
      .pipe(csso())
      // Output
      .pipe(
        bytediff.stop(function(data) {
          return byteDiffCB(data);
        })
      )
      .pipe(gulp.dest("./dist"))
  );
});
// Gulp task to minify JavaScript files
gulp.task("js", function() {
  return (
    gulp
      .src(conf["css"])
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
    .src([conf["html"]])
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

gulp.task("image", () =>
  gulp
    .src(conf["img"])
    .pipe(bytediff.start())
    .pipe(imagemin())
    .pipe(
      bytediff.stop(function(data) {
        return byteDiffCB(data);
      })
    )
    .pipe(gulp.dest("./dist"))
);

gulp.task("svg", function() {
  return gulp
    .src(conf["svg"])
    .pipe(bytediff.start())
    .pipe(svgmin())
    .pipe(
      bytediff.stop(function(data) {
        return byteDiffCB(data);
      })
    )
    .pipe(gulp.dest("./dist"));
});

gulp.task("copy", () => {
  const target = [];
  target.push("src/**/*");
  for (i in conf) {
    for (var j in conf[i]) {
      target.push("!" + conf[i][j]);
    }
  }
  gulp.src(target).pipe(gulp.dest("./dist"));
});

// Clean output directory
gulp.task("clean", () => del(["dist"]));
gulp.task("print-size", function() {
  console.log("Total Savings: " + size(savings));
});

gulp.task("scripts", function() {
  runSequence("html", "css", "js", "lua");
});

gulp.task("resources", function() {
  runSequence("images", "svg", "obj");
});

gulp.task("files", function() {
  runSequence("scripts", "resources");
});
// Gulp task to minify all files
gulp.task("default", ["clean"], function() {
  runSequence("files", "copy", "print-size");
});
