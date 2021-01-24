
import {task,series,parallel,src,dest} from "gulp"
import conf from "@tasks/conf"
import {byteDiffCB} from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import luaminify from "gulp-luaminify"

export default function lua()  {
    return src(conf["lua"])
    .pipe(plumber({ errorHandler: false}))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(luaminify())
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
  }
