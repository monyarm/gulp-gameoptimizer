
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB, pyrun } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import through from "through2"

export default function py() {
  return src(conf["py"], {
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
    .pipe(dest("./dist"))
}
