import * as React from 'react';

import { IUserSettings, userSettings, REFRESH_INTERVAL } from 'common/user-settings';
import ThemedWindow from 'app/ThemedWindow';

class PreferencesWindow extends React.Component<Record<string, unknown>, Partial<IUserSettings>> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      ...userSettings.store,
    };

    this.handleOpenAtLoginChange = this.handleOpenAtLoginChange.bind(this);
    this.handleRefreshMeasurementIntervalChange = this.handleRefreshMeasurementIntervalChange.bind(
      this,
    );
    this.handleShowNotificationsChange = this.handleShowNotificationsChange.bind(this);
    this.handleNotificationEventsChange = this.handleNotificationEventsChange.bind(this);
  }

  private setValue<K extends keyof IUserSettings>(key: K, value: IUserSettings[K]): void {
    this.setState(
      {
        [key]: value,
      } as Pick<IUserSettings, K>,
      () => {
        userSettings.set(key, value);
      },
    );
  }

  handleOpenAtLoginChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setValue('openAtLogin', event.target.checked);
  }

  handleRefreshMeasurementIntervalChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    this.setValue('refreshMeasurementsInterval', Number.parseInt(event.target.value));
  }

  handleShowNotificationsChange(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setValue('showNotifications', event.target.checked);
  }

  handleNotificationEventsChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, checked: value } = event.target;
    this.setValue('notificationEvents', {
      ...this.state.notificationEvents,
      [name]: value,
    });
  }

  render(): JSX.Element {
    const refreshIntervalOptions: JSX.Element[] = REFRESH_INTERVAL.reduce((acc, val) => {
      return [
        ...acc,
        <option key={val.id} value={val.id}>
          {val.label}
        </option>,
      ];
    }, []);

    return (
      <ThemedWindow name="preferences">
        <div className="window-content preferences-window__grid">
          <div className="preferences-window__grid__section-label">Launch Behavior:</div>
          <div className="preferences-window__grid__section-content">
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.openAtLogin}
                  onChange={this.handleOpenAtLoginChange}
                />{' '}
                Launch Airqmon at login
              </label>
            </div>
          </div>
          <div className="preferences-window__grid__section-label">Update readings every:</div>
          <div className="preferences-window__grid__section-content">
            <div>
              <select
                className="form-control inline"
                value={this.state.refreshMeasurementsInterval}
                onChange={this.handleRefreshMeasurementIntervalChange}
              >
                {refreshIntervalOptions}
              </select>
            </div>
          </div>
          <div className="preferences-window__grid__section-label">Notifications:</div>
          <div className="preferences-window__grid__section-content">
            <div className="checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={this.state.showNotifications}
                  onChange={this.handleShowNotificationsChange}
                />{' '}
                Show notifications
              </label>
            </div>
            <div className="checkbox-group-children">
              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="caqiChanged"
                    checked={this.state.notificationEvents.caqiChanged}
                    disabled={!this.state.showNotifications}
                    onChange={this.handleNotificationEventsChange}
                  />{' '}
                  when air quality index changes
                </label>
              </div>
              <div className="checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="stationChanged"
                    checked={this.state.notificationEvents.stationChanged}
                    disabled={!this.state.showNotifications}
                    onChange={this.handleNotificationEventsChange}
                  />{' '}
                  when location changes
                </label>
              </div>
            </div>
          </div>
        </div>
      </ThemedWindow>
    );
  }
}

export default PreferencesWindow;
