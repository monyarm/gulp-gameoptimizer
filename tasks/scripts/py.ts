
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import * as fs from "fs"
import through from "through2"
import util from "util"
const exec = util.promisify(require('child_process').exec);

async function pyminify(data: {cwd: string, history: any[] }) {

  try {

    const { stdout, stderr } = await exec("npm run -s nopy -- python_modules/bin/pyminify \"" + data.history[0] + "\"");

    return Promise.resolve(Buffer.from(stdout, "utf8"));
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}


export default function py() {
  return src(conf["py"])
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        pyminify(chunk).then((data) => {

          chunk._contents = data;
          cb(null, chunk);
        })
      })
    )
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
}
