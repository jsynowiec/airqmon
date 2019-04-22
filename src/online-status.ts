import { ipcRenderer } from 'electron';

import IPC_EVENTS from 'common/ipc-events';

function updateOnlineStatus(): void {
  ipcRenderer.send(IPC_EVENTS.CONN_STATUS_CHANGED, navigator.onLine ? 'online' : 'offline');
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

updateOnlineStatus();
