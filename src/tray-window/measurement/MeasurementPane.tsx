import * as React from 'react';

import { IAirlyCurrentMeasurement } from '../../airly';
import { Contaminates } from '../../contamination';
import { formatters, Measurement } from './Measurement';
import { Unit } from './MeasurementReadingUnit';

interface IMeasurementPaneProps {
  measurement?: IAirlyCurrentMeasurement;
}

const MeasurementPane = ({ measurement }: IMeasurementPaneProps) => {
  return (
    <div className="measurement-pane">
      <Measurement
        contaminate={Contaminates.PM25}
        reading={measurement.pm25}
        formatter={formatters.significant}
      />
      <Measurement
        contaminate={Contaminates.PM10}
        reading={measurement.pm10}
        formatter={formatters.significant}
      />
      <Measurement
        contaminate={Contaminates.PM1}
        reading={measurement.pm1}
        formatter={formatters.significant}
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
        reading={measurement.pressure / 100}
        formatter={formatters.toFixed1}
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
