
import gulp from "gulp"
import conf from "../conf.js"
import { byteDiffCB, pyrun } from "../util.js"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import through from "through2"

export default function py() {
  return gulp.src(conf["py"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        pyrun(chunk.history[0], "pyminifier", "-O").then((data) => {
          chunk._contents = data;
          cb(null, chunk);
        })
      })
    )
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(gulp.dest("./dist"))
}
