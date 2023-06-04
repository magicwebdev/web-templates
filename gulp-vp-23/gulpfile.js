const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const spriteSvg = require('gulp-svg-sprite');

function images() {
    return src(['src/images/src/*.*', '!src/images/src/*.svg'])
        .pipe(newer('src/images/dist'))
        .pipe(avif({ quality: 50 }))

        .pipe(src('src/images/src/*.*'))
        .pipe(newer('src/images/dist'))
        .pipe(webp())

        .pipe(src('src/images/src/*.*'))
        .pipe(newer('src/images/dist'))
        .pipe(imagemin())

        .pipe(dest('src/images/dist'));
}

function sprite() {
  return src('src/images/dist/*.svg')
  .pipe(spriteSvg({
    mode: {
      stack: {
        sprite: '../sprite.svg',
        example: true
      }
    }
  }))
  .pipe(dest('src/images/dist/sprite'))
}

function styles() {
    return src('src/scss/style.scss')
        .pipe(autoprefixer())
        .pipe(concat('style.min.css'))
        .pipe(scss({ outputStyle: 'compressed' }))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(['node_modules/swiper/swiper-bundle.js', 'src/js/main.js'])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream());
}

function watching() {
    browserSync.init({
        server: {
            baseDir: 'src/',
        },
    });
    watch(['src/images/src'], images);
    watch(['src/scss/style.scss'], styles);
    watch(['src/js/main.js'], scripts);
    watch(['src/**/*.html']).on('change', browserSync.reload);
}

function cleaning() {
    return src('dist').pipe(clean());
}

function building() {
    return src([
      'src/css/style.min.css',
      'src/images/dist/*.*',
      'src/js/main.min.js',
      'src/**/*.html'
    ], {
        base: 'src',
    }).pipe(dest('dist'));
}

exports.images = images;
exports.sprite = sprite;
exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;

exports.build = series(cleaning, building);

exports.default = parallel(images, styles, scripts, watching);
