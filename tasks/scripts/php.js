
import gulp from "gulp"
import conf from "../conf.js"
import { byteDiffCB } from "../util.js"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import { phpMinify } from "@cedx/gulp-php-minify"

export default function php() {
  return gulp.src(conf["php"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(phpMinify())
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(gulp.dest("./dist"))
}
