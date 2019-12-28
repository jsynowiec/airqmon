const packager = require('electron-packager');
const path = require('path');
const pkg = require('../package');

packager({
  dir: path.join(__dirname, '..'),
  name: 'Airqmon',
  appBundleId: `app.airqmon`,
  icon: path.join(__dirname, '..', 'assets', 'airqmon'),
  appCategoryType: 'public.app-category.weather',
  ignore: ['^/src', '^/__tests__', '^/coverage'],
  asar: true,
  overwrite: true,
  packageManager: 'yarn',
  out: path.join(__dirname, '..', 'out'),
  arch: 'x64',
  platform: 'darwin',
  darwinDarkModeSupport: true,
  electronVersion: pkg.electronVersion,
}).then((res) => {
  process.exit(0);
});
