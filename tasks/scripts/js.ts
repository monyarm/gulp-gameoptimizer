
import {task,series,parallel,src,dest} from "gulp"
import conf from "@tasks/conf"
import {byteDiffCB} from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import terser from "gulp-terser"

export default function js()  {
    return src(conf["js"])
    .pipe(plumber({ errorHandler: false}))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(terser())
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
  }
