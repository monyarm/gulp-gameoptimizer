const conf: Record<string,Array<string>> = {
    obj: ["./src/**/*.obj","./src/**/*.mtl"],
    js: ["./src/**/*.js"],
    json: ["./src/**/*.json"],
    html: ["./src/**/*.html", "./src/**/*.htm"],
    css: ["./src/**/*.css"],
    lua: ["./src/**/*.lua"],
    svg: ["./src/**/*.svg"],
    glsl: ["./src/**/*.glsl"],
    ftl: ["./src/**/*.ftl"],
    php: ["./src/**/*.php"],

    img: [
        "./src/**/*.png",
        "./src/**/*.jpg",
        "./src/**/*.jpeg",
        "./src/**/*.gif"
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

