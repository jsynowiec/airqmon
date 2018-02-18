import Store = require('electron-store');

interface INotificationsEvents {
  caqiChanged: boolean;
  stationChanged: boolean;
}

interface IUserSettings {
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

const REFRESH_INTERVAL: IRefreshIntervalMeta[] = [
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

export const userSettings = new Store<IUserSettings>({
  defaults: {
    openAtLogin: false,
    refreshMeasurements: true,
    refreshMeasurementsInterval: Intervals.Short,
    showNotifications: true,
    notificationEvents: {
      caqiChanged: true,
      stationChanged: true,
    },
  },
  name: 'user-settings',
});

export function shouldNotifyAbout(event: keyof INotificationsEvents): boolean {
  return userSettings.get('showNotifications') && userSettings.get('notificationEvents')[event];
}
