
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import { phpMinify } from "@cedx/gulp-php-minify"

export default function php() {
  return src(conf["php"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(phpMinify())
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
}
