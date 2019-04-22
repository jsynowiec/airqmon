import * as React from 'react';

import { Contaminants } from 'common/contamination';
import { MeasurementValue, MeasurementValueNames } from 'data/airqmon-api';

import { formatters, Measurement } from './Measurement';
import { Unit } from './MeasurementReadingUnit';

interface IMeasurementPaneProps {
  measurement?: MeasurementValue[];
}

const MeasurementPane: React.SFC<IMeasurementPaneProps> = (props) => {
  const { measurement } = props;

  const getValue = (measurement, name: MeasurementValueNames): number | null => {
    return (measurement.find((value) => value.name == name) || {}).value || null;
  };

  const pressure = getValue(measurement, MeasurementValueNames.PRESSURE);

  return (
    <div className="measurement__pane">
      <Measurement
        contaminant={Contaminants.PM25}
        reading={getValue(measurement, MeasurementValueNames.PM25)}
        formatter={formatters.toFixed1}
      />
      <Measurement
        contaminant={Contaminants.PM10}
        reading={getValue(measurement, MeasurementValueNames.PM10)}
        formatter={formatters.toFixed1}
      />
      <Measurement
        contaminant={Contaminants.PM1}
        reading={getValue(measurement, MeasurementValueNames.PM1)}
        formatter={formatters.toFixed1}
      />
      <Measurement
        description="Temperature"
        unit={Unit.TEMP_C}
        reading={getValue(measurement, MeasurementValueNames.TEMPERATURE)}
        formatter={formatters.toFixed1}
      />
      <Measurement
        description="Pressure"
        unit={Unit.PRESSURE_PA}
        reading={pressure}
        formatter={formatters.significant}
      />
      <Measurement
        description="Humidity"
        unit={Unit.PERCENT}
        reading={getValue(measurement, MeasurementValueNames.HUMIDITY)}
        formatter={formatters.significant}
      />
    </div>
  );
};

export default MeasurementPane;
