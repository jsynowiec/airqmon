import { app, ipcMain, shell, powerMonitor } from 'electron';

import { getAQIndexMetadataForValue, DEFAULT_AQ_INDEX } from 'common/air-quality';
import IPC_EVENTS from 'common/ipc-events';
import ElectronStore = require('electron-store');
import { IUserSettings } from 'common/user-settings';
import { Measurements } from 'data/airqmon-api';

import TrayWindowManager from './tray-window-manager';
import PreferencesWindowManager from './preferences-window-manager';

ElectronStore.initRenderer();

let trayWindowManager: TrayWindowManager;
let preferencesWindowManager: PreferencesWindowManager;

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
  trayWindowManager = new TrayWindowManager({
    width: 300,
    height: 520,
    webPreferences: {
      // Prevents renderer process code from not running when window is hidden
      backgroundThrottling: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
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

  powerMonitor.on('unlock-screen', () => {
    if (trayWindowManager.visible) {
      trayWindowManager.setWindowPosition();
    }

    trayWindowManager.ipcSend(IPC_EVENTS.PW_MONITOR_UNLOCK);
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

ipcMain.on(IPC_EVENTS.AIR_Q_DATA_UPDATED, (_, measurements: Measurements) => {
  const airQualityLabel = getAQIndexMetadataForValue(
    DEFAULT_AQ_INDEX,
    Math.round(measurements.caqi),
  ).labels.airQuality;

  trayWindowManager.updateTray({
    title: measurements.caqi.toFixed(0),
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
