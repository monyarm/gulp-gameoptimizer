require("ts-node/register")
require("tsconfig-paths/register")
import {task,series,parallel} from "gulp"

import "path"
import "map-stream"

import { init, copy, printSize, clean } from "@tasks/util"

import _html from "@tasks/scripts/html"
export const html = _html;
import _css from "@tasks/scripts/css"
export const css = _css;
import _js from "@tasks/scripts/js"
export const js = _js;
import _json from "@tasks/scripts/json"
export const json = _json;
import _lua from "@tasks/scripts/lua"
export const lua = _lua;
import _glsl from "@tasks/scripts/glsl"
export const glsl = _glsl;
import _ftl from "@tasks/scripts/ftl"
export const ftl = _ftl;
import _obj from "@tasks/resources/obj"
export const obj = _obj;
import _svg from "@tasks/resources/svg"
export const svg = _svg;
import _image from "@tasks/resources/image"
export const image = _image;
import _upx from "@tasks/upx"
export const upx = _upx;
//import php from "@tasks/scripts/php"

export const scripts = parallel(html, css, js, json, lua, /*php*/ glsl , ftl);

export const resources = series(image, svg, obj);

export const files = series(scripts, resources, upx);

// Gulp task to minify all files
task("default", series(init, files, copy, printSize, clean));