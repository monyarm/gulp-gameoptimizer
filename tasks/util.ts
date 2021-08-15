
import { task, series, parallel, src, dest } from "gulp"
//@ts-ignore
import del = require("del")
import * as fs from "fs"
//@ts-ignore
import size from "filesize"
import gutil, { colors } from "gulp-util"
import conf from "@tasks/conf"
//@ts-ignore
import { exec } from "child_process"
import { promisify } from "util"

var savings = 0;

export function byteDiffCB(data: { savings: number; startSize: number; endSize: number; fileName: string }) {

    var saved = data.savings >= 0 ? " saved " : " gained ";
    var color = data.savings >= 0 ? colors.green : colors.yellow;
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
    return src(target, {
        dot: true
    }).pipe(dest("./dist"));
};

// Clean output directory
export async function init(done: () => void) {
    await del(["dist"]);
    await del(["tmp"]);
    if (!fs.existsSync("tmp")) {
        fs.mkdir("tmp", () => { });
    }
    done();
};
export async function clean(done: () => void) {
    await del(["tmp"]);
    done();
};
export function printSize(done: () => void) {
    console.log("Total Savings: " + size(savings));
    done();
};

export function help() {
    console.log("Required executables in PATH: php, python3, upx(mac)");
};

const exec = promisify(require('child_process').exec);

export async function pyrun(path: string, command: string, args: string = "") {

    try {

        const { stdout, stderr } = await exec(`npm run -s nopy -- python_modules/bin/${command} ${args} "${path}"`);
        if (stderr.length > 0) {
            return Promise.resolve(fs.readFileSync(path));
        }
        return Promise.resolve(Buffer.from(stdout, "utf8"));
    } catch (e) {
        //console.log(e); 
        return Promise.resolve(fs.readFileSync(path));
    }
}