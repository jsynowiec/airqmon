import { BrowserWindow } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';

export default class PreferencesWindowManager {
  private _window: BrowserWindow;

  constructor() {
    this._window = new BrowserWindow({
      title: 'Airqmon preferences',
      width: 520,
      height: 240,
      show: false,
      center: true,
      fullscreenable: false,
      resizable: false,
      maximizable: false,
    });

    this._window.loadURL(`file://${path.join(__dirname, 'app/preferences-window/index.html')}`);

    if (isDev) {
      this._window.webContents.openDevTools({ mode: 'detach' });
    }

    this._window.on('close', (event) => {
      this._window.hide();
      event.preventDefault();
    });
  }

  get window() {
    return this._window;
  }

  showWindow() {
    this._window.setVisibleOnAllWorkspaces(true);
    this._window.center();
    this._window.show();
    this._window.focus();
    this._window.setVisibleOnAllWorkspaces(false);
  }

  closeWindow() {
    this._window.destroy();
  }
}
