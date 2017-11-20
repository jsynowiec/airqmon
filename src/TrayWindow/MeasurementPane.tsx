import * as React from 'react';

import { IAirlyCurrentMeasurement } from '../airly';
import { MeasurementValue } from './Measurements/MeasurementValue';
import { Unit } from './Measurements/MeasurementReadingUnit';

const formatters: { [key: string]: (val: string|number) => string } = {
  toFixed2: (val: number) => val.toFixed(2),
  divBy100ToFixed2: (val: number) => (val / 100).toFixed(2),
};

interface IMeasurementPaneProps {
  measurement?: IAirlyCurrentMeasurement;
}

const MeasurementPane = ({ measurement }: IMeasurementPaneProps) => {
  return (
    <div className="measurement-pane">
      <MeasurementValue
        description="CAQI"
        reading={measurement.airQualityIndex}
        formatter={formatters.toFixed2}
      />
      <MeasurementValue
        description="Pollution level"
        reading={measurement.pollutionLevel}
      />
      <MeasurementValue
        description="PM1"
        unit={Unit.PM}
        reading={measurement.pm1}
        formatter={formatters.toFixed2}
      />
      <MeasurementValue
        description="PM2.5"
        unit={Unit.PM}
        reading={measurement.pm25}
        formatter={formatters.toFixed2}
      />
      <MeasurementValue
        description="PM10"
        unit={Unit.PM}
        reading={measurement.pm10}
        formatter={formatters.toFixed2}
      />
      <MeasurementValue
        description="Temperature"
        unit={Unit.TEMP_C}
        reading={measurement.temperature}
        formatter={formatters.toFixed2}
      />
      <MeasurementValue
        description="Pressure"
        unit={Unit.PRESSURE_PA}
        reading={measurement.pressure}
        formatter={formatters.divBy100ToFixed2}
      />
      <MeasurementValue
        description="Humidity"
        unit={Unit.PERCENT}
        reading={measurement.humidity}
        formatter={formatters.toFixed2}
      />
    </div>
  );
};

export default MeasurementPane;
