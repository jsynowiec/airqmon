import { BrowserWindow } from 'electron';
import * as path from 'path';

import { isDev } from './helpers';

let preferencesWindow: BrowserWindow = null;

export function showPreferencesWindow() {
  if (preferencesWindow && !preferencesWindow.isDestroyed()) {
    if (!preferencesWindow.isVisible()) {
      preferencesWindow.center();
      preferencesWindow.show();
    }

    preferencesWindow.focus();
  } else {
    preferencesWindow = new BrowserWindow({
      title: 'Airqmon preferences',
      width: 377,
      height: 215,
      show: false,
      center: true,
      fullscreenable: false,
      resizable: false,
      maximizable: false,
      backgroundColor: '#ECECEC',
    });

    preferencesWindow.loadURL(`file://${path.join(__dirname, 'preferences-window/index.html')}`);
    preferencesWindow.webContents.once('did-finish-load', () => {
      if (isDev()) {
        preferencesWindow.webContents.openDevTools({ mode: 'detach' });
      }

      preferencesWindow.show();
      preferencesWindow.focus();
    });
  }
}

export function closePreferencesWindow() {
  if (preferencesWindow && !preferencesWindow.isDestroyed()) {
    preferencesWindow.close();
  }
}
