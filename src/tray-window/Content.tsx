import * as React from 'react';
import { ipcRenderer } from 'electron';

import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import UpdateAlert from './UpdateAlert';
import StationInfo from './StationInfo';
import AirQualityInfo from './air-quality/AirQualityInfo';
import { AirlyAPIStatus, IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import MeasurementPane from './measurement/MeasurementPane';
import IPC_EVENTS from '../ipc-events';

interface IContentProps {
  availableAppUpdate?: { version: string; url: string };
  currentMeasurements?: IAirlyCurrentMeasurement;
  nearestStation?: IArilyNearestSensorMeasurement;
  airlyApiStatus?: AirlyAPIStatus;
  connectionStatus: boolean;
}

class Content extends React.Component<IContentProps> {
  constructor(props: IContentProps) {
    super(props);
  }

  handleExtLinkClick(url: string) {
    ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
  }

  render() {
    if (this.props.connectionStatus === false) {
      return (
        <ErrorMessage
          header="There is no Internet connection"
          message="Your computer is offline."
        />
      );
    }

    if (this.props.airlyApiStatus !== AirlyAPIStatus.OK) {
      switch (this.props.airlyApiStatus) {
        case AirlyAPIStatus.OTHER_ERROR:
        case AirlyAPIStatus.RATE_LIMIT_EXCEEDED:
          return (
            <ErrorMessage
              header="Communication problem"
              message="There was an unexpected response while requesting sensor station data. Request will be send again in a few minutes."
            />
          );
        case AirlyAPIStatus.NO_STATION:
          return <ErrorMessage message="There is no sensor station available in your vicinity." />;
      }
    }

    if (this.props.currentMeasurements) {
      const station = this.props.nearestStation;
      // tslint:disable-next-line:max-line-length
      const stationUrl = `https://map.airly.eu/en/#latitude=${
        station.location.latitude
      }&longitude=${station.location.longitude}&id=${station.id}`;

      const updateAlert = this.props.availableAppUpdate ? (
        <UpdateAlert
          onClickHandler={this.handleExtLinkClick.bind(this, this.props.availableAppUpdate.url)}
        />
      ) : null;

      return (
        <>
          {updateAlert}
          <AirQualityInfo airQualityIndex={this.props.currentMeasurements.airQualityIndex} />
          <MeasurementPane measurement={this.props.currentMeasurements} />
          <StationInfo
            station={station}
            onClickHandler={this.handleExtLinkClick.bind(this, stationUrl)}
          />
        </>
      );
    }

    return <Loader />;
  }
}

export default Content;
