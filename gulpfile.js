"use strict";

const gulp = require('gulp');
const argv = require('yargs').argv;
const shell = require('gulp-shell')
const runSequence = require('run-sequence');
const rimraf = require('rimraf'); // rimraf directly

const rollup = require('rollup');
const nodeResolve = require('rollup-plugin-node-resolve');
const commonjs = require("rollup-plugin-commonjs");
const css = require('rollup-plugin-css-only');
const alias = require('rollup-plugin-alias');
const uglify = require('rollup-plugin-uglify');
const sourcemaps = require('rollup-plugin-sourcemaps');
const watch = require('gulp-watch');

const bump = require('gulp-bump');
const filter = require('gulp-filter');
const git = require('gulp-git');
const replace = require('gulp-replace');
const tag_version = require('gulp-tag-version');

const dependencies = require("./package.json").dependencies;

//  Util  ---
function sequentialPromise(/*...*/) {
    return new Promise((resolve, reject) => {
        [].push.call(arguments, function (err, data) {
            resolve();
        });
        runSequence.apply(this, arguments);
    });
}

//  Clean  ---
function rmdir(dir) {
    return new Promise(function (resolve, reject) {
        rimraf(dir, function () {
            resolve();
        })
    });
}

gulp.task("clean", [], function () {
    return Promise.all([
        rmdir("dist"),
        rmdir("lib"),
        rmdir("lib-test"),
        rmdir("docx"),
        rmdir("coverage"),
        rmdir(".nyc_output")
    ]);
});

//  Compile  ---
gulp.task("compile-src", shell.task([
    "tsc -p ./tsconfig.json"
]));

gulp.task("compile-test", shell.task([
    "tsc -p ./tsconfig-test.json"
]));

gulp.task("compile-all", ["compile-src", "compile-test"]);

//  Docs  ---
gulp.task("docs", shell.task([
    "typedoc --target es6 --ignoreCompilerErrors --out ./docx/ ./src/index.ts"
]));

//  Bundle  ---
var cache;
function doRollup(entry, dest, format, min, external) {
    external = external || [];
    const plugins = [
        alias({}),
        nodeResolve({
            jsnext: true,
            main: true
        }),
        commonjs({}),
        css({}),
        sourcemaps()
    ];
    if (min) {
        plugins.push(uglify({}));
    }

    return rollup.rollup({
        entry: entry + ".js",
        external: external,
        cache: cache,
        plugins: plugins
    }).then(function (bundle) {
        cache = bundle;
        return bundle.write({
            format: format,
            moduleName: "HPCCComms",
            dest: dest + (min ? ".min" : "") + ".js",
            sourceMap: true
        });
    });
}

gulp.task("bundle-browser", function () {
    return Promise.all([
        doRollup("lib/index-browser", "dist/comms-browser", "umd", false),
        doRollup("lib/index-browser", "dist/comms-browser", "umd", true)
    ]);
});

gulp.task("bundle-node", function () {
    return Promise.all([
        doRollup("lib/index-node", "dist/comms-node", "cjs", false, Object.keys(dependencies)),
        doRollup("lib/index-node", "dist/comms-node", "cjs", true, Object.keys(dependencies))
    ]);
});

gulp.task("bundle-all", ["bundle-node", "bundle-browser"]);

gulp.task("build", function (cb) {
    return sequentialPromise("clean").then(() => {
        return Promise.all([
            sequentialPromise("compile-src", "bundle-all"),
            sequentialPromise("docs")
        ]);
    });
});

//  Watch for browser ---
gulp.task("compile-src-watch", shell.task([
    "tsc -w -p ./tsconfig.json"
]));

gulp.task('watch', function () {
    gulp.start("compile-src-watch");
    return watch('lib/**/*.js', function () {
        gulp.start("bundle-browser");
    });
});

//  Version Bumping  ---
gulp.task("bump-package", [], function () {
    var args = {};
    if (argv.version) {
        args.version = argv.version;
    } else if (argv.type) {
        args.type = argv.type;
    } else if (argv.major) {
        args.type = "major";
    } else if (argv.minor) {
        args.type = "minor";
    } else {
        args.type = "patch";
    }
    return gulp.src(["./package.json"])
        .pipe(bump(args))
        .pipe(gulp.dest("./"))
        ;
});

gulp.task("bump", ["bump-package"], function () {
    const npmPackage = require('./package.json');
    return gulp.src(["./src/index.ts"])
        .pipe(replace(/export const version = "(.*?)";/, "export const version = \"" + npmPackage.version + "\";"))
        .pipe(gulp.dest("./src/"))
        ;
});

//  GIT Tagging  ---
const TAG_FILES = ["./package.json", "./src/index.ts", "./dist", "./lib", "./docx"];
gulp.task("git-create-branch", function (cb) {
    var version = require("./package.json").version;
    git.checkout("b" + version, { args: "-b" }, cb);
});

gulp.task("git-add-dist", ["git-create-branch"], function (cb) {
    return gulp.src(TAG_FILES)
        .pipe(git.add({ args: "-f" }))
        ;
});

gulp.task("tag", ["git-add-dist"], function () {
    var version = require("./package.json").version;
    return gulp.src(TAG_FILES)
        .pipe(git.commit("Release " + version + "\n\nTag for release.\nAdd dist files.\n", { args: "-s" }))
        .pipe(filter("package.json"))
        .pipe(tag_version())
        ;
});

gulp.task("tag-release", ["tag"], function (cb) {
    var version = require("./package.json").version;
    var target = argv.upstream ? "upstream" : "origin"
    git.push(target, 'b' + version, function (err) {
        if (err) {
            cb(err);
        } else {
            git.push(target, 'v' + version, function (err) {
                cb(err);
            });
        }
    });
});
//  --- --- ---
