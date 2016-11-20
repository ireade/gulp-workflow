const gulp = require('gulp'),
	  gutil = require('gulp-util');

const config = {
	srcDirectory: './src',
	distDirectory: './dist/assets'
};

config.css = {
	mainFile: `${config.srcDirectory}/css/main.scss`,
	allFiles: `${config.srcDirectory}/css/**/*.scss`,
	dist: `${config.distDirectory}/css`
}










/* *************
	CSS
************* */

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

	gulp.src(config.css.mainFile)
		.pipe(
			postcss(postcssProcessors, {syntax: scss})
			.on('error', gutil.log)
		)
		.pipe(
			sass({ outputStyle: 'compressed' })
			.on('error', gutil.log)
		)
		.pipe(gulp.dest(config.css.dist));
});




/* *************
	JS
************* */

const concat = require('gulp-concat'),
	  uglify = require('gulp-uglifyjs'),
	  babel = require('gulp-babel');

const jsFiles = 'src/js/**/*.js';

gulp.task('js', function() {
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

const eslint = require('gulp-eslint');

gulp.task('lint', function() {
	return gulp.src(jsFiles)
		.pipe(eslint())

		.pipe(eslint.format())

		.pipe(eslint.failOnError());
});

// // TESTING

// const jasmine = require('gulp-jasmine-phantom');
// const testFile = 'src/js/tests/test.js';

// gulp.task('tests', function() {
// 	gulp.src(testFile)
// 		.pipe(jasmine({
// 			integration: true,
// 			vendor: jsFiles
// 		}));
// });



/* *************
	HTML
************* */

const minifyHTML = require('gulp-minify-html');

const htmlFiles = 'src/html/**/*.html';

gulp.task('minify-html', function() {
	return gulp.src(htmlFiles)
		.pipe(minifyHTML({ empty: true }))
		.pipe(gulp.dest('dist'));
});


/* *************
	Images
************* */

const imagemin = require('gulp-imagemin');

gulp.task('images', () =>
    gulp.src('src/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'))
);




/* *************
	SERVER
************* */

// const connect = require('gulp-connect');

// gulp.task('images', function() {
// 	connect.server({
// 		port: 8000
// 	});
// });

// // OR

// const browserSync = require('browser-sync');

// gulp.task('connectWithBrowserSync', function() {

// 	browserSync.create();
// 	browserSync.init({
// 		server: './dist'
// 	});

// });



	



/* *************
	WATCH
************* */

gulp.task('watch', function() {
	gulp.watch(sassFiles,['css']).on('change', browserSync.reload); 
	gulp.watch(jsFiles,['js', 'lint']); 
});



/* *************
	DEFAULT
************* */
gulp.task('default', ['css', 'js', 'images', 'watch']);

