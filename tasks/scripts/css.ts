
import {task,series,parallel,src,dest} from "gulp"
import conf from "@tasks/conf"
import {byteDiffCB} from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import cleancss from "gulp-clean-css"

export default function css()  {
    return src(conf["css"])
    .pipe(plumber({ errorHandler: false}))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(cleancss())
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
  }
