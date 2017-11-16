import * as React from 'react';

import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import { formatDateTo24Time } from '../helpers';

import Measurement from './Measurement';

const formatters = {
  toFixed2: (val: number) => val.toFixed(2),
  div1kToFixed2: (val: number) => (val / 1000).toFixed(2),
};

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
            <Measurement
              description="AQI"
              reading={currentMeasurements.airQualityIndex}
              formatter={formatters.toFixed2}
            />
            <Measurement
              description="Pollution level"
              reading={currentMeasurements.pollutionLevel}
            />
            <Measurement
              description="PM1"
              unit="μg/m<sup>3</sup>"
              reading={currentMeasurements.pm1}
              formatter={formatters.toFixed2}
            />
            <Measurement
              description="PM2.5"
              unit="μg/m<sup>3</sup>"
              reading={currentMeasurements.pm25}
              formatter={formatters.toFixed2}
            />
            <Measurement
              description="PM10"
              unit="μg/m<sup>3</sup>"
              reading={currentMeasurements.pm10}
              formatter={formatters.toFixed2}
            />
            <Measurement
              description="Temperature"
              unit="<sup>&deg;</sup>C"
              reading={currentMeasurements.temperature}
              formatter={formatters.toFixed2}
            />
            <Measurement
              description="Preassure"
              unit="hPa"
              reading={currentMeasurements.temperature}
              formatter={formatters.div1kToFixed2}
            />
            <Measurement
              description="Humidity"
              unit="%"
              reading={currentMeasurements.humidity}
              formatter={formatters.toFixed2}
            />
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
