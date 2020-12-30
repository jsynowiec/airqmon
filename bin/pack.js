const packager = require('electron-packager');
const path = require('path');
const pkg = require('../package');

async function bundleElectronApp(options) {
  const appPaths = await packager(options);
  console.log(`Electron app bundles created:\n${appPaths.join('\n')}`);
}

(async () => {
  await bundleElectronApp({
    dir: path.join(__dirname, '..'),
    name: 'Airqmon',
    appBundleId: `app.airqmon`,
    icon: path.join(__dirname, '..', 'assets', 'airqmon.icns'),
    appCategoryType: 'public.app-category.weather',
    ignore: ['^/src', '^/__tests__', '^/coverage'],
    asar: true,
    overwrite: true,
    packageManager: 'yarn',
    out: path.join(__dirname, '..', 'out'),
    arch: ['x64', 'arm64'],
    platform: 'darwin',
    darwinDarkModeSupport: true,
    electronVersion: pkg.electronVersion,
  });
})();
