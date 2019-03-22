import * as React from 'react';

import { Contaminants } from '../../contamination';
import { formatters, Measurement } from './Measurement';
import { Unit } from './MeasurementReadingUnit';
import { MeasurementValue, MeasurementValueNames } from '../../airqmon-api';

interface IMeasurementPaneProps {
  measurement?: MeasurementValue[];
}

const MeasurementPane: React.SFC<IMeasurementPaneProps> = (props) => {
  const { measurement } = props;

  return (
    <div className="measurement__pane">
      <Measurement
        contaminant={Contaminants.PM25}
        reading={measurement.find((value) => value.name == MeasurementValueNames.PM25).value}
        formatter={formatters.significant}
      />
      <Measurement
        contaminant={Contaminants.PM10}
        reading={measurement.find((value) => value.name == MeasurementValueNames.PM10).value}
        formatter={formatters.significant}
      />
      <Measurement
        contaminant={Contaminants.PM1}
        reading={measurement.find((value) => value.name == MeasurementValueNames.PM1).value}
        formatter={formatters.significant}
      />
      <Measurement
        description="Temperature"
        unit={Unit.TEMP_C}
        reading={measurement.find((value) => value.name == MeasurementValueNames.TEMPERATURE).value}
        formatter={formatters.toFixed2}
      />
      <Measurement
        description="Pressure"
        unit={Unit.PRESSURE_PA}
        reading={
          measurement.find((value) => value.name == MeasurementValueNames.PRESSURE).value / 100
        }
        formatter={formatters.toFixed1}
      />
      <Measurement
        description="Humidity"
        unit={Unit.PERCENT}
        reading={measurement.find((value) => value.name == MeasurementValueNames.HUMIDITY).value}
        formatter={formatters.toFixed2}
      />
    </div>
  );
};

export default MeasurementPane;
