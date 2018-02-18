import { BrowserWindow } from 'electron';
import * as path from 'path';

import { isDev } from './helpers';

let preferencesWindow: BrowserWindow = null;

export function showPreferencesWindow(parent: BrowserWindow = null) {
  if (preferencesWindow && !preferencesWindow.isDestroyed()) {
    if (!preferencesWindow.isVisible()) {
      preferencesWindow.show();
    }

    preferencesWindow.center();
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
      parent,
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
