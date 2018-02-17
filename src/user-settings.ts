import Store from 'electron-store';

export const userSettings = new Store({
  defaults: {
    launchAtLogin: false,
    refreshMeasurements: true,
    notifications: {
      enabled: true,
      caqiChanged: true,
      stationChanged: true,
    },
  },
  name: 'user-settings',
});
