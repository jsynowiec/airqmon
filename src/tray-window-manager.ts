import { BrowserWindow, BrowserWindowConstructorOptions, screen, Tray } from 'electron';
import * as path from 'path';

import viewer from './analytics';
import { isDev } from './helpers';

const assetsDirectory = path.join(__dirname, '../assets');

export default class TrayWindowManager {
  private _window: BrowserWindow;
  private _tray: Tray;

  get window(): BrowserWindow {
    return this._window;
  }

  constructor(windowConfig: BrowserWindowConstructorOptions = {}) {
    this.createWindow(windowConfig);
    this.createTray();
  }

  private createWindow(config: BrowserWindowConstructorOptions) {
    this._window = new BrowserWindow(config);
    this._window.loadURL(`file://${path.join(__dirname, 'index.html')}`);

    this._window.setVisibleOnAllWorkspaces(true);

    if (isDev()) {
      this._window.webContents.openDevTools({ mode: 'detach' });
    }

    this._window.on('blur', () => {
      if (!this._window.webContents.isDevToolsOpened()) {
        this._window.hide();
      }
    });
  }

  private createTray() {
    this._tray = new Tray(path.join(assetsDirectory, 'menu_iconTemplate.png'));

    this._tray.on('right-click', () => {
      viewer.event('Tray icon clicks', 'User right-clicked the tray icon.').send();

      this.toggleWindow();
    });

    this._tray.on('click', () => {
      viewer.event('Tray icon clicks', 'User clicked the tray icon.').send();

      this.toggleWindow();
    });
  }

  private setWindowPosition(): void {
    const position = this.getWindowPosition();

    this._window.setPosition(position.x, position.y, false);
  }

  ipcSend(channel: string, ...args: any[]): void {
    this._window.webContents.send(channel, ...args);
  }

  getWindowPosition(): { x: number; y: number } {
    const windowBounds = this._window.getBounds();
    const trayBounds = this._tray.getBounds();

    const activeDisplay = screen.getDisplayMatching(trayBounds);
    let yOffset = 0;

    if (activeDisplay.bounds.y < 0) {
      yOffset = activeDisplay.bounds.y;
    }

    return {
      x: Math.round(trayBounds.x + trayBounds.width / 2 - windowBounds.width / 2),
      y: Math.round(yOffset + trayBounds.height + 4),
    };
  }

  showWindow(): void {
    this.setWindowPosition();

    this._window.show();
    this._window.focus();
  }

  closeWindow(): void {
    this._window.close();
  }

  toggleWindow() {
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
    this._tray.setTitle(title);
    this._tray.setToolTip(tooltip);
  }

  clearTray(): void {
    this.updateTray();
  }
}
