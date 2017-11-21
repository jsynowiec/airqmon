import { app, ipcMain, shell } from 'electron';
import { createTray, createWindow, showWindow, closeWindow } from './window';

import { IAirlyCurrentMeasurement } from './airly';
import { getCAQIMeta } from './caqi';
import IPC_EVENTS from './ipc-events';

const keys = require('../keys.json');

let tray: Electron.Tray;
let window: Electron.BrowserWindow;

if (keys.google) {
  process.env.GOOGLE_API_KEY = keys.google;
}

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  tray = createTray();

  window = createWindow({
    width: 300,
    height: 420,
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

ipcMain.on(IPC_EVENTS.CONN_STATUS_CHANGED, (_, status) => {
  window.webContents.send(IPC_EVENTS.CONN_STATUS_CHANGED, status);

  if (status === 'offline') {
    tray.setTitle('');
    tray.setToolTip('');
  }
});

ipcMain.on('airq-data-update', (_, currentMeasurement: IAirlyCurrentMeasurement) => {
  tray.setTitle(currentMeasurement.airQualityIndex.toFixed(0));

  const airQualityLabel = getCAQIMeta(currentMeasurement.airQualityIndex).labels.airQuality;
  tray.setToolTip(
    `Air quality is ${airQualityLabel.toLowerCase()}`,
  );
});

ipcMain.on('open-ext-browser', (_, arg) => {
  shell.openExternal(arg);
});

ipcMain.on('close-window', () => {
  closeWindow();
});
