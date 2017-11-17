import * as React from 'react';

import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import MeasurementPane from './MeasurementPane';
import { getCAQIMeta } from '../caqi';

interface ITrayContentProps {
  currentMeasurements?: IAirlyCurrentMeasurement;
  nearestStation?: IArilyNearestSensorMeasurement;
}

const TrayContent = ({ currentMeasurements, nearestStation }: ITrayContentProps) => {
  if (currentMeasurements) {
    const airQualityMeta = getCAQIMeta(currentMeasurements.airQualityIndex);

    return (
      <div className="window-content">
        <div className="pane">

          <div className="summary">
            Air quality is&nbsp;
            <strong>
              {airQualityMeta.labels.airQuality.toLowerCase()}
            </strong>.
          </div>

          <MeasurementPane measurement={currentMeasurements} />

          <div className="summary small">{airQualityMeta.description}</div>

          <div className="summary small">
            Distance to station {(nearestStation.distance / 1000).toFixed(2)} km<br/>
            {`${nearestStation.address.locality}, ${nearestStation.address.route}`}
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="window-content">
      <div className="pane">
        <div className="summary">Loading&hellip;</div>
      </div>
    </div>
  );
};

export default TrayContent;
