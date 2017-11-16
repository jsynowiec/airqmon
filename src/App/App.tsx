import { ipcRenderer } from 'electron';
import * as React from 'react';
import axios from 'axios';

import { getLocation } from '../helpers';

import { Content, Header, Footer } from '../TrayWindow';

import {
  AIRLY_API_URL,
  IAirlyCurrentMeasurement,
  IArilyNearestSensorMeasurement,
} from '../airly';

interface IAppProps {
  airlyToken: string;
}

interface IAppState {
  tokens: {
    airly: string;
  };
  autoRefresh: Boolean;
  lastUpdate?: Date;
  latitude?: number;
  longitude?: number;
  nearestStation?: IArilyNearestSensorMeasurement;
  currentMeasurements?: IAirlyCurrentMeasurement;
}

const REFRESH_DELAY = 120000; // 2 minutes

let refreshTimer: NodeJS.Timer;

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: IAppProps) {
    super(props);

    this.state = {
      autoRefresh: true,
      tokens: {
        airly: this.props.airlyToken,
      },
    };

    this.refreshData = this.refreshData.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
    this.handleQuitClick = this.handleQuitClick.bind(this);
  }

  componentDidMount() {
    getLocation().then((position) => {
      this.setState(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        () => {
          this.findNearestStation().then(() => {
            this.refreshData();
            this.toggleRefreshTimer();
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
              resolve();
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
        this.setState(
          {
            currentMeasurements: value.data.currentMeasurements,
            lastUpdate: new Date(),
          },
          () => {
            ipcRenderer.send('airq-data-update', this.state.currentMeasurements);
          },
        );
      }
    }).catch(() => {
      this.setState({
        currentMeasurements: null,
        lastUpdate: null,
      });
    });
  }

  toggleRefreshTimer() {
    if (this.state.autoRefresh) {
      refreshTimer = setInterval(
        () => {
          this.refreshData();
        },
        REFRESH_DELAY,
      );
    } else {
      clearInterval(refreshTimer);
    }
  }

  handleRefreshClick() {
    this.setState({ autoRefresh: !this.state.autoRefresh }, () => {
      this.toggleRefreshTimer();
    });
  }

  handleQuitClick() {
    ipcRenderer.send('close-window');
  }

  render() {
    return (
      <div>
        <div className="header-arrow" />
        <div className="window">
          <Header />
          <Content
            currentMeasurements={this.state.currentMeasurements}
            nearestStation={this.state.nearestStation}
            lastUpdate={this.state.lastUpdate}
          />
          <Footer
            isAutoRefreshActive={this.state.autoRefresh}
            onQuitClick={this.handleQuitClick}
            onRefreshClick={this.handleRefreshClick}
          />
        </div>
      </div>
    );
  }
}

export default App;
