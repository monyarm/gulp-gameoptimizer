
import gulp from "gulp"
import conf from "../conf.js"
import { byteDiffCB } from "../util.js"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import * as glslman from "glsl-man"
import through from "through2"
import * as fs from "fs"



export default function glsl() {
  return gulp.src(conf["glsl"], {
    dot: true
  })
    .pipe(plumber())
    .pipe(bytediff.start())
    // Minify the file
    .pipe(
      through.obj(function (chunk, enc, cb) {
        doGLSL(chunk._contents, chunk.history[0]).then((data) => {
          chunk._contents = data;
          cb(null, chunk);
        })
      }))
    // Output    
    .pipe(plumber.stop())
    .pipe(bytediff.stop(byteDiffCB))
    .pipe(gulp.dest("./dist"))
}

async function doGLSL(code, path) {
  try {
    const minified = await (glslman.string(
      glslman.parse(code.toString()),
      { tab: '', space: '', newline: '' }
    ))
    return Promise.resolve(Buffer.from(minified, "utf8"))

  } catch (e) {
    return Promise.resolve(fs.readFileSync(path));
  }
}