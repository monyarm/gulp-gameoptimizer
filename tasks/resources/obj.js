
import gulp from "gulp"
import conf from "../conf.js"
import { byteDiffCB } from "../util.js"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import through from "through2"

function objMin(data) {
  var stringArray = data.split("\n");
  stringArray = stringArray
    .filter((n) => n[0] != "#")
    .filter((n) => n.trim() != "");
  for (var i = 0; i < stringArray.length; i++) {

    stringArray[i] = stringArray[i].split(" ");
    for (var j = 0; j < stringArray[i].length; j++) {
      if (!isNaN(stringArray[i][j])) {
        stringArray[i][j] = parseFloat(parseFloat(stringArray[i][j]).toFixed(2));
      }
    }
    stringArray[i] = stringArray[i].join(" ");
  }
  stringArray = stringArray.join("\n");

  return Buffer.from(stringArray, "utf8");
}

export default function obj() {
  return gulp.src(conf["obj"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        chunk._contents = objMin(chunk._contents.toString());
        cb(null, chunk);
      })
    )
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(gulp.dest("./dist"))
}
