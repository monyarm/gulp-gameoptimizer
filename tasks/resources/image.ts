
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import imagemin from "gulp-imagemin-fix"


export default function image() {
    return src(conf["img"], {
        dot: true
    })
        .pipe(plumber({ errorHandler: false }))
        .pipe(bytediff.start())
        // Minify the file
        .pipe(imagemin())
        // Output
        .pipe(plumber.stop())
        .pipe(bytediff.stop(byteDiffCB))
        .pipe(dest("./dist"))
}
