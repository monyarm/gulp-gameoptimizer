require("ts-node/register")
require("tsconfig-paths/register")
import {task,series,parallel} from "gulp"

import "path"
import "map-stream"

import { init, copy, printSize, clean } from "@tasks/util"

import html from "@tasks/scripts/html"
import css from "@tasks/scripts/css"
import js from "@tasks/scripts/js"
import lua from "@tasks/scripts/lua"
import py from "@tasks/scripts/py"
import glsl from "@tasks/scripts/glsl"
import ftl from "@tasks/scripts/ftl"
import obj from "@tasks/resources/obj"
import data from "@tasks/resources/data"
import image from "@tasks/resources/image"
import upx from "@tasks/upx"
export {html,css,js,glsl,ftl, py,/*php,*/obj,data,image,upx}
//import php from "@tasks/scripts/php"

export const scripts = parallel(html, css, js, lua, py,/* php,*/ glsl , ftl);

export const resources = series(image, obj,data);

export const files = series(scripts, resources, upx);

// Gulp task to minify all files
task("default", series(init, files, copy, printSize, clean));
