const { src, dest, series, parallel, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer').default;
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const del = require('del');

const paths = {
  html: 'src/**/*.html',
  styles: 'src/scss/**/*.scss',
  scripts: 'src/js/**/*.js',
  images: 'src/images/**/*',
  dist: 'dist'
};

function clean() {
  return del.deleteAsync([paths.dist]);
}

function html() {
  return src(paths.html).pipe(dest(paths.dist)).pipe(browserSync.stream());
}

function styles() {
  return src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist + '/css'))
    .pipe(browserSync.stream());
}

function scripts() {
  return src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist + '/js'))
    .pipe(browserSync.stream());
}

function images() {
  return src(paths.images).pipe(imagemin()).pipe(dest(paths.dist + '/images'));
}

function serve() {
  browserSync.init({
    server: { baseDir: paths.dist },
    notify: false,
    open: false
  });
  watch(paths.html, html);
  watch(paths.styles, styles);
  watch(paths.scripts, scripts);
}

const build = series(clean, parallel(html, styles, scripts, images));

exports.clean = clean;
exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.default = series(build, serve);


