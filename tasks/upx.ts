
import {task,series,parallel,src,dest} from "gulp"
import conf from "@tasks/conf"
import {byteDiffCB} from "@tasks/util"
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
    .then(function(stats: any) {
      return Promise.resolve(fs.readFileSync(output)/*, output*/);
    })
    .catch(function(err: { message: string | string[] }) {
      if (err.message.includes("AlreadyPackedException")) {
      } else {
        console.log(err.message);
      }
      return Promise.resolve(fs.readFileSync(data.history[0])/*, data.history[0]*/);
    });
}


export default function upx()  {
    return src(conf["upx"])
    .pipe(plumber({ errorHandler: false}))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function(chunk, enc, cb) {
        callUPX(chunk)
          .then((data: any, path: any | undefined) => {
              chunk._contents = data
              chunk.history[1] = path != undefined ? path : chunk.history[0]
              cb(null, chunk)
            })
          .catch((err: any) => {
              console.log(err)
            });
      })
    )
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
  }
