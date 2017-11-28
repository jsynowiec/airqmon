import * as React from 'react';

import { IAirlyCurrentMeasurement } from '../airly';
import { formatters, Measurement } from './measurement/Measurement';
import { Unit } from './measurement/MeasurementReadingUnit';

interface IMeasurementPaneProps {
  measurement?: IAirlyCurrentMeasurement;
}

const MeasurementPane = ({ measurement }: IMeasurementPaneProps) => {
  return (
    <div className="measurement-pane">
      <Measurement
        description="CAQI"
        reading={measurement.airQualityIndex}
        formatter={formatters.toFixed2}
      />
      <Measurement
        description="Pollution level"
        reading={measurement.pollutionLevel}
      />
      <Measurement
        description="PM1"
        unit={Unit.PM}
        reading={measurement.pm1}
        formatter={formatters.toFixed2}
      />
      <Measurement
        description="PM2.5"
        unit={Unit.PM}
        reading={measurement.pm25}
        formatter={formatters.toFixed2}
      />
      <Measurement
        description="PM10"
        unit={Unit.PM}
        reading={measurement.pm10}
        formatter={formatters.toFixed2}
      />
      <Measurement
        description="Temperature"
        unit={Unit.TEMP_C}
        reading={measurement.temperature}
        formatter={formatters.toFixed2}
      />
      <Measurement
        description="Pressure"
        unit={Unit.PRESSURE_PA}
        reading={measurement.pressure}
        formatter={formatters.divBy100ToFixed2}
      />
      <Measurement
        description="Humidity"
        unit={Unit.PERCENT}
        reading={measurement.humidity}
        formatter={formatters.toFixed2}
      />
    </div>
  );
};

export default MeasurementPane;
