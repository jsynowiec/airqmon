const gulp = require('gulp');
const cache = require('gulp-cached');
const electron = require('electron-connect').server.create();
const electronPackager = require('electron-packager');
const less = require('gulp-less');
const del = require('del');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const gulpTslint = require('gulp-tslint');
const tslint = require('tslint');
const useref = require('gulp-useref');

function restartElectron() {
  electron.restart();
  done();
}

function reloadElectron(done) {
  electron.reload();
  done();
}

function clean() {
  return del(['out', 'build', 'coverage', '*.log']);
}

function lint() {
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
}

gulp.task('build:scripts:renderer', () => {
  const tsProject = ts.createProject('tsconfig.json');
  const tsResult = gulp
    .src(['src/**/*.{ts,tsx}', '!src/main.ts', '!**/*.d.ts'])
    .pipe(cache('scripts'))
    .pipe(sourcemaps.init())
    .pipe(tsProject());

  return tsResult.js
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../src' }))
    .pipe(gulp.dest('build'));
});

gulp.task('build:scripts:main', () => {
  const tsProject = ts.createProject('tsconfig.json');
  const tsResult = gulp
    .src(['src/main.ts'])
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

function package() {
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
}

exports.clean = clean;

exports.lint = lint;

exports.build = gulp.series(
  clean,
  lint,
  gulp.parallel('build:scripts:main', 'build:scripts:renderer', 'build:html', 'build:styles'),
);

exports.release = gulp.series(
  clean,
  lint,
  gulp.parallel('build:scripts:release', 'build:html:release', 'build:styles'),
  package,
);

exports.watch = () => {
  electron.start();

  gulp.watch(
    ['src/**/*.{ts,tsx}', '!src/main.ts', '!src/**/*.d.ts'],
    gulp.series('build:scripts:renderer'),
  );
  gulp.watch(['src/main.ts', '!src/**/*.d.ts'], gulp.series('build:scripts:main'));
  gulp.watch('src/**/*.html', gulp.series('build:html'));
  gulp.watch('src/**/*.less', gulp.series('build:styles'));

  gulp.watch('build/main.js', restartElectron);
  gulp.watch(
    ['build/**/*.js', '!build/main.js', 'build/**/*.html', 'build/**/*.css'],
    reloadElectron,
  );
};
