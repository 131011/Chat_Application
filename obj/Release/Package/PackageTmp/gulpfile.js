/// <reference path="C:\Users\devanshi.piprottar\Source\Repos\ShoppersDontStop\WebSocket_Angular2\WebSocket_Angular2\bootstrap/js/bootstrap.js" />
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var concatCss = require('gulp-concat-css');
//script paths
var jsFiles = ['node_modules/core-js/client/shim.min.js',
               'node_modules/zone.js/dist/zone.js',
               'node_modules/reflect-metadata/Reflect.js',
               'node_modules/systemjs/dist/system.src.js',
               'node_modules/jquery/dist/jquery.js',
               'systemjs.config.js',
               'node_modules/browser-sync/node_modules/socket.io-client/socket.io.js'];
var jsDest = 'public/script';

//stylesheet paths
var cssFiles = ['styles.css','bootstrap/css/bootstrap.css'];
var cssDest = 'public/css';

gulp.task('scripts', function () {
    return gulp.src(jsFiles)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsDest));
});
gulp.task('css', function () {
    return gulp.src(cssFiles)
        .pipe(concatCss('style.css'))
        .pipe(cleanCSS())
        .pipe(gulp.dest(cssDest));
});
gulp.task('default', [
    'scripts',
    'css'
]);