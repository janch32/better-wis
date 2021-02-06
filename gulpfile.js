const gulp = require("gulp");
const sass = require("gulp-sass");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const tsify = require('tsify');

let buildDebug = true;

gulp.task("sass", () => gulp.src("style/**/*.scss")
	.pipe(sass({
		outputStyle: "compressed",
		sourceMapEmbed: buildDebug
	}))
	.pipe(gulp.dest("out/"))
);

gulp.task("browserify-typescript", () => browserify({ debug: buildDebug })
	.add("src/main.ts")
	.plugin(tsify, {
		module: "commonjs",
		target: "es6",
		lib: ["es6", "dom"],

		strict: true,
		noImplicitReturns: true,
		noImplicitAny: true,
		allowJs: false,
		removeComments: true,
		suppressImplicitAnyIndexErrors: true
	})
	.plugin("tinyify")
	.bundle()
	.pipe(source("main.js"))
	.pipe(buffer())
	.pipe(gulp.dest("out/"))
);

gulp.task("bundle-static", () => gulp.src("static/**/*")
	.pipe(gulp.dest("out"))
);

gulp.task("debug", (done) => {
	buildDebug = true;
	gulp.series("sass", "browserify-typescript", "bundle-static")();
	if(done) done();
});

gulp.task("release", (done) => {
	buildDebug = false;
	gulp.series("sass", "browserify-typescript", "bundle-static")();
	if(done) done();
});

gulp.task("watch", () => {
	gulp.task("debug")();
	gulp.watch("style/**/*.scss", { usePolling: true }, gulp.task("sass"));
	gulp.watch("src/**/*.ts", { usePolling: true }, gulp.series("browserify-typescript"));
	gulp.watch("static/**/*", { usePolling: true }, gulp.task("bundle-static"));
});
