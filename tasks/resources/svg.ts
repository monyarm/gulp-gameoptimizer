
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import svgmin from "gulp-svgmin"


export default function svg() {
  return src(conf["svg"])
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(svgmin())
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
}
