import { ipcRenderer } from 'electron';
import * as React from 'react';

import visitor from '../analytics';
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
  lastUpdateDate?: Date;
  currentLocation?: Location;
  distanceToStation?: number;
  sensorStation?: SensorStation;
}

interface IAppState extends IBaseAppState, IDataAppState {
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
      isAutoRefreshEnabled: userSettings.get('refreshMeasurements'),
      refreshMeasurementsIntervalMeta: getRefreshIntervalMeta(
        userSettings.get('refreshMeasurementsInterval'),
      ),
      connectionStatus: false,
    };

    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handlePreferencesClick = this.handlePreferencesClick.bind(this);
    this.handleQuitClick = this.handleQuitClick.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(IPC_EVENTS.CONN_STATUS_CHANGED, (_, status: 'online' | 'offline') => {
      let newState: IDataAppState = {
        connectionStatus: status === 'online',
      };

      if (status === 'offline') {
        newState = {
          ...newState,
          lastUpdateDate: null,
          sensorStation: null,
        };
      }

      this.setState(newState, () => {
        if (status === 'offline') {
          this.disableRefreshTimer();
        } else {
          getLocation()
            .then((location) => {
              this.setState(
                {
                  currentLocation: location,
                  geolocationError: null,
                },
                () => {
                  this.init();
                },
              );
            })
            .catch((geolocationError: PositionError) => {
              this.setState({
                geolocationError,
              });
            });
        }
      });
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
      <K extends keyof IUserSettings>(
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
            this.setState(
              {
                isAutoRefreshEnabled: newValue as boolean,
              },
              () => {
                if (this.state.isAutoRefreshEnabled) {
                  this.enableRefreshTimer();
                } else {
                  this.disableRefreshTimer();
                }
              },
            );
            break;
          case 'refreshMeasurementsInterval':
            this.setState(
              {
                refreshMeasurementsIntervalMeta: getRefreshIntervalMeta(newValue as number),
              },
              () => {
                this.enableRefreshTimer();
              },
            );
            break;
        }
      },
    );
  }

  init() {
    if (this.initTimer) {
      clearTimeout(this.initTimer);
      this.initTimer = null;
    }

    findNearestStation(this.state.currentLocation)
      .then(({ distance, station }) => {
        return new Promise((resolve) => {
          if (this.lastUsedStationId != null) {
            if (this.lastUsedStationId == station.id) {
              if (shouldNotifyAbout('stationChanged') === true) {
                new Notification('Location changed', {
                  body: `Found a new nearest sensor station ${distance.toFixed(
                    2,
                  )} away located at ${station.displayAddress}.`,
                });
              }
            }
          }

          this.lastUsedStationId = station.id;

          this.setState(
            {
              distanceToStation: distance,
              sensorStation: station,
              apiError: null,
            },
            () => {
              this.refreshData().then(() => {
                if (this.state.isAutoRefreshEnabled) {
                  this.enableRefreshTimer();
                }

                resolve();
              });
            },
          );
        });
      })
      .catch((apiError: ApiError) => {
        this.setState({
          apiError,
        });
      });
  }

  refreshData() {
    return new Promise((resolve) => {
      const { id } = this.state.sensorStation;

      getStationMeasurements(id)
        .then((measurements) => {
          if (this.state.sensorStation.measurements) {
            const oldCAQIMeta = getCAQIMeta(Math.round(this.state.sensorStation.measurements.caqi));
            const newCAQIMeta = getCAQIMeta(Math.round(measurements.caqi));

            const label = `Air quality changed from ${oldCAQIMeta.labels.airQuality.toLowerCase()} to ${newCAQIMeta.labels.airQuality.toLowerCase()}. ${
              newCAQIMeta.advisory
            }`;

            if (oldCAQIMeta.index !== newCAQIMeta.index) {
              visitor.event('Air quality', 'Air quality changed.', label).send();
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

          this.setState(
            {
              lastUpdateDate: new Date(),
              sensorStation: {
                ...this.state.sensorStation,
                measurements,
              },
              apiError: null,
            },
            () => {
              ipcRenderer.send(
                IPC_EVENTS.AIR_Q_DATA_UPDATED,
                this.state.sensorStation.measurements,
              );

              resolve();
            },
          );
        })
        .catch((apiError: ApiError) => {
          this.setState({
            apiError,
          });
        });
    });
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
      visitor.event('App updates', 'Clicked on notification body.').send();

      ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
    });
  }

  handleRefreshClick() {
    userSettings.set('refreshMeasurements', !this.state.isAutoRefreshEnabled);
  }

  handlePreferencesClick() {
    ipcRenderer.send(IPC_EVENTS.SHOW_PREFERENCES_WINDOW);
  }

  handleQuitClick() {
    ipcRenderer.send(IPC_EVENTS.CLOSE_WINDOW);
  }

  render() {
    return (
      <>
        <div className="tray-window window">
          <TrayWindow
            connectionStatus={this.state.connectionStatus}
            apiError={this.state.apiError}
            geolocationError={this.state.geolocationError}
            distanceToStation={this.state.distanceToStation}
            sensorStation={this.state.sensorStation}
            lastUpdateDate={this.state.lastUpdateDate}
            isAutoRefreshEnabled={this.state.isAutoRefreshEnabled}
            availableAppUpdate={this.state.appUpdate}
            onRefreshClickHandler={this.handleRefreshClick}
            onPreferencesClickHandler={this.handlePreferencesClick}
            onQuitClickHandler={this.handleQuitClick}
          />
        </div>
      </>
    );
  }
}

export default App;
