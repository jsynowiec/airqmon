import * as React from 'react';
import { render } from 'react-dom';

import { ipcRenderer } from 'electron';

import { getVisitor } from 'common/analytics';
import IPC_EVENTS from 'common/ipc-events';

import { App } from './app';

function updateOnlineStatus(): void {
  ipcRenderer.send(IPC_EVENTS.CONN_STATUS_CHANGED, navigator.onLine ? 'online' : 'offline');
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

updateOnlineStatus();

getVisitor()
  .screenview('Tray window', 'Airqmon')
  .send();

render(<App />, document.getElementById('app'));
