import * as React from 'react';

import { SensorStation, ApiError, Measurements } from 'data/airqmon-api';

import Loader from 'app/tray-window/Loader';
import ErrorMessage from 'app/tray-window/ErrorMessage';
import UpdateAlert from 'app/tray-window/UpdateAlert';
import StationInfo from 'app/tray-window/StationInfo';
import AirQualityInfo from 'app/tray-window/air-quality/AirQualityInfo';
import MeasurementPane from 'app/tray-window/measurement/MeasurementPane';
import { AirlyApiError } from 'data/airly-api';
import { handleExtLinkClick } from 'common/helpers';

interface IContentProps {
  loadingMessage?: string;
  sensorStation?: SensorStation;
  apiError?: ApiError | AirlyApiError;
  connectionStatus: boolean;
  measurements: Measurements
}

class Content extends React.Component<IContentProps> {
  constructor(props: IContentProps) {
    super(props);
  }

  render(): JSX.Element {
    if (this.props.connectionStatus === false) {
      return (
        <ErrorMessage header="There is no Internet connection">
          <>Your computer is offline.</>
        </ErrorMessage>
      );
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
        case AirlyApiError.UNAUTHORIZED:
          return (
            <ErrorMessage header="Wrong API key">
              <>
                <p>API key is wrong or missing. You can get API key from
                  <a
                    className="link"
                    href="#"
                    onClick={handleExtLinkClick.bind(this, 'https://developer.airly.org/pl/docs#introduction')}
                  >Airly API docs</a>
                </p>
              </>
            </ErrorMessage>
          );
      }
    }

    if (this.props.sensorStation && this.props.measurements) {
      const {
        sensorStation: station,
        measurements
      } = this.props;

      return (
        <>
          <AirQualityInfo airQualityIndex={measurements.caqi} />
          <MeasurementPane measurement={measurements.values} />
          <div className="section-line" />
          <StationInfo station={station} />
          <UpdateAlert />
        </>
      );
    }

    return <Loader message={this.props.loadingMessage} />;
  }
}

export default Content;
