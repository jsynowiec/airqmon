import * as React from 'react';

import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import { formatDateTo24Time } from '../helpers';

interface ITrayContentProps {
  currentMeasurements?: IAirlyCurrentMeasurement;
  nearestStation?: IArilyNearestSensorMeasurement;
  lastUpdate?: Date;
}

const TrayContent = ({ currentMeasurements, nearestStation, lastUpdate }: ITrayContentProps) => {
  if (currentMeasurements) {
    return (
      <div className="window-content">
        <div className="pane">
          <div className="measurement-pane">
            <div className="measurement">
              <div className="reading">{currentMeasurements.airQualityIndex.toFixed(2)}</div>
              <div className="description">AQI</div>
            </div>
            <div className="measurement">
              <div className="reading">{currentMeasurements.pollutionLevel}</div>
              <div className="description">Pollution level</div>
            </div>
            <div className="measurement">
              <div className="reading">{currentMeasurements.pm1.toFixed(2)} μg/m<sup>3</sup></div>
              <div className="description">PM1</div>
            </div>
            <div className="measurement">
              <div className="reading">{currentMeasurements.pm25.toFixed(2)} μg/m<sup>3</sup></div>
              <div className="description">PM2.5</div>
            </div>
            <div className="measurement">
              <div className="reading">{currentMeasurements.pm10.toFixed(2)} μg/m<sup>3</sup></div>
              <div className="description">PM10</div>
            </div>
            <div className="measurement">
              <div className="reading">
                {currentMeasurements.temperature.toFixed(2)} <sup>&deg;</sup>C
              </div>
              <div className="description">Temperature</div>
            </div>
            <div className="measurement">
              <div className="reading">{(currentMeasurements.pressure / 1000).toFixed(2)} hPa</div>
              <div className="description">Preassure</div>
            </div>
            <div className="measurement">
              <div className="reading">{currentMeasurements.humidity.toFixed(2)} %</div>
              <div className="description">Humidity</div>
            </div>
          </div>

          <div className="summary small">
            Distance to station {(nearestStation.distance / 1000).toFixed(2)} km<br/>
            {`${nearestStation.address.locality}, ${nearestStation.address.route}`}
          </div>

          <div className="summary small">
            Last update {formatDateTo24Time(lastUpdate)}
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
