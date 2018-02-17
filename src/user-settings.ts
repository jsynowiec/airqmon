import Store = require('electron-store');

interface INotificationsEvents {
  caqiChanged: boolean;
  stationChanged: boolean;
}

interface IUserSettings {
  launchAtLogin: boolean;
  refreshMeasurements: boolean;
  notifications: {
    enabled: boolean;
    events: INotificationsEvents;
  };
}

export const userSettings = new Store<IUserSettings>({
  defaults: {
    launchAtLogin: false,
    refreshMeasurements: true,
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
