import * as React from 'react';
import { IUserSettings, userSettings, REFRESH_INTERVAL } from '../user-settings';

interface IPreferencesWindowState extends IUserSettings {}

class PreferencesWindow extends React.Component<{}, IPreferencesWindowState> {
  constructor(props) {
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
        [key as any]: value,
      },
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

  render() {
    const refreshIntervalOptions: JSX.Element[] = REFRESH_INTERVAL.reduce((acc, val) => {
      return [
        ...acc,
        <option key={val.id} value={val.id}>
          {val.label}
        </option>,
      ];
    }, []);

    return (
      <div className="preferences-window window">
        <div className="window-content">
          <form>
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
            <div>
              <label>
                Update sensor readings every
                <select
                  className="form-control inline"
                  value={this.state.refreshMeasurementsInterval}
                  onChange={this.handleRefreshMeasurementIntervalChange}
                >
                  {refreshIntervalOptions}
                </select>
              </label>
            </div>
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
                  Notify when CAQI changes
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
                  Notify when location changed
                </label>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default PreferencesWindow;
