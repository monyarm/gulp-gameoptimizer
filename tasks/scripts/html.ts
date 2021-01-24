
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import htmlmin from "gulp-htmlmin"
//@ts-ignore
import minifyinline from "gulp-minify-inline"

export default function html() {
  return src(conf["html"])
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    .pipe(minifyinline)
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"));
}
