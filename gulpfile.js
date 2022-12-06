var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    browserify = require('browserify'),
    buffer = require('gulp-buffer'),
    concat = require('gulp-concat'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    source     = require('vinyl-source-stream'),
    transform = require('vinyl-transform'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch');

/* Output .scss files to compressed and prefixed CSS */
gulp.task('styles', function() {
    gulp.src('./src/sass/styles.scss')
    	.pipe(
    		sass({ 
    			includePaths : ['./sass'] 
    		}))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ style: 'expanded' }))
	    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
	    .pipe(rename({suffix: '.min'}))
	    .pipe(minifycss())
        .pipe(gulp.dest('./public/dist/css'));
});

/* Transform JS modules into a script */
gulp.task('scripts', function() {
  return browserify({entries:['./src/js/app.js']})
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/js'))
});

/* Concatinate and minify vendor scripts aand styles */
gulp.task('javascript:vendor', function() {
  gulp.src([
        './src/vendor/*.js',
        './src/vendor/**/*.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/dist/js'));
});

gulp.task('css:vendor', function() {
    gulp.src('./src/vendor/*.css')
    .pipe(minifycss())
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('./public/dist/css'))
});

/* Images */
// Make this compress images in future versions
gulp.task('images', function() {
     gulp.src('./src/images/*')
        .pipe(gulp.dest('./public/dist/images'))
});

/* Watch task for development */
gulp.task('watch', function() {
 	gulp.watch('src/sass/**/*.scss',['styles']);
 	gulp.watch('src/js/**/*.js',['scripts']);
});

/* Default build task */
gulp.task('default', function() {
 	gulp.start('styles', 'scripts', 'javascript:vendor', 'css:vendor', 'images');
});
