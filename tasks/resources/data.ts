
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import prettyData from "gulp-pretty-data"

export default function data() {
  return src(conf["data"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(prettyData({
      type: 'minify',
      preserveComments: false,
      extensions: {
        'xlf': 'xml',
        'rss': 'xml',
        'svg': 'xml',
        'dae': 'xml'
      }
    }))
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
}
