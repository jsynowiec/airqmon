import { ipcRenderer } from 'electron';
import * as React from 'react';

import TrayWindow from 'app/tray-window/TrayWindow';
import { getVisitor } from 'common/analytics';
import { getCAQIMeta } from 'common/caqi';
import { getLocation, Location } from 'common/geolocation';
import { catcher } from 'common/helpers';
import IPC_EVENTS from 'common/ipc-events';
import { ITimer, Interval, Timeout } from 'common/timers';
import {
  shouldNotifyAbout,
  userSettings,
  getRefreshIntervalMeta,
  IRefreshIntervalMeta,
  IUserSettings,
} from 'common/user-settings';
import {
  SensorStation,
  findNearestStation,
  getStationMeasurements,
  ApiError,
} from 'data/airqmon-api';
import ThemeStore from './ThemeContext';
import UpdaterStore from './UpdaterContext';

const ERROR_RETRY_TIMEOUT: number = 15 * 1000;

interface IDataAppState {
  connectionStatus?: boolean;
  currentLocation?: Location;
  distanceToStation?: number;
  sensorStation?: SensorStation;
}

interface IAppState extends IDataAppState {
  loadingMessage?: string;
  apiError?: ApiError;
  geolocationError?: PositionError;
  isAutoRefreshEnabled: boolean;
  refreshMeasurementsIntervalMeta: IRefreshIntervalMeta;
}

class App extends React.Component<{}, IAppState> {
  private lastUsedStationId?: string | null = null;

  private refreshTimer: ITimer | null = null;
  private initTimer: ITimer | null = null;
  private locationTimer: ITimer | null = null;

  constructor(props: {}) {
    super(props);

    this.state = {
      isAutoRefreshEnabled: userSettings.get('refreshMeasurements'),
      refreshMeasurementsIntervalMeta: getRefreshIntervalMeta(
        userSettings.get('refreshMeasurementsInterval'),
      ),
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
        this.clearRefreshTimer();
        this.clearInitTimer();
        this.clearLocationTimer();
      } else {
        await this.setLocation();
      }
    });

    ipcRenderer.on(IPC_EVENTS.PW_MONITOR_UNLOCK, async () => {
      if (this.state.sensorStation && this.state.isAutoRefreshEnabled) {
        this.clearRefreshTimer();
        this.refreshTimer = new Timeout(async () => {
          if (this.state.connectionStatus) {
            await this.refreshData();
          }
          this.enableRefreshTimer();
        }, 5 * 1000);
      }
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
              this.clearRefreshTimer();
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
  }

  async setLocation() {
    this.clearLocationTimer();

    await this.setState({
      loadingMessage: 'Acquiring location',
    });

    const [location, geolocationError] = await catcher(getLocation());
    if (geolocationError) {
      await this.setState({
        geolocationError,
      });
      this.locationTimer = new Timeout(() => {
        this.setLocation();
      }, ERROR_RETRY_TIMEOUT);
    } else {
      await this.setState({
        currentLocation: location,
        geolocationError: null,
      });
      await this.init();
    }
  }

  async init() {
    this.clearInitTimer();

    await this.setState({
      loadingMessage: 'Looking for the closest sensor station',
    });

    const [response, apiError] = await catcher(findNearestStation(this.state.currentLocation));

    if (apiError) {
      await this.setState({
        apiError,
      });

      return;
    }

    const { distance, station } = response;

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
  }

  async refreshData() {
    const { id } = this.state.sensorStation;
    const [measurements, apiError] = await catcher(getStationMeasurements(id));

    if (apiError) {
      await this.setState({
        apiError,
      });

      return;
    }

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
  }

  clearRefreshTimer(): void {
    if (this.refreshTimer) {
      this.refreshTimer.clear();
    }
  }

  clearInitTimer(): void {
    if (this.initTimer) {
      this.initTimer.clear();
    }
  }

  clearLocationTimer(): void {
    if (this.locationTimer !== null) {
      this.locationTimer.clear();
    }
  }

  enableRefreshTimer() {
    this.clearRefreshTimer();

    this.refreshTimer = new Interval(() => {
      this.refreshData();
    }, this.state.refreshMeasurementsIntervalMeta.value);
  }

  render() {
    return (
      <UpdaterStore>
        <ThemeStore>
          <TrayWindow
            connectionStatus={this.state.connectionStatus}
            loadingMessage={this.state.loadingMessage}
            apiError={this.state.apiError}
            geolocationError={this.state.geolocationError}
            distanceToStation={this.state.distanceToStation}
            sensorStation={this.state.sensorStation}
            isAutoRefreshEnabled={this.state.isAutoRefreshEnabled}
          />
        </ThemeStore>
      </UpdaterStore>
    );
  }
}

export default App;
