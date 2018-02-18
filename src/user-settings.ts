import { ipcRenderer } from 'electron';
import ElectronStore = require('electron-store');
import IPC_EVENTS from './ipc-events';

interface INotificationsEvents {
  caqiChanged: boolean;
  stationChanged: boolean;
}

export interface IUserSettings {
  openAtLogin: boolean;
  refreshMeasurements: boolean;
  refreshMeasurementsInterval: Intervals;
  showNotifications: boolean;
  notificationEvents: INotificationsEvents;
}

enum Intervals {
  Short = 0,
  Medium = 1,
  Long = 2,
}

export interface IRefreshIntervalMeta {
  id: Intervals;
  value: number;
  label: string;
}

export const REFRESH_INTERVAL: IRefreshIntervalMeta[] = [
  {
    id: Intervals.Short,
    value: 300000,
    label: '5 minutes',
  },
  {
    id: Intervals.Medium,
    value: 900000,
    label: '15 minutes',
  },
  {
    id: Intervals.Long,
    value: 1800000,
    label: '30 minutes',
  },
];

export function getRefreshIntervalMeta(interval: Intervals) {
  return REFRESH_INTERVAL.find((value) => value.id === interval);
}

class ConfigStore<T> {
  private _store: ElectronStore<T>;

  constructor(defaults?: T) {
    this._store = new ElectronStore<T>({
      name: 'user-settings',
      defaults,
    });
  }

  get store(): T {
    return this._store.store;
  }

  set<K extends keyof T>(key: K, value: T[K]): void {
    const oldValue = this._store.get(key);

    this._store.set(key, value);
    ipcRenderer.send(IPC_EVENTS.USER_SETTING_CHANGED, { key, oldValue, newValue: value });
  }

  get<K extends keyof T>(key: K): T[K] {
    return this._store.get(key);
  }
}

export const userSettings = new ConfigStore<IUserSettings>({
  openAtLogin: false,
  refreshMeasurements: true,
  refreshMeasurementsInterval: Intervals.Short,
  showNotifications: true,
  notificationEvents: {
    caqiChanged: true,
    stationChanged: true,
  },
});

export function shouldNotifyAbout(event: keyof INotificationsEvents): boolean {
  return userSettings.get('showNotifications') && userSettings.get('notificationEvents')[event];
}
