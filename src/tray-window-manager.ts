import { BrowserWindow, BrowserWindowConstructorOptions, screen, Tray, Point } from 'electron';
import * as isDev from 'electron-is-dev';
import * as path from 'path';

import { getVisitor } from 'common/analytics';

const assetsDirectory = path.join(__dirname, '../assets');

class TrayWindowManager {
  private _window: BrowserWindow;
  private _tray: Tray;

  get window(): BrowserWindow {
    return this._window;
  }

  constructor(windowConfig: BrowserWindowConstructorOptions = {}) {
    this.createWindow(windowConfig);
    this.createTray();
  }

  private createWindow(config: BrowserWindowConstructorOptions): void {
    this._window = new BrowserWindow({
      show: false,
      frame: false,
      fullscreenable: false,
      movable: false,
      maximizable: false,
      resizable: false,
      transparent: true,
      ...config,
    });
    this._window.loadFile(path.resolve(__dirname, 'renderer', 'main.html'));

    if (isDev) {
      this._window.webContents.openDevTools({ mode: 'detach' });
    }

    this._window.on('blur', () => {
      if (!this._window.webContents.isDevToolsOpened()) {
        this._window.hide();
      }
    });
  }

  private createTray(): void {
    this._tray = new Tray(path.join(assetsDirectory, 'menu_iconTemplate.png'));

    this._tray.on('right-click', () => {
      getVisitor()
        .event('Tray icon clicks', 'User right-clicked the tray icon.')
        .send();

      this.toggleWindow();
    });

    this._tray.on('click', () => {
      getVisitor()
        .event('Tray icon clicks', 'User clicked the tray icon.')
        .send();

      this.toggleWindow();
    });
  }

  get visible(): boolean {
    return this._window.isVisible();
  }

  setWindowPosition(): void {
    const position = this.getWindowPosition();

    this._window.setPosition(position.x, position.y, false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ipcSend(channel: string, ...args: any[]): void {
    this._window.webContents.send(channel, ...args);
  }

  getWindowPosition(): Point {
    const windowBounds = this._window.getBounds();
    const trayBounds = this._tray.getBounds();

    const activeDisplay = screen.getDisplayMatching(trayBounds);
    let yOffset = 0;

    if (activeDisplay.bounds.y < 0) {
      yOffset = activeDisplay.bounds.y;
    }

    return {
      x: Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2),
      y: Math.round(yOffset + trayBounds.height),
    };
  }

  showWindow(): void {
    this._window.setVisibleOnAllWorkspaces(true);
    this.setWindowPosition();
    this._window.show();
    this._window.focus();
    this._window.setVisibleOnAllWorkspaces(false);
  }

  closeWindow(): void {
    this._window.getChildWindows().forEach((childWindow) => {
      childWindow.close();
    });

    this._window.close();
  }

  toggleWindow(): void {
    if (this._window.isVisible()) {
      this._window.hide();
    } else {
      this.showWindow();
    }
  }

  updateTray({
    title = '',
    tooltip = '',
  }: {
    title?: string;
    tooltip?: string;
  } = {}): void {
    this._tray.setTitle(title, { fontType: 'monospacedDigit' });
    this._tray.setToolTip(tooltip);
    this.setWindowPosition();
  }

  clearTray(): void {
    this.updateTray();
  }
}

export default TrayWindowManager;
