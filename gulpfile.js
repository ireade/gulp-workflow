const gulp = require('gulp'),
	  gutil = require('gulp-util');

const config = {
	srcDirectory: './src',
	distDirectory: './dist/assets'
};



/* *************
	CSS
************* */

const sassFiles = `${config.srcDirectory}/css/**/*.scss`;
const sassMainFile = `${config.srcDirectory}/css/main.scss`;

gulp.task('css', function() {

	const sass = require('gulp-sass'),
		  postcss = require('gulp-postcss'),
		  scss = require('postcss-scss'),
		  autoprefixer = require('autoprefixer');

	const postcssProcessors = [
		autoprefixer( {
			browsers: [
				'Explorer >= 11',
				'last 2 Explorer versions',
				'last 2 ExplorerMobile versions',
				'last 2 Edge versions',

				'last 2 Firefox versions',
				'last 2 FirefoxAndroid versions',

				'last 2 Chrome versions',
				'last 2 ChromeAndroid versions',

				'last 2 Safari versions',
				'last 2 iOS versions',

				'last 2 Opera versions',
				'last 2 OperaMini versions',
				'last 2 OperaMobile versions',

				'last 2 Android versions',
				'last 2 BlackBerry versions'
			]
		} )
	];

	gulp.src(sassMainFile)
		.pipe(
			postcss(postcssProcessors, {syntax: scss})
			.on('error', gutil.log)
		)
		.pipe(
			sass({ outputStyle: 'compressed' })
			.on('error', gutil.log)
		)
		.pipe(gulp.dest(`${config.distDirectory}/css`));
});




/* *************
	JS
************* */

const jsFiles = 'src/js/**/*.js';

gulp.task('js', function() {

	const concat = require('gulp-concat'),
		  uglify = require('gulp-uglifyjs'),
		  babel = require('gulp-babel');

	gulp.src(jsFiles)
		.pipe(
			babel({ presets: ['es2015'] })
			.on('error', gutil.log)
		)
		.pipe(uglify())
		.pipe(concat('script.js'))
		.pipe(gulp.dest('dist/assets/js'));
});


// LINTING
gulp.task('js-lint', function() {

	const eslint = require('gulp-eslint');

	return gulp.src(jsFiles)
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failOnError());
});

// TESTING
gulp.task('js-tests', function() {

	const jasmine = require('gulp-jasmine-phantom');
	const testFile = 'src/js/tests/test.js';

	gulp.src(testFile)
		.pipe(jasmine({
			integration: true,
			vendor: jsFiles
		}));
});



/* *************
	HTML
************* */

const htmlFiles = 'src/**/*.html';

gulp.task('html', function() {

	const minifyHTML = require('gulp-minify-html');	

	return gulp.src(htmlFiles)
		.pipe(minifyHTML({ empty: true }))
		.pipe(gulp.dest('dist'));
});



/* *************
	Images
************* */

const imageFiles = 'src/images/**/*.*'

gulp.task('images', function() {

	const imagemin = require('gulp-imagemin');

	gulp.src(imageFiles)
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'))
});




/* *************
	SERVER
************* */

gulp.task('connect', function() {

	const connect = require('gulp-connect');

	connect.server({
		port: 8000
	});
});

// OR

gulp.task('connectWithBrowserSync', function() {

	const browserSync = require('browser-sync');

	browserSync.create();
	browserSync.init({
		server: './dist'
	});
});



	



/* *************
	WATCH
************* */

gulp.task('watch', function() {
	gulp.watch(sassFiles,['css']); 
	gulp.watch(jsFiles,['js']); 
	gulp.watch(htmlFiles,['html']); 
	gulp.watch(imageFiles,['images']); 
});



/* *************
	DEFAULT
************* */
gulp.task('default', ['css', 'js', 'images', 'watch']);

