const { promisify } = require('util');

const cache = require('gulp-cached');
const electron = require('electron-connect').server.create();
const electronPackager = require('electron-packager');
const gulp = require('gulp');
const gulpSequence = require('gulp-sequence');
const less = require('gulp-less');
const del = require('del');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const gulpTslint = require('gulp-tslint');
const tslint = require('tslint');
const useref = require('gulp-useref');

gulp.task('clean', (cb) => {
  return del(['out', 'build', 'coverage', '*.log']);
});

gulp.task('tslint', () => {
  const program = tslint.Linter.createProgram('tsconfig.release.json');

  return gulp
    .src(['src/**/*.{ts,tsx}', '!**/*.d.ts'])
    .pipe(
      gulpTslint({
        program,
      }),
    )
    .pipe(
      gulpTslint.report({
        summarizeFailureOutput: true,
      }),
    );
});

gulp.task('build:scripts', () => {
  const tsProject = ts.createProject('tsconfig.json');
  const tsResult = gulp
    .src(['src/**/*.{ts,tsx}', '!**/*.d.ts'])
    .pipe(cache('scripts'))
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return tsResult.js
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
    .pipe(gulp.dest('build'));
});

gulp.task('build:scripts:release', () => {
  const tsProject = ts.createProject('tsconfig.release.json');
  const tsResult = gulp.src(['src/**/*.{ts,tsx}', '!**/*.d.ts']).pipe(tsProject());

  return tsResult.js.pipe(gulp.dest('build'));
});

gulp.task('build:html', () => {
  return gulp
    .src('src/**/*.html')
    .pipe(cache('html'))
    .pipe(gulp.dest('build'));
});

gulp.task('build:html:release', () => {
  return gulp
    .src('src/**/*.html')
    .pipe(useref())
    .pipe(gulp.dest('build'));
});

gulp.task('build:styles', () => {
  return gulp
    .src('src/**/index.less')
    .pipe(less())
    .pipe(gulp.dest('build'));
});

gulp.task('watch', ['build'], () => {
  gulp.watch(['src/**/*.{ts,tsx}', '!**/*.d.ts'], ['build:scripts']);
  gulp.watch(['src/**/*.html'], ['build:html']);
  gulp.watch(['src/**/*.less'], ['build:styles']);

  gulp.watch(['build/**/*.js'], electron.restart);
  gulp.watch(['build/index.css'], electron.reload);
  gulp.watch(['build/**/*.html'], electron.reload);
});

gulp.task('electron:start', () => {
  electron.start();
});

gulp.task('electron:package', () => {
  return electronPackager({
    name: 'Airqmon',
    appCategoryType: 'public.app-category.weather',
    dir: './',
    ignore: ['^/src', '^/__tests__', '^/coverage'],
    asar: true,
    icon: './assets/airqmon.icns',
    overwrite: true,
    packageManager: 'yarn',
    out: './out',
    arch: 'x64',
    platform: 'darwin',
    darwinDarkModeSupport: true,
  });
});

gulp.task('build', gulpSequence('clean', ['build:scripts', 'build:html', 'build:styles']));
gulp.task(
  'build:release',
  gulpSequence('clean', ['build:scripts:release', 'build:html:release', 'build:styles']),
);
gulp.task('start', gulpSequence('watch', 'electron:start'));
gulp.task('package', gulpSequence('build:release', 'electron:package'));
