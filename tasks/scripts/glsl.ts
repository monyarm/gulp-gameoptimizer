
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import  glslmin from "gulp-glsl"


export default function glsl() {
  return src(conf["glsl"])
    .pipe(plumber({ errorHandler: false}))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(glslmin({ format: 'raw', ext: '.glsl' }))
    // Output    
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
}
