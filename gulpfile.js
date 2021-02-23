var gulp = require("gulp");
//环境移到浏览器环境
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
// 后台帮编译
var watchify = require("watchify");
var gutil = require("gulp-util");
//混淆压缩代码
var uglify = require("gulp-uglify");
var sourcemaps = require("gulp-sourcemaps");
var buffer = require("vinyl-buffer");

var paths = {
    pages: ["src/*.html"],
};

var watchedBrowserify = watchify(
    browserify({
        basedir: ".",
        debug: true,
        entries: ["src/main.ts"],
        cache: {},
        packageCache: {},
    }).plugin(tsify)
);

function copyHtml() {
    return gulp.src(paths.pages).pipe(gulp.dest("dist"));
}
function bundle() {
    return (
        watchedBrowserify
            .transform("babelify", {
                presets: ["@babel/preset-env"],
                extensions: [".ts"],
            })
            .bundle()
            .pipe(source("bundle.js"))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            // .pipe(uglify())
            .pipe(sourcemaps.write("./"))
            .pipe(gulp.dest("dist"))
    );
}

exports.default = gulp.series(copyHtml, bundle);

watchedBrowserify.on("update", bundle);
watchedBrowserify.on("log", gutil.log);
