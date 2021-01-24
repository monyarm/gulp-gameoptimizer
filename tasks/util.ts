
import {task,series,parallel,src,dest} from "gulp"
//@ts-ignore
import del =  require("del")
import * as fs from "fs"
//@ts-ignore
import size from "filesize"
import gutil, { colors } from "gulp-util"
import conf from "@tasks/conf"

var savings = 0;

export function byteDiffCB(data: { savings: number; startSize: number; endSize: number; fileName: string }) {
    
    var saved = data.savings > 0 ? " saved " : " gained ";
    var color = data.savings > 0 ? colors.green : colors.yellow;
    var start = size(data.startSize);
    var end = color(size(data.endSize));
    var report = " (" + start + " -> " + end + ")";
    savings += data.savings;
    return data.fileName + saved + size(Math.abs(data.savings)) + report;
}

export function copy(done: () => void) {
    const target = [];
    target.push("src/**/*");
    for (var i in conf) {
        for (var j in conf[i]) {
            target.push("!" + conf[i][j]);
        }
    }
    src(target).pipe(dest("./dist"));
    done();
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
    console.log("Required executables in PATH: php, upx(mac)");
};