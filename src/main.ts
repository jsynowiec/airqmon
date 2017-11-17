import { app, ipcMain, shell } from 'electron';
import { createTray, createWindow, showWindow, closeWindow } from './window';

import { IAirlyCurrentMeasurement } from './airly';
import { humanize } from './caqi';

const keys = require('../keys.json');

let tray: Electron.Tray;

if (keys.google) {
  process.env.GOOGLE_API_KEY = keys.google;
}

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  tray = createTray();

  const window = createWindow({
    width: 300,
    height: 400,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      // Prevents renderer process code from not running when window is hidden
      backgroundThrottling: false,
    },
  });

  window.setVisibleOnAllWorkspaces(true);
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('show-window', () => {
  showWindow();
});

ipcMain.on('airq-data-update', (_, currentMeasurement: IAirlyCurrentMeasurement) => {
  tray.setTitle(currentMeasurement.airQualityIndex.toFixed(0));
  tray.setToolTip(`Air pollution is ${humanize(currentMeasurement.airQualityIndex).toLowerCase()}`);
});

ipcMain.on('open-ext-browser', (_, arg) => {
  shell.openExternal(arg);
});

ipcMain.on('close-window', () => {
  closeWindow();
});
