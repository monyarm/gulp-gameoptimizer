
import gulp from "gulp"
import conf from "../conf.js"
import { byteDiffCB } from "../util.js"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import htmlmin from "gulp-htmlmin"
//@ts-ignore
import * as minifyInline from 'gulp-minify-inline';

export default function html() {
  return gulp.src(conf["html"], {
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
    .pipe(gulp.dest("./dist"));
}
