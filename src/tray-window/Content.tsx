import * as React from 'react';
import { ipcRenderer } from 'electron';

import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import UpdateAlert from './UpdateAlert';
import StationInfo from './StationInfo';
import AirQualityInfo from './air-quality/AirQualityInfo';
import MeasurementPane from './measurement/MeasurementPane';
import IPC_EVENTS from '../ipc-events';
import { SensorStation, ApiError } from '../airqmon-api';

interface IContentProps {
  availableAppUpdate?: { version: string; url: string };
  distanceToStation?: number;
  sensorStation?: SensorStation;
  apiError?: ApiError;
  geolocationError?: PositionError;
  connectionStatus: boolean;
}

class Content extends React.Component<IContentProps> {
  constructor(props: IContentProps) {
    super(props);
  }

  handleExtLinkClick(url: string, event: MouseEvent) {
    event.preventDefault();
    ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
  }

  render() {
    if (this.props.connectionStatus === false) {
      return (
        <ErrorMessage header="There is no Internet connection">
          <>Your computer is offline.</>
        </ErrorMessage>
      );
    }

    if (this.props.geolocationError) {
      const error = this.props.geolocationError;
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return (
            <ErrorMessage header="Location services unavailable">
              <>
                The application is not allowed to access Location Services or the Location Services
                are disabled. Please allow Airqmon to use Location Services in the Security &
                Privacy macOS preferences and then restart the application.
              </>
            </ErrorMessage>
          );
        case error.POSITION_UNAVAILABLE:
          return (
            <ErrorMessage header="Location unavailable">
              <>
                Your location could not be determined. Try again later or try restarting the app.
                Make sure that you have access to the Internet.
              </>
            </ErrorMessage>
          );
      }
    }

    if (this.props.apiError) {
      switch (this.props.apiError) {
        case ApiError.CONNECTION_ERROR:
          return (
            <ErrorMessage header="Communication problem">
              <>
                There was an unexpected response while requesting sensor station data. Request will
                be send again in a few minutes.
              </>
            </ErrorMessage>
          );
      }
    }

    if (this.props.sensorStation && this.props.sensorStation.measurements) {
      const { sensorStation: station, distanceToStation: distance } = this.props;

      const stationUrl = `https://map.airly.eu/en/#latitude=${
        station.location.latitude
      }&longitude=${station.location.longitude}&id=${station.providerId}`;

      const updateAlert = this.props.availableAppUpdate ? (
        <UpdateAlert
          onClickHandler={this.handleExtLinkClick.bind(this, this.props.availableAppUpdate.url)}
        />
      ) : null;

      return (
        <>
          {updateAlert}
          <AirQualityInfo airQualityIndex={station.measurements.caqi} />
          <MeasurementPane measurement={station.measurements.values} />
          <StationInfo
            distance={distance}
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
