
import gulp from "gulp"
import conf from "../conf.js"
import { byteDiffCB } from "../util.js"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import through from "through2"

function shMin(data) {
  return Buffer.from(data.split("\n").filter((n) => !(n.trim().startsWith('#')))
    .filter((n) => n.trim() != "").join("\n"), "utf8");
}
export default function sh() {
  return gulp.src(conf["sh"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        chunk._contents = shMin(chunk._contents.toString());
        cb(null, chunk);
      })
    )
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(gulp.dest("./dist"))
}
