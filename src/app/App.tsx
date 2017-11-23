import { ipcRenderer } from 'electron';
import * as React from 'react';
import axios from 'axios';

import { getLocation } from '../geolocation';
import { TrayWindow } from '../tray-window';
import updateChecker from '../update-checker';

import {
  AIRLY_API_URL,
  IAirlyCurrentMeasurement,
  IArilyNearestSensorMeasurement,
} from '../airly';
import { getCAQIMeta } from '../caqi';
import IPC_EVENTS from '../ipc-events';

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
  connectionStatus: Boolean;
  lastUpdateDate?: Date;
  latitude?: number;
  longitude?: number;
  nearestStation?: IArilyNearestSensorMeasurement;
  currentMeasurements?: IAirlyCurrentMeasurement;
}

interface IAppState extends IBaseAppState, IDataAppState {
  isAutoRefreshEnabled: Boolean;
}

const REFRESH_DELAY = 300000; // 5 minutes

let refreshTimer: NodeJS.Timer = null;

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      isAutoRefreshEnabled: true,
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
          if (refreshTimer) {
            clearInterval(refreshTimer);
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
          const oldStation = this.state.nearestStation;

          this.findNearestStation().then((station: IArilyNearestSensorMeasurement) => {
            if (oldStation) {
              if (oldStation.id !== station.id) {
                new Notification('Location changed', {
                  // tslint:disable-next-line:max-line-length
                  body: `Found a new nearest sensor station ${(this.state.nearestStation.distance / 1000).toFixed(2)} away located at ${this.state.nearestStation.address.locality}, ${this.state.nearestStation.address.route}.`,
                });
              }
            }

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
      }).then((value) => {
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
      }).catch((reason) => {
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
    }).then((value) => {
      if (value.status === 200) {
        if (this.state.currentMeasurements) {
          const oldCAQIMeta = getCAQIMeta(this.state.currentMeasurements.airQualityIndex);
          const newCAQIMeta = getCAQIMeta(value.data.currentMeasurements.airQualityIndex);

          if (oldCAQIMeta.index !== newCAQIMeta.index) {
            new Notification('Air quality changed', {
              // tslint:disable-next-line:max-line-length
              body: `Air quality changed from ${oldCAQIMeta.labels.airQuality.toLowerCase()} to ${newCAQIMeta.labels.airQuality.toLowerCase()}. Pollution is now ${newCAQIMeta.labels.pollution.toLowerCase()}.`,
            });
          }
        }

        this.setState(
          {
            currentMeasurements: value.data.currentMeasurements,
            lastUpdateDate: new Date(),
          },
          () => {
            ipcRenderer.send(IPC_EVENTS.AIR_Q_DATA_UPDATED, this.state.currentMeasurements);
          },
        );
      }
    }).catch(() => {
      this.setState({
        currentMeasurements: null,
        lastUpdateDate: null,
      });
    });
  }

  enableRefreshTimer() {
    if (refreshTimer) {
      clearInterval(refreshTimer);
    }

    refreshTimer = setInterval(
      () => {
        this.refreshData();
      },
      REFRESH_DELAY,
    );
  }

  notifyAboutAvailableUpdate(version, url) {
    new Notification('Update available', {
      body: `Version ${version} is available to download.`,
    }).addEventListener('click', () => {
      ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
    });
  }

  handleRefreshClick() {
    this.setState({ isAutoRefreshEnabled: !this.state.isAutoRefreshEnabled }, () => {
      if (this.state.isAutoRefreshEnabled) {
        this.enableRefreshTimer();
      } else {
        clearInterval(refreshTimer);
      }
    });
  }

  handleQuitClick() {
    ipcRenderer.send(IPC_EVENTS.CLOSE_WINDOW);
  }

  render() {
    return (
      <div>
        <div className="header-arrow" />
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
    );
  }
}

export default App;
