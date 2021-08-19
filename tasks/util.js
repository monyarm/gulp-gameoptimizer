
import gulp from "gulp"
//@ts-ignore
import del from "del"
import * as fs from "fs"
//@ts-ignore
import size from "filesize"
import gutil from "gulp-util"
import conf from "./conf.js"
//@ts-ignore
import { promisify } from "util"
import { exec } from "child_process"

var savings = 0;

export function byteDiffCB(data) {

    var saved = data.savings >= 0 ? " saved " : " gained ";
    var color = data.savings >= 0 ? gutil.colors.green : gutil.colors.yellow;
    var start = size(data.startSize);
    var end = color(size(data.endSize));
    var report = " (" + start + " -> " + end + ")";
    savings += data.savings;
    return data.fileName + saved + size(Math.abs(data.savings)) + report;
}

export function copy() {
    const target = [];
    target.push("./src/**/*");
    for (var i in conf) {
        for (var j in conf[i]) {
            if (conf[i][j][0] != "!"){
                target.push("!" + conf[i][j]);
            }
        }
    }
    return gulp.src(target, {
        dot: true
    }).pipe(gulp.dest("./dist"));
};

// Clean output directory
export async function init(done) {
    await del(["dist"]);
    await del(["tmp"]);
    if (!fs.existsSync("tmp")) {
        fs.mkdir("tmp", () => { });
    }
    done();
};
export async function clean(done) {
    await del(["tmp"]);
    done();
};
export function printSize(done) {
    console.log("Total Savings: " + size(savings));
    done();
};

export function help() {
    console.log("Required executables in PATH: python3, upx");
};

const _exec = promisify(exec);

export async function run(path, command, args = "", args2= "") {

    try {

        const { stdout, stderr } = await _exec(`${command} ${args} "${path}" ${args2}`);
        if (stderr.length > 0) {
            return Promise.resolve(fs.readFileSync(path));
        }
        return Promise.resolve(Buffer.from(stdout, "utf8"));
    } catch (e) {
        //console.log(e); 
        return Promise.resolve(fs.readFileSync(path));
    }
}

export async function pyrun(path, command, args = "", args2 = "") {

    return run(path, `npm run -s nopy -- python_modules/bin/${command}`,args, args2)
}