
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
import through from "through2"

function objMin(data: string) {
  var stringArray: any = data.split("\n");
  stringArray = stringArray
    .filter((n: string[]) => n[0] != "#")
    .filter((n: string) => n.trim() != "");
  for (var i = 0; i < stringArray.length; i++) {

    stringArray[i] = stringArray[i].split(" ");
    for (var j = 0; j < stringArray[i].length; j++) {
      if (!isNaN(stringArray[i][j])) {
        stringArray[i][j] = parseFloat(parseFloat(stringArray[i][j]).toFixed(2));
      }
    }
    stringArray[i] = stringArray[i].join(" ");
  }
  stringArray = stringArray.join("\n");

  return Buffer.from(stringArray, "utf8");
}

export default function obj() {
  return src(conf["obj"])
    .pipe(plumber({ errorHandler: false }))
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        chunk._contents = objMin(chunk._contents.toString());
        cb(null, chunk);
      })
    )
    // Output
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(dest("./dist"))
}
