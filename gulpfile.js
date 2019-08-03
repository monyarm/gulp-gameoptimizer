"use strict";

var gulp = require("gulp");

var csso = require("gulp-csso");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");
var bytediff = require("gulp-bytediff");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var luaminify = require("gulp-luaminify");
var through = require("through2");
var UPX = require("upx")({});
var size = require("filesize"),
  gutil = require("gulp-util"),
  path = require("path"),
  map = require("map-stream");
var fs = require("fs");
const conf = {
  obj: ["./src/**/*.obj"],
  js: ["./src/**/*.js"],
  html: ["./src/**/*.html"],
  css: ["./src/**/*.css"],
  lua: ["./src/**/*.lua"],
  svg: ["./src/**/*.svg"],
  img: [
    "./src/**/*.png",
    "./src/**/*.jpg",
    "./src/**/*.jpeg",
    "./src/**/*.gif"
  ],
  upx: ["./src/**/*.exe", "./src/**/*.dll"]
};

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

function callUPX(data) {
  var output =
    data.cwd +
    "/tmp/" +
    data.history[0].substring(data.history[0].lastIndexOf("/") + 1);
  return UPX(data.history[0])
    .output(output)
    .start()
    .then(function(stats) {
      return Promise.resolve(fs.readFileSync(output), output);
    })
    .catch(function(err) {
      if (err.message.includes("AlreadyPackedException")) {
      } else {
        console.log(err.message);
      }
      return Promise.resolve(fs.readFileSync(data.history[0]), data.history[0]);
    });
}

gulp.task("_upx", function() {
  return gulp
    .src(conf["upx"])
    .pipe(bytediff.start())
    .pipe(
      through.obj(function(chunk, enc, cb) {
        callUPX(chunk)
          .then(function(data, path) {
            chunk._contents = data;
            chunk.history[1] = path != undefined ? path : chunk.history[0];
            cb(null, chunk);
          })
          .catch(function(err) {
            console.log(err);
          });
      })
    )
    .pipe(
      bytediff.stop(function(data) {
        return byteDiffCB(data);
      })
    )
    .pipe(gulp.dest("./dist"));
});
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
      .src(conf["js"])
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
    .src(conf["html"])
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

gulp.task("copy", done => {
  const target = [];
  target.push("src/**/*");
  for (var i in conf) {
    for (var j in conf[i]) {
      target.push("!" + conf[i][j]);
    }
  }
  gulp.src(target).pipe(gulp.dest("./dist"));
  done();
});

// Clean output directory
gulp.task("clean", done => {
  del(["dist"]);
  done();
});
gulp.task("cleantmp", done => {
  del(["tmp"]);
  done();
});
gulp.task("mktmp", done => {
  if (!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
  }
  done();
});
gulp.task("print-size", function(done) {
  console.log("Total Savings: " + size(savings));
  done();
});
gulp.task("upx", gulp.series("mktmp", "_upx", "cleantmp"));

gulp.task("scripts", gulp.parallel("html", "css", "js", "lua"));

gulp.task("resources", gulp.parallel("image", "svg", "obj"));

gulp.task("files", gulp.parallel("scripts", "resources", "upx"));
// Gulp task to minify all files
gulp.task("default", gulp.series("clean", "files", "copy", "print-size"));
