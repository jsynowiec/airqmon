import * as React from 'react';
import { ipcRenderer } from 'electron';

import Loader from './Loader';
import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import MeasurementPane from './MeasurementPane';
import { getCAQIMeta } from '../caqi';
import IPC_EVENTS from '../ipc-events';

interface ITrayContentProps {
  availableAppUpdate?: { version: string, url: string};
  currentMeasurements?: IAirlyCurrentMeasurement;
  nearestStation?: IArilyNearestSensorMeasurement;
  connectionStatus: Boolean;
}

class TrayContent extends React.Component<ITrayContentProps> {
  constructor(props: ITrayContentProps) {
    super(props);
  }

  handleExtLinkClick(url) {
    ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
  }

  render() {
    if (!this.props.connectionStatus) {
      return (
        <div className="window-content">
          <div className="pane centered-content">
            <div className="summary">
              <strong>There is no Internet connection</strong><br/>
              Your computer is offline.
            </div>
          </div>
        </div>
      );
    }

    if (this.props.currentMeasurements) {
      const airQualityMeta = getCAQIMeta(this.props.currentMeasurements.airQualityIndex);
      const station = this.props.nearestStation;
      // tslint:disable-next-line:max-line-length
      const stationUrl = `https://map.airly.eu/en/#latitude=${station.location.latitude}&longitude=${station.location.longitude}&id=${station.id}`;

      const updateLabel = this.props.availableAppUpdate ? (
        <div className="summary small available-update">
          <a
            className="link"
            href="#"
            onClick={this.handleExtLinkClick.bind(this, this.props.availableAppUpdate.url)}
          >
            <strong>Heads up!</strong> A new version is available for download.
          </a>
        </div>
      ) : null;

      return (
        <div className="window-content">
          <div className="pane">

            {updateLabel}

            <div className="summary">
              Air quality is&nbsp;
              <strong>
                {airQualityMeta.labels.airQuality.toLowerCase()}
              </strong>.
            </div>

            <div className="summary small">{airQualityMeta.description}</div>

            <MeasurementPane measurement={this.props.currentMeasurements} />

            <div className="summary small">
              Distance to station {(station.distance / 1000).toFixed(2)} km<br/>
              <a
                className="link"
                href="#"
                onClick={this.handleExtLinkClick.bind(this, stationUrl)}
              >
              {`${station.address.locality}, ${station.address.route}`}
              </a>
            </div>

          </div>
        </div>
      );
    }

    return (
      <div className="window-content">
        <div className="pane centered-content">
          <Loader />
        </div>
      </div>
    );
  }
}

export default TrayContent;
