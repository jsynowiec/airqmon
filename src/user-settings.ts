import Store = require('electron-store');

interface INotificationsEvents {
  caqiChanged: boolean;
  stationChanged: boolean;
}

interface IUserSettings {
  launchAtLogin: boolean;
  refreshMeasurements: boolean;
  refreshInterval: Intervals;
  notifications: {
    enabled: boolean;
    events: INotificationsEvents;
  };
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
    launchAtLogin: false,
    refreshMeasurements: true,
    refreshInterval: Intervals.Short,
    notifications: {
      enabled: true,
      events: {
        caqiChanged: true,
        stationChanged: true,
      },
    },
  },
  name: 'user-settings',
});

export function shouldNotifyAbout(event: keyof INotificationsEvents): boolean {
  const notificationsSettings = userSettings.get('notifications');
  return notificationsSettings.enabled && notificationsSettings.events[event];
}
