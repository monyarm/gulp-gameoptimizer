const conf: Record<string,Array<string>> = {
    obj: ["./src/**/*.obj","./src/**/*.mtl"],
    js: ["./src/**/*.js"],
    html: ["./src/**/*.html", "./src/**/*.htm"],
    css: ["./src/**/*.css"],
    lua: ["./src/**/*.lua"],
    glsl: ["./src/**/*.glsl"],
    ftl: ["./src/**/*.ftl"],
    php: ["./src/**/*.php"],
    py: ["./src/**/*.py"],

    img: [
        "./src/**/*.png",
        "./src/**/*.jpg",
        "./src/**/*.jpeg",
        "./src/**/*.jpe",
        "./src/**/*.gif"
    ],
    data: [
        "./src/**/*.svg",
        "./src/**/*.json",
        "./src/**/*.xml",
        "./src/**/*.dae",
        "./src/**/*.xlf",
        "./src/**/*.rss"
    ],
    upx: [
        "./src/**/*.exe",
        "./src/**/*.dll",
        "./src/**/*.elf",
        "./src/**/*.pe",
        "./src/**/*.com",
        "./src/**/*.le",
        "./src/**/*.sys",
        "./src/**/*.so",
        "./src/**/SLUS*.*",
        "./src/**/SLEU*.*",
        "./src/**/SLJP*.*"
    ]
};
export default conf;

