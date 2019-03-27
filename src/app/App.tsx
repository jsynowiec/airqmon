import { ipcRenderer, remote } from 'electron';
import * as React from 'react';

import { getVisitor } from '../analytics';
import { getLocation, Location } from '../geolocation';
import { TrayWindow } from '../tray-window';
import updateChecker from '../update-checker';

import {
  SensorStation,
  findNearestStation,
  getStationMeasurements,
  ApiError,
} from '../airqmon-api';
import { getCAQIMeta } from '../caqi';
import IPC_EVENTS from '../ipc-events';
import {
  shouldNotifyAbout,
  userSettings,
  getRefreshIntervalMeta,
  IRefreshIntervalMeta,
  IUserSettings,
} from '../user-settings';

interface IBaseAppState {
  appUpdate?: {
    version: string;
    url: string;
  };
}

interface IDataAppState {
  connectionStatus?: boolean;
  currentLocation?: Location;
  distanceToStation?: number;
  sensorStation?: SensorStation;
}

interface IAppState extends IBaseAppState, IDataAppState {
  isDarkMode: boolean;
  loadingMessage?: string;
  apiError?: ApiError;
  geolocationError?: PositionError;
  isAutoRefreshEnabled: boolean;
  refreshMeasurementsIntervalMeta: IRefreshIntervalMeta;
}

class App extends React.Component<{}, IAppState> {
  private lastUsedStationId?: string = null;
  private refreshTimer: NodeJS.Timer = null;
  private initTimer: NodeJS.Timer = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      isDarkMode: remote.systemPreferences.isDarkMode(),
      isAutoRefreshEnabled: userSettings.get('refreshMeasurements'),
      refreshMeasurementsIntervalMeta: getRefreshIntervalMeta(
        userSettings.get('refreshMeasurementsInterval'),
      ),
      connectionStatus: false,
    };
  }

  setState<K extends keyof IAppState, S extends IAppState, P extends {}>(
    state:
      | ((prevState: Readonly<S>, props: Readonly<P>) => Pick<S, K> | S | null)
      | (Pick<S, K> | S | null),
    cb?: () => void,
  ): Promise<void> | void {
    if (typeof cb == 'function') {
      return super.setState(state, cb);
    }

    return new Promise((resolve) => {
      super.setState(state, resolve);
    });
  }

  componentDidMount() {
    ipcRenderer.on(IPC_EVENTS.CONN_STATUS_CHANGED, async (_, status: 'online' | 'offline') => {
      let newState: IDataAppState = {
        connectionStatus: status === 'online',
      };

      if (status == 'offline') {
        newState = {
          ...newState,
          sensorStation: null,
        };
      }

      await this.setState(newState);

      if (status == 'offline') {
        this.disableRefreshTimer();
      } else {
        await this.setState({
          loadingMessage: 'Acquiring location',
        });
        try {
          const location = await getLocation();
          await this.setState({
            currentLocation: location,
            geolocationError: null,
          });
          await this.init();
        } catch (geolocationError) {
          await this.setState({
            geolocationError,
          });
        }
      }
    });

    ipcRenderer.on(IPC_EVENTS.PW_MONITOR_UNLOCK, async () => {
      if (this.state.sensorStation && this.state.isAutoRefreshEnabled) {
        setTimeout(async () => {
          if (this.state.connectionStatus) {
            await this.refreshData();
          }
        }, 2 * 1000);
      }
    });

    updateChecker.on('update-available', (version, url) => {
      this.setState({
        appUpdate: {
          version,
          url,
        },
      } as IAppState);

      this.notifyAboutAvailableUpdate(version, url);
    });

    ipcRenderer.on(
      IPC_EVENTS.USER_SETTING_CHANGED,
      async <K extends keyof IUserSettings>(
        _,
        {
          key,
          newValue,
        }: {
          key: K;
          newValue: IUserSettings[K];
        },
      ) => {
        switch (key) {
          case 'refreshMeasurements':
            await this.setState({
              isAutoRefreshEnabled: newValue as boolean,
            });
            if (this.state.isAutoRefreshEnabled) {
              this.enableRefreshTimer();
            } else {
              this.disableRefreshTimer();
            }
            break;
          case 'refreshMeasurementsInterval':
            await this.setState({
              refreshMeasurementsIntervalMeta: getRefreshIntervalMeta(newValue as number),
            });
            this.enableRefreshTimer();
            break;
        }
      },
    );

    remote.systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
      this.setState({
        isDarkMode: remote.systemPreferences.isDarkMode(),
      });
    });
  }

  async init() {
    if (this.initTimer) {
      clearTimeout(this.initTimer);
      this.initTimer = null;
    }

    await this.setState({
      loadingMessage: 'Looking for the closest sensor station',
    });

    try {
      const { distance, station } = await findNearestStation(this.state.currentLocation);
      if (this.lastUsedStationId != null) {
        if (this.lastUsedStationId != station.id) {
          if (shouldNotifyAbout('stationChanged') === true) {
            getVisitor()
              .event('Location', 'Station changed.', 'station.id', station.id)
              .send();

            new Notification('Location changed', {
              body: `Found a new nearest sensor station ${distance.toFixed(2)} away located at ${
                station.displayAddress
              }.`,
            });
          }
        }
      }

      this.lastUsedStationId = station.id;

      await this.setState({
        distanceToStation: distance,
        sensorStation: station,
        apiError: null,
      });

      await this.refreshData();
      if (this.state.isAutoRefreshEnabled) {
        this.enableRefreshTimer();
      }
    } catch (apiError) {
      await this.setState({
        apiError,
      });
    }
  }

  async refreshData() {
    const { id } = this.state.sensorStation;

    try {
      const measurements = await getStationMeasurements(id);

      if (this.state.sensorStation.measurements) {
        const oldCAQIMeta = getCAQIMeta(Math.round(this.state.sensorStation.measurements.caqi));
        const newCAQIMeta = getCAQIMeta(Math.round(measurements.caqi));

        const label = `Air quality changed from ${oldCAQIMeta.labels.airQuality.toLowerCase()} to ${newCAQIMeta.labels.airQuality.toLowerCase()}. ${
          newCAQIMeta.advisory
        }`;

        if (oldCAQIMeta.index !== newCAQIMeta.index) {
          getVisitor()
            .event('Air quality', 'Air quality changed.', 'caqi.label', label)
            .send();
          if (shouldNotifyAbout('caqiChanged') === true) {
            const aqchangeNotif = new Notification('Air quality changed', {
              body: label,
            });
            aqchangeNotif.onclick = () => {
              ipcRenderer.send(IPC_EVENTS.SHOW_WINDOW);
            };
          }
        }
      }

      await this.setState({
        sensorStation: {
          ...this.state.sensorStation,
          measurements,
        },
        apiError: null,
      });
      ipcRenderer.send(IPC_EVENTS.AIR_Q_DATA_UPDATED, this.state.sensorStation.measurements);
    } catch (apiError) {
      await this.setState({
        apiError,
      });
    }
  }

  disableRefreshTimer(): void {
    if (this.refreshTimer !== null) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  enableRefreshTimer() {
    this.disableRefreshTimer();

    this.refreshTimer = setInterval(() => {
      this.refreshData();
    }, this.state.refreshMeasurementsIntervalMeta.value);
  }

  notifyAboutAvailableUpdate(version, url) {
    new Notification('Update available', {
      body: `Version ${version} is available to download.`,
    }).addEventListener('click', () => {
      getVisitor()
        .event('App updates', 'Clicked on notification body.')
        .send();

      ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
    });
  }

  render() {
    let windowClassName = 'window tray-window';
    if (this.state.isDarkMode) {
      windowClassName += ' dark-theme';
    }

    return (
      <>
        <div className={windowClassName}>
          <TrayWindow
            connectionStatus={this.state.connectionStatus}
            loadingMessage={this.state.loadingMessage}
            apiError={this.state.apiError}
            geolocationError={this.state.geolocationError}
            distanceToStation={this.state.distanceToStation}
            sensorStation={this.state.sensorStation}
            isAutoRefreshEnabled={this.state.isAutoRefreshEnabled}
            availableAppUpdate={this.state.appUpdate}
          />
        </div>
      </>
    );
  }
}

export default App;
