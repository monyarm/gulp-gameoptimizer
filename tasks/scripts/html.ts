
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import htmlmin from "gulp-htmlmin"
//@ts-ignore
var minifyInline = require('gulp-minify-inline');

export default function html() {
  return src(conf["html"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    .pipe(minifyInline())
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true
      })
    )
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"));
}
