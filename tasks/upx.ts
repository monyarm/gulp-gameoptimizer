
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB, run } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import * as fs from "fs"
import through from "through2"
var UPX = require("upx")({});

function callUPX(data: { cwd: string; history: any[] }) {
  var output =
    data.cwd +
    "/tmp/" +
    data.history[0].substring(data.history[0].lastIndexOf("/") + 1);
  return UPX(data.history[0])
    .output(output)
    .start()
    .then(function () {
      return Promise.resolve({ bytes: fs.readFileSync(output), path: output });
    })
    .catch(function (err: { message: string | string[] }) {
      if (err.message.includes("AlreadyPackedException") || err.message.includes("CantPackException")) {
      } else {
        console.log("\n")
        console.log(err.message);
      }
      return Promise.resolve({ bytes: fs.readFileSync(data.history[0]), path: data.history[0] });
    });
}


export default function upx() {
  return src(conf["upx"], {
    dot: true
  })
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    
    .pipe(
      through.obj(function (chunk, enc, cb) {
        run(chunk.history[0], "upx", "", `-o "${chunk.cwd}/tmp/${chunk.history[0].substring(chunk.history[0].lastIndexOf("/") + 1)}"`).then((data) => {
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
