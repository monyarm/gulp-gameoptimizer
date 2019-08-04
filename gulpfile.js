"use strict";

var gulp = require("gulp");

var csso = require("gulp-csso");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var terser = require("gulp-terser");
var bytediff = require("gulp-bytediff");
var imagemin = require("gulp-imagemin");
var svgmin = require("gulp-svgmin");
var luaminify = require("gulp-luaminify");
var glsl = require("gulp-glsl");
var ftlmin = require("gulp-ftlmin");
import { phpMinify } from "@cedx/gulp-php-minify";

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
  html: ["./src/**/*.html", "./src/**/*.htm"],
  css: ["./src/**/*.css"],
  lua: ["./src/**/*.lua"],
  svg: ["./src/**/*.svg"],
  glsl: ["./src/**/*.glsl"],
  ftl: ["./src/**/*.ftl"],
  php: ["./src/**/*.php"],

  img: [
    "./src/**/*.png",
    "./src/**/*.jpg",
    "./src/**/*.jpeg",
    "./src/**/*.gif"
  ],
  upx: [
    "./src/**/*.exe",
    "./src/**/*.dll",
    "./src/**/*.elf",
    "./src/**/*.pe",
    "./src/**/*.com",
    "./src/**/*.le",
    "./src/**/*.sys",
    "./src/**/SLUS*.*",
    "./src/**/SLEU*.*",
    "./src/**/SLJP*.*"
  ]
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

gulp.task("upx", function() {
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
    .pipe(bytediff.stop(byteDiffCB(data)))
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
    .pipe(bytediff.stop(byteDiffCB(data)))
    .pipe(gulp.dest("./dist"));
});

gulp.task("lua", function() {
  return gulp
    .src(conf["lua"])
    .pipe(bytediff.start())
    .pipe(luaminify())
    .pipe(bytediff.stop(byteDiffCB(data)))
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
      .pipe(bytediff.stop(byteDiffCB(data)))
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
      .pipe(terser())
      // Output
      .pipe(bytediff.stop(byteDiffCB(data)))
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
    .pipe(bytediff.stop(byteDiffCB(data)))
    .pipe(gulp.dest("./dist"));
});

gulp.task("image", () =>
  gulp
    .src(conf["img"])
    .pipe(bytediff.start())
    .pipe(imagemin())
    .pipe(bytediff.stop())
    .pipe(gulp.dest("./dist"))
);

gulp.task("svg", function() {
  return gulp
    .src(conf["svg"])
    .pipe(bytediff.start())
    .pipe(svgmin())
    .pipe(bytediff.stop(byteDiffCB(data)))
    .pipe(gulp.dest("./dist"));
});

gulp.task("glsl", function() {
  return gulp
    .src(conf["glsl"])
    .pipe(bytediff.start())
    .pipe(glsl())
    .pipe(bytediff.stop(byteDiffCB(data)))
    .pipe(gulp.dest("./dist"));
});

gulp.task("ftl", function() {
  return gulp
    .src(conf["ftl"])
    .pipe(bytediff.start())
    .pipe(ftlmin())
    .pipe(bytediff.stop(byteDiffCB(data)))
    .pipe(gulp.dest("./dist"));
});

gulp.task("php", function() {
  return gulp
    .src(conf["php"])
    .pipe(bytediff.start())
    .pipe(phpMinify({ silent: true }))
    .pipe(bytediff.stop(byteDiffCB(data)))
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
gulp.task("init", done => {
  del(["dist"]);
  del(["tmp"]);
  if (!fs.existsSync("tmp")) {
    fs.mkdirSync("tmp");
  }
  done();
});
gulp.task("print-size", function(done) {
  console.log("Total Savings: " + size(savings));
  done();
});

gulp.task(
  "scripts",
  gulp.parallel("html", "css", "js", "lua", "glsl", "ftl", "php")
);

gulp.task("help", function() {
  console.log("Required executables in PATH: php, upx(mac)");
});

gulp.task("resources", gulp.parallel("image", "svg", "obj"));

gulp.task("files", gulp.parallel("scripts", "resources", "upx"));
// Gulp task to minify all files
gulp.task("default", gulp.series("init", "files", "copy", "print-size"));
