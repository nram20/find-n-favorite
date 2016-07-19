'use strict';

const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const del = require('del');
const uglify = require('gulp-uglify');
const ngAnnotate = require('gulp-ng-annotate');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browser = require('browser-sync');
const eslint = require('gulp-eslint');
// if wanting to run nodemon in gulp,
// need to npm i --save gulp-nodemon
// const nodemon = require('gulp-nodemon');

const paths = {
	html: {
		input: 'client/html/**/*.html',
		output: 'public/html'
	},
	js: {
		input: 'client/js/**/*.js',
		output: 'public/js'
	},
	css: {
		input: ['client/css/**/*.scss', 'client/css/**/*.sass'],
		output: 'public/css'
	},
	favicon: {
		input: 'client/favicon.ico',
		output: 'public'
	},
	font: {
		input: ['client/font/**/*.ttf', 'client/font/**/*.otf'],
		output: 'public/font'
	}
};

// add serve if wanting to run nodemon in gulp
gulp.task('default', ['build', 'watch', 'serve']);

gulp.task('build', ['html', 'css', 'js', 'font', 'favicon']);

gulp.task('watch', ['watch:html', 'watch:css', 'watch:js', 'watch:font']);

// LINTER
gulp.task('watch:lint', ['lint'], function() {
	return gulp.watch(['**/*.js', '!node_modules/**', '!public/**'], ['lint'])
});

gulp.task('lint', function() {
	// lint all server js and front-end angular code
	return gulp.src(['**/*.js', '!node_modules/**', '!public/**'])
		.pipe(eslint())
		.pipe(eslint.format())
})

// BROWSER SYNC
gulp.task('serve', function() {
	browser.init({
		proxy: "http://localhost:8000",
		files: ['public/**/*.*']
	});
});

// NODEMON
gulp.task('nodemon', function() {
	return nodemon({
		ignore: ['./client', './public']
	});
});

// FAVICON
gulp.task('favicon', function() {
	return gulp.src(paths.favicon.input)
		.pipe(gulp.dest(paths.favicon.output));
});

////////////////// HTML ///////////////////////

gulp.task('html', ['clean:html'], function() {
	return gulp.src(paths.html.input)
		.pipe(gulp.dest(paths.html.output));
});

gulp.task('clean:html', function() {
	return del([paths.html.output]);
})

gulp.task('watch:html', function() {
	gulp.watch(paths.html.input, ['html']);
});

////////////////// JS ///////////////////////

gulp.task('js', ['clean:js'], function() {
	return gulp.src(paths.js.input)
		// console log errors in terminal w/o crashing gulp
		.pipe(plumber())
		// initialize sourcemaps
		.pipe(sourcemaps.init())
		// convert to es5
		.pipe(babel({
			presets: ['es2015']
		}))
		// annotate angular files
		.pipe(ngAnnotate())
		// concat all js files into bundle.js
		.pipe(concat('bundle.js'))
		// minify code
		// .pipe(uglify())
		// write source maps to result of piping (bundle.js)
		.pipe(sourcemaps.write())
		// write to public/js
		.pipe(gulp.dest(paths.js.output));
});

gulp.task('clean:js', function() {
	return del([paths.js.output]);
});

gulp.task('watch:js', function() {
	gulp.watch(paths.js.input, ['js']);
});

////////////////// CSS /////////////////////

gulp.task('css', ['clean:css'], function() {
	return gulp.src(paths.css.input)
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest(paths.css.output));
});

gulp.task('clean:css', function() {
	return del([paths.css.output]);
});

gulp.task('watch:css', function() {
	gulp.watch(paths.css.input, ['css']);
});

///////////// PERSONAL FONT ////////////////

gulp.task('font', ['clean:font'], function() {
	return gulp.src(paths.font.input)
		.pipe(gulp.dest(paths.font.output));
});

gulp.task('clean:font', function() {
	return del([paths.font.output]);
})

gulp.task('watch:font', function() {
	gulp.watch(paths.font.input, ['font']);
});
