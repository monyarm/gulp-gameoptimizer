
import { task, series, parallel, src, dest } from "gulp"
import conf from "@tasks/conf"
import { byteDiffCB } from "@tasks/util"
//@ts-ignore
import bytediff from "gulp-bytediff"
import plumber from "gulp-plumber"
//@ts-ignore
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
//@ts-ignore
import pngcrush from 'imagemin-pngcrush'
//@ts-ignore
import pngquant from 'imagemin-pngquant'


export default function image() {
    return src(conf["img"], {
        dot: true
    })
        .pipe(plumber({ errorHandler: false }))
        .pipe(bytediff.start())
        // Minify the file
        .pipe(imagemin([
            gifsicle({ interlaced: true, optimizationLevel: 3 }),
            mozjpeg({ quality: 95, progressive: true }),
            optipng({
                optimizationLevel: 7,
                interlaced: false
            }),
            pngcrush({ reduce: true }),
            pngquant({speed: 10, strip:true, quality:[1,1]}),
            svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        // Output
        .pipe(plumber.stop())
        .pipe(bytediff.stop(byteDiffCB))
        .pipe(dest("./dist"))
}
