import * as React from 'react';
import { ipcRenderer } from 'electron';

import IPC_EVENTS from 'common/ipc-events';
import { SensorStation, ApiError } from 'data/airqmon-api';

import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import UpdateAlert from './UpdateAlert';
import StationInfo from './StationInfo';
import AirQualityInfo from './air-quality/AirQualityInfo';
import MeasurementPane from './measurement/MeasurementPane';

interface IContentProps {
  availableAppUpdate?: { version: string; url: string };
  loadingMessage?: string;
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
                There was an unexpected response while requesting sensor station data. A new request
                will be sent again in a few minutes.
              </>
            </ErrorMessage>
          );
        case ApiError.NO_STATION:
          return (
            <ErrorMessage header="Sensor station unavailable">
              <>Unfortunately, there is no available sensor station in the vicinity.</>
            </ErrorMessage>
          );
      }
    }

    if (this.props.sensorStation && this.props.sensorStation.measurements) {
      const { sensorStation: station, distanceToStation: distance } = this.props;

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
          <div className="section-line" />
          <StationInfo distance={distance} station={station} />
        </>
      );
    }

    return <Loader message={this.props.loadingMessage} />;
  }
}

export default Content;
