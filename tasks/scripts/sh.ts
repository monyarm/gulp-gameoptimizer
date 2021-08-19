
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB, run } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import through from "through2"

function shMin(data: string) {
  return Buffer.from(data.split("\n").filter((n: string) => !(n.trim().startsWith('#')))
    .filter((n: string) => n.trim() != "").join("\n"), "utf8");
}
export default function sh() {
  return src(conf["sh"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        chunk._contents = shMin(chunk._contents.toString());
        cb(null, chunk);
      })
    )
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
}
