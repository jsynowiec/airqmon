import { app, ipcMain, shell } from 'electron';

import { IAirlyCurrentMeasurement } from './airly';
import { getCAQIMeta } from './caqi';
import { isDev } from './helpers';
import IPC_EVENTS from './ipc-events';
import TrayWindowManager from './tray-window-manager';
import { IUserSettings } from './user-settings';
import PreferencesWindowManager from './preferences-window-manager';

const keys = require('../keys.json');

let trayWindowManager: TrayWindowManager;
let preferencesWindowManager: PreferencesWindowManager;

process.env.NODE_ENV = isDev() ? 'development' : 'production';

if (keys.google) {
  process.env.GOOGLE_API_KEY = keys.google;
}

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  trayWindowManager = new TrayWindowManager({
    width: 300,
    height: 500,
    webPreferences: {
      // Prevents renderer process code from not running when window is hidden
      backgroundThrottling: false,
    },
  });

  preferencesWindowManager = new PreferencesWindowManager();

  trayWindowManager.window.webContents.on('before-input-event', (_, input) => {
    if (input.key === ',' && input.meta && !input.alt && !input.control && !input.shift) {
      preferencesWindowManager.showWindow();
    }
  });

  trayWindowManager.window.on('close', () => {
    preferencesWindowManager.closeWindow();
  });
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on(IPC_EVENTS.CONN_STATUS_CHANGED, (_, status: 'online' | 'offline') => {
  trayWindowManager.ipcSend(IPC_EVENTS.CONN_STATUS_CHANGED, status);

  if (status === 'offline') {
    trayWindowManager.clearTray();
  }
});

ipcMain.on(IPC_EVENTS.AIR_Q_DATA_UPDATED, (_, currentMeasurement: IAirlyCurrentMeasurement) => {
  const airQualityLabel = getCAQIMeta(Math.round(currentMeasurement.airQualityIndex)).labels
    .airQuality;

  trayWindowManager.updateTray({
    title: currentMeasurement.airQualityIndex.toFixed(0),
    tooltip: `Air quality is ${airQualityLabel.toLowerCase()}`,
  });
});

ipcMain.on(IPC_EVENTS.OPEN_BROWSER_FOR_URL, (_, url: string) => {
  shell.openExternal(url);
});

ipcMain.on(IPC_EVENTS.SHOW_WINDOW, () => {
  trayWindowManager.showWindow();
});

ipcMain.on(IPC_EVENTS.SHOW_PREFERENCES_WINDOW, () => {
  preferencesWindowManager.showWindow();
});

ipcMain.on(IPC_EVENTS.CLOSE_WINDOW, () => {
  trayWindowManager.closeWindow();
});

ipcMain.on(
  IPC_EVENTS.USER_SETTING_CHANGED,
  <K extends keyof IUserSettings>(
    _,
    { key, oldValue, newValue }: { key: K; oldValue: IUserSettings[K]; newValue: IUserSettings[K] },
  ) => {
    trayWindowManager.ipcSend(IPC_EVENTS.USER_SETTING_CHANGED, { key, oldValue, newValue });

    if (key === 'openAtLogin') {
      app.setLoginItemSettings({
        openAtLogin: newValue as boolean,
      });
    }
  },
);
