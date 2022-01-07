import { ipcRenderer } from 'electron';
import * as React from 'react';

import TrayWindow from 'app/tray-window/TrayWindow';
import { getAQIndexMetadataForValue, DEFAULT_AQ_INDEX } from 'common/air-quality';
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
  ApiError,
  Measurements,
  SensorStation,
} from 'data/airqmon-api';
import {
  getInstallation,
  getStationMeasurements
} from 'data/airly-api';
import ThemeStore from './ThemeContext';
import UpdaterStore from './UpdaterContext';

interface IDataAppState {
  connectionStatus?: boolean;
  measurements?: Measurements;
  sensorStation?: SensorStation;
}

interface IAppState extends IDataAppState {
  loadingMessage?: string;
  apiError?: ApiError;
  isAutoRefreshEnabled: boolean;
  refreshMeasurementsIntervalMeta: IRefreshIntervalMeta;
}

class App extends React.Component<Record<string, unknown>, IAppState> {
  private refreshTimer: ITimer | null = null;
  private initTimer: ITimer | null = null;

  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      isAutoRefreshEnabled: userSettings.get('refreshMeasurements'),
      refreshMeasurementsIntervalMeta: getRefreshIntervalMeta(
        userSettings.get('refreshMeasurementsInterval'),
      ),
    };
  }

  setState<K extends keyof IAppState, S extends IAppState, P extends Record<string, unknown>>(
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

  componentDidMount(): void {
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
      } else {
        await this.init();
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
          case 'airlyApiKey':
            this.init();
            break;
          case 'stationId':
            this.init();
            break;
        }
      },
    );
  }

  async init(): Promise<void> {
    this.clearInitTimer();

    const stationId = userSettings.get('stationId');
    const [response, apiError] = await catcher<SensorStation, ApiError>(getInstallation(stationId))

    if (apiError) {
      await this.setState({
        apiError,
      });

      return;
    }

    await this.setState({
      sensorStation: response,
      apiError: null
    })

    await this.refreshData();

    if (this.state.isAutoRefreshEnabled) {
      this.enableRefreshTimer();
    }
  }

  async refreshData(): Promise<void> {
    const stationId = userSettings.get('stationId');
    const [measurements, apiError] = await catcher<Measurements, ApiError>(
      getStationMeasurements(stationId),
    );

    if (apiError) {
      await this.setState({
        apiError,
      });

      return;
    }

    if (this.state.measurements) {
      const oldCAQIMeta = getAQIndexMetadataForValue(
        DEFAULT_AQ_INDEX,
        Math.round(this.state.measurements.caqi),
      );
      const newCAQIMeta = getAQIndexMetadataForValue(
        DEFAULT_AQ_INDEX,
        Math.round(measurements.caqi),
      );

      const label = `Air quality changed from ${oldCAQIMeta.labels.airQuality.toLowerCase()} to ${newCAQIMeta.labels.airQuality.toLowerCase()}. ${
        newCAQIMeta.advisory
      }`;

      if (oldCAQIMeta.index !== newCAQIMeta.index) {
        if (shouldNotifyAbout('caqiChanged') === true) {
          const aqchangeNotif = new Notification('Air quality changed', {
            body: label,
          });
          aqchangeNotif.onclick = (): void => {
            ipcRenderer.send(IPC_EVENTS.SHOW_WINDOW);
          };
        }
      }
    }

    await this.setState({
      measurements,
      apiError: null,
    });
    ipcRenderer.send(IPC_EVENTS.AIR_Q_DATA_UPDATED, this.state.measurements);
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

  enableRefreshTimer(): void {
    this.clearRefreshTimer();

    this.refreshTimer = new Interval(() => {
      this.refreshData();
    }, this.state.refreshMeasurementsIntervalMeta.value);
  }

  render(): JSX.Element {
    return (
      <UpdaterStore>
        <ThemeStore>
          <TrayWindow
            connectionStatus={this.state.connectionStatus}
            loadingMessage={this.state.loadingMessage}
            apiError={this.state.apiError}
            sensorStation={this.state.sensorStation}
            measurements={this.state.measurements}
            isAutoRefreshEnabled={this.state.isAutoRefreshEnabled}
          />
        </ThemeStore>
      </UpdaterStore>
    );
  }
}

export default App;
