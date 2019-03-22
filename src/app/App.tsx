import { ipcRenderer } from 'electron';
import * as React from 'react';
import axios from 'axios';

import visitor from '../analytics';
import { getLocation } from '../geolocation';
import { TrayWindow } from '../tray-window';
import updateChecker from '../update-checker';
import errorHandler from '../error-handler';

import {
  AIRLY_API_URL,
  AirlyAPIStatus,
  IAirlyCurrentMeasurement,
  IArilyNearestSensorMeasurement,
} from '../airly';
import { getCAQIMeta } from '../caqi';
import { isEmptyObject } from '../helpers';
import IPC_EVENTS from '../ipc-events';
import {
  shouldNotifyAbout,
  userSettings,
  getRefreshIntervalMeta,
  IRefreshIntervalMeta,
  IUserSettings,
} from '../user-settings';

const API_REQUEST_RETRY: number = 60000;

interface IAppProps {
  airlyToken: string;
}

interface IBaseAppState {
  tokens: {
    airly: string;
    userProvidedAirly?: string;
  };
  appUpdate?: {
    version: string;
    url: string;
  };
}

interface IDataAppState {
  connectionStatus?: boolean;
  lastUpdateDate?: Date;
  latitude?: number;
  longitude?: number;
  nearestStation?: IArilyNearestSensorMeasurement;
  currentMeasurements?: IAirlyCurrentMeasurement;
}

interface IAppState extends IBaseAppState, IDataAppState {
  airlyApiStatus?: AirlyAPIStatus;
  geolocationError?: PositionError;
  isAutoRefreshEnabled: boolean;
  refreshMeasurementsIntervalMeta: IRefreshIntervalMeta;
}

class App extends React.Component<IAppProps, IAppState> {
  private lastUsedStationId?: number = null;
  private refreshTimer: NodeJS.Timer = null;
  private initTimer: NodeJS.Timer = null;

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      isAutoRefreshEnabled: userSettings.get('refreshMeasurements'),
      refreshMeasurementsIntervalMeta: getRefreshIntervalMeta(
        userSettings.get('refreshMeasurementsInterval'),
      ),
      connectionStatus: false,
      tokens: {
        airly: this.props.airlyToken,
        userProvidedAirly: userSettings.get('airlyApiKey'),
      },
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
          currentMeasurements: null,
          nearestStation: null,
        };
      }

      this.setState(newState, () => {
        if (status === 'offline') {
          this.disableRefreshTimer();
        } else {
          getLocation()
            .then((position) => {
              const { latitude, longitude } = position.coords;

              this.setState(
                {
                  latitude,
                  longitude,
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
          case 'airlyApiKey':
            this.setState(
              {
                tokens: {
                  ...this.state.tokens,
                  userProvidedAirly: newValue as string,
                },
              },
              () => {
                this.init();
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

    this.findNearestStation()
      .then((station: IArilyNearestSensorMeasurement) => {
        return new Promise((resolve, reject) => {
          if (this.lastUsedStationId !== null) {
            if (this.lastUsedStationId !== station.id) {
              if (shouldNotifyAbout('stationChanged') === true) {
                new Notification('Location changed', {
                  // tslint:disable-next-line:max-line-length
                  body: `Found a new nearest sensor station ${(station.distance / 1000).toFixed(
                    2,
                  )} away located at ${station.address.locality}, ${station.address.route}.`,
                });
              }
            }
          }

          this.lastUsedStationId = station.id;

          this.setState(
            {
              airlyApiStatus: AirlyAPIStatus.OK,
            },
            () => {
              this.refreshData()
                .then(() => {
                  if (this.state.isAutoRefreshEnabled) {
                    this.enableRefreshTimer();
                  }

                  resolve();
                })
                .catch((reason) => {
                  reject(reason);
                });
            },
          );
        });
      })
      .catch((reason) => {
        if (reason) {
          let shouldLogError: boolean = true;

          if (reason.response && reason.response.status === 429) {
            shouldLogError = false;
          }

          if (shouldLogError) {
            errorHandler.error(reason.message, reason);
          }
        }

        this.initTimer = setTimeout(() => {
          this.init();
        }, API_REQUEST_RETRY);

        if (reason.response) {
          let airlyApiStatus = AirlyAPIStatus.OTHER_ERROR;

          if (reason.response.status === 429) {
            airlyApiStatus = AirlyAPIStatus.RATE_LIMIT_EXCEEDED;
          }

          if ([401, 403].indexOf(reason.response.status) !== -1) {
            airlyApiStatus = AirlyAPIStatus.WRONG_TOKEN;
          }

          this.setState({ airlyApiStatus });
        }
      });
  }

  findNearestStation() {
    return new Promise((resolve, reject) => {
      axios({
        baseURL: AIRLY_API_URL,
        method: 'get',
        url: '/v1/nearestSensor/measurements',
        headers: {
          apikey: this.state.tokens.userProvidedAirly || this.state.tokens.airly,
        },
        params: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
      })
        .then((value) => {
          if (value.status === 200) {
            const nearestStation = value.data;

            if (nearestStation === null || Object.keys(nearestStation).indexOf('id') == -1) {
              this.setState({ airlyApiStatus: AirlyAPIStatus.NO_STATION }, () => reject());
            } else {
              this.setState({ nearestStation }, () => resolve(nearestStation));
            }
          }
        })
        .catch((reason) => reject(reason));
    });
  }

  refreshData() {
    return new Promise((resolve, reject) => {
      axios({
        baseURL: AIRLY_API_URL,
        method: 'get',
        url: '/v1/sensor/measurements',
        headers: {
          apikey: this.state.tokens.userProvidedAirly || this.state.tokens.airly,
        },
        params: {
          sensorId: this.state.nearestStation.id,
        },
      })
        .then((value) => {
          if (value.status === 200) {
            let measurements = value.data.currentMeasurements;
            // some stations don't have current measurements so we need to get latest historical
            if (isEmptyObject(measurements)) {
              measurements = value.data.history.reduceRight((acc, el) => {
                if (acc === null && isEmptyObject(el.measurements) === false) {
                  acc = el.measurements;
                }

                return acc;
              }, null);
            }

            if (this.state.currentMeasurements) {
              const oldCAQIMeta = getCAQIMeta(
                Math.round(this.state.currentMeasurements.airQualityIndex),
              );
              const newCAQIMeta = getCAQIMeta(Math.round(measurements.airQualityIndex));

              // tslint:disable-next-line:max-line-length
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
                currentMeasurements: measurements,
                lastUpdateDate: new Date(),
              },
              () => {
                ipcRenderer.send(IPC_EVENTS.AIR_Q_DATA_UPDATED, this.state.currentMeasurements);
                resolve();
              },
            );
          }
        })
        .catch((reason) => {
          this.setState(
            {
              currentMeasurements: null,
              lastUpdateDate: null,
            },
            () => {
              reject(reason);
            },
          );
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
            airlyApiStatus={this.state.airlyApiStatus}
            connectionStatus={this.state.connectionStatus}
            geolocationError={this.state.geolocationError}
            currentMeasurements={this.state.currentMeasurements}
            nearestStation={this.state.nearestStation}
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
