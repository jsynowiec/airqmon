import {
  BrowserWindow,
  screen,
  Tray,
} from 'electron';
import * as path from 'path';

import viewer from './analytics';
import { isDev } from './helpers';

const assetsDirectory = path.join(__dirname, '../assets');

let tray: Tray;
let window: BrowserWindow;

export function getWindowPosition(): { x: number, y: number } {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();
  const activeDisplay = screen.getDisplayMatching(trayBounds);
  let yOffset = 0;

  if (activeDisplay.bounds.y < 0) {
    yOffset = activeDisplay.bounds.y;
  }

  return {
    x: Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2)),
    y: Math.round(yOffset + trayBounds.height + 4),
  };
}

export function showWindow() {
  const position = getWindowPosition();

  window.setPosition(position.x, position.y, false);
  window.show();
  window.focus();
}

export function toggleWindow() {
  if (window.isVisible()) {
    window.hide();
  } else {
    showWindow();
  }
}

export function closeWindow() {
  window.close();
}

export function createTray() {
  tray = new Tray(path.join(assetsDirectory, 'menu_iconTemplate.png'));

  tray.on('right-click', () => {
    viewer.event('Tray icon clicks', 'User right-clicked the tray icon.').send();

    toggleWindow();
  });
  tray.on('click', () => {
    viewer.event('Tray icon clicks', 'User clicked the tray icon.').send();

    toggleWindow();
  });

  return tray;
}

export function createWindow(config: Electron.BrowserWindowConstructorOptions = {}) {
  window = new BrowserWindow(config);

  window.loadURL(`file://${path.join(__dirname, 'index.html')}`);
  if (isDev()) {
    window.webContents.openDevTools({ mode: 'detach' });
  }

  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  return window;
}
