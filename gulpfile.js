"use strict";

const gulp = require("gulp");
const tslint = require("gulp-tslint");
const tsc = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const mocha = require("gulp-mocha");
const istanbul = require("gulp-istanbul");
const runSequence = require("run-sequence");
const copy = require("gulp-copy");
const clean = require("gulp-clean");
const nodemon = require("gulp-nodemon");
const tsProject = tsc.createProject("tsconfig.json");

// Lint source files
gulp.task("lint", () => {
  return gulp.src([
    "./src/**/*.ts",
    "./src/test/**/**.spec.ts"
  ])
    .pipe(tslint({ formatter: "verbose" }))
    .pipe(tslint.report());
})

// Copy static stuff
gulp.task("copy", () => {
  return gulp.src(["./views/**.*"])
    .pipe(copy("./dist/"));
})

// Compile app
gulp.task("build", () => {
  return gulp.src([
    "./src/**/*.ts",
  ])
    .pipe(tsProject())
    .on("error", err => process.exit(1))
    .js
    .pipe(gulp.dest("./dist/"));
})

// Istanbul test coverage hook
gulp.task("istanbul:hook", () => {
  return gulp.src(["./dist/**/**.js"])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
})

// Run Mocha tests
gulp.task("mocha", () => {
  return gulp.src("./dist/test/**/*.spec.js")
    .pipe(mocha({ ui: "tdd" }))
    .pipe(istanbul.writeReports())
})

// Remove distributive files
gulp.task("clean", () => {
  return gulp.src(["./dist", "./coverage"])
    .pipe(clean());
})

// Run test cases
gulp.task(
  "test",
  gulp.series("istanbul:hook", "mocha")
)

gulp.task(
  "default",
  gulp.series( gulp.parallel("lint", "copy"), "build", "test")
)

gulp.task("dev", () => {
  const stream = nodemon({
    script: "./bin/www",
    ext: "ts pug",
    watch: "src",
    tasks: ["default"]
  });

  stream
    .on("restart", () => console.log("Server restarted!"))
    .on("crash", () => {
      console.error("Application has crashed!");
      stream.emit("restart", 10);
    })
})