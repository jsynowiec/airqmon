import { ipcRenderer } from 'electron';
import * as React from 'react';
import axios from 'axios';

import visitor from '../analytics';
import { getLocation } from '../geolocation';
import { TrayWindow } from '../tray-window';
import updateChecker from '../update-checker';

import { AIRLY_API_URL, IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import { getCAQIMeta } from '../caqi';
import { isEmptyObject } from '../helpers';
import IPC_EVENTS from '../ipc-events';
import { shouldNotifyAbout, userSettings } from '../user-settings';

interface IAppProps {
  airlyToken: string;
}

interface IBaseAppState {
  tokens: {
    airly: string;
  };
  appUpdate?: {
    version: string;
    url: string;
  };
}

interface IDataAppState {
  connectionStatus: boolean;
  lastUpdateDate?: Date;
  latitude?: number;
  longitude?: number;
  nearestStation?: IArilyNearestSensorMeasurement;
  currentMeasurements?: IAirlyCurrentMeasurement;
}

interface IAppState extends IBaseAppState, IDataAppState {
  isAutoRefreshEnabled: boolean;
}

const REFRESH_DELAY = 300000; // 5 minutes

class App extends React.Component<IAppProps, IAppState> {
  private lastUsedStationId?: number = null;
  private refreshTimer: NodeJS.Timer = null;

  constructor(props: IAppProps) {
    super(props);

    this.state = {
      isAutoRefreshEnabled: userSettings.get('refreshMeasurements'),
      connectionStatus: false,
      tokens: {
        airly: this.props.airlyToken,
      },
    };

    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handleQuitClick = this.handleQuitClick.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(IPC_EVENTS.CONN_STATUS_CHANGED, (_, status) => {
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
          if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
          }
        } else {
          this.init();
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
  }

  init() {
    getLocation().then((position) => {
      this.setState(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        () => {
          this.findNearestStation().then((station: IArilyNearestSensorMeasurement) => {
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

            this.refreshData();
            if (this.state.isAutoRefreshEnabled) {
              this.enableRefreshTimer();
            }
          });
        },
      );
    });
  }

  findNearestStation() {
    return new Promise((resolve, reject) => {
      axios({
        baseURL: AIRLY_API_URL,
        method: 'get',
        url: '/v1/nearestSensor/measurements',
        headers: {
          apikey: this.state.tokens.airly,
        },
        params: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
      })
        .then((value) => {
          if (value.status === 200) {
            this.setState(
              {
                nearestStation: value.data,
              },
              () => {
                resolve(value.data);
              },
            );
          }
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  }

  refreshData() {
    axios({
      baseURL: AIRLY_API_URL,
      method: 'get',
      url: '/v1/sensor/measurements',
      headers: {
        apikey: this.state.tokens.airly,
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
            },
          );
        }
      })
      .catch(() => {
        this.setState({
          currentMeasurements: null,
          lastUpdateDate: null,
        });
      });
  }

  enableRefreshTimer() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    this.refreshTimer = setInterval(() => {
      this.refreshData();
    }, REFRESH_DELAY);
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
    this.setState({ isAutoRefreshEnabled: !this.state.isAutoRefreshEnabled }, () => {
      userSettings.set('refreshMeasurements', this.state.isAutoRefreshEnabled);

      if (this.state.isAutoRefreshEnabled) {
        this.enableRefreshTimer();
      } else {
        clearInterval(this.refreshTimer);
      }
    });
  }

  handleQuitClick() {
    ipcRenderer.send(IPC_EVENTS.CLOSE_WINDOW);
  }

  render() {
    return (
      <>
        <div className="header-arrow" />
        <div className="window">
          <TrayWindow
            connectionStatus={this.state.connectionStatus}
            currentMeasurements={this.state.currentMeasurements}
            nearestStation={this.state.nearestStation}
            lastUpdateDate={this.state.lastUpdateDate}
            isAutoRefreshEnabled={this.state.isAutoRefreshEnabled}
            availableAppUpdate={this.state.appUpdate}
            onRefreshClickHandler={this.handleRefreshClick}
            onQuitClickHandler={this.handleQuitClick}
          />
        </div>
      </>
    );
  }
}

export default App;
