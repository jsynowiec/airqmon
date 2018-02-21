import * as React from 'react';
import { IUserSettings, userSettings, REFRESH_INTERVAL } from '../user-settings';
import { ipcRenderer, remote } from 'electron';
import IPC_EVENTS from '../ipc-events';
import { AIRLY_API_RATE_LIMITS_WORKAROUND } from '../airly';

interface IPreferencesWindowState extends IUserSettings {}

class PreferencesWindow extends React.Component<{}, IPreferencesWindowState> {
  private textInputDebounceTimer: NodeJS.Timer = null;
  private webContents: Electron.WebContents;

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
    this.handleAirlyApiKeyChange = this.handleAirlyApiKeyChange.bind(this);

    this.handlePasteEvent = this.handlePasteEvent.bind(this);
  }

  componentDidMount() {
    this.webContents = remote.getCurrentWebContents();
    this.webContents.addListener('before-input-event', this.handlePasteEvent);
  }

  componentWillUnmount() {
    this.webContents.removeListener('before-input-event', this.handlePasteEvent);
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

  handlePasteEvent(_, input: Electron.Input) {
    if (input.key === 'a' && input.meta && !input.alt && !input.control && !input.shift) {
      this.webContents.selectAll();
    }
    if (input.key === 'x' && input.meta && !input.alt && !input.control && !input.shift) {
      this.webContents.cut();
    }
    if (input.key === 'c' && input.meta && !input.alt && !input.control && !input.shift) {
      this.webContents.copy();
    }
    if (input.key === 'v' && input.meta && !input.alt && !input.control && !input.shift) {
      this.webContents.paste();
    }
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

  handleAirlyApiKeyChange(event: React.ChangeEvent<HTMLInputElement>): void {
    let value: string = event.target.value;

    if (this.textInputDebounceTimer) {
      clearTimeout(this.textInputDebounceTimer);
    }

    this.setState(
      {
        airlyApiKey: value,
      },
      () => {
        setTimeout(() => {
          userSettings.set('airlyApiKey', value);
        }, 1000);
      },
    );
  }

  handleExtLinkClick(url: string) {
    ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
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
      <div className="window preferences-window ">
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
                  Notify when location changes
                </label>
              </div>
            </div>
          </div>
          <div className="preferences-window__grid__section-label">Airly API key:</div>
          <div className="preferences-window__grid__section-content">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={this.state.airlyApiKey || ''}
                onChange={this.handleAirlyApiKeyChange}
              />
              <p className="preferences-window__grid__section-content__explanation">
                By providing your own Airly credentials you'll be able to use Airqmon without
                worrying about exceeding daily data limit rates.
              </p>
            </div>
          </div>
          <a
            className="link preferences-window__grid__section-help"
            href="#"
            onClick={this.handleExtLinkClick.bind(this, AIRLY_API_RATE_LIMITS_WORKAROUND)}
          >
            <span className="icon icon-help-circled" />
          </a>
        </div>
      </div>
    );
  }
}

export default PreferencesWindow;
