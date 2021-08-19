
import gulp from "gulp"
import conf from "./conf.js"
import { byteDiffCB, run } from "./util.js"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import through from "through2"

export default function upx() {
  return gulp.src(conf["upx"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        run(chunk.history[0], "upx", "", `-o "${chunk.cwd}/tmp/${chunk.history[0].substring(chunk.history[0].lastIndexOf("/") + 1)}"`).then((data) => {
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
