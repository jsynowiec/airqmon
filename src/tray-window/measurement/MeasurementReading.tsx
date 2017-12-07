import * as React from 'react';

import { MeasurementReadingUnit, IMeasurementReadingUnitProps } from './MeasurementReadingUnit';

export interface IMeasurementReadingProps extends IMeasurementReadingUnitProps {
  reading?: number | string;
  formatter?: (val: number | string) => string;
}

export const MeasurementReading = ({
  reading = null,
  formatter = null,
  unit = null,
}: IMeasurementReadingProps) => {
  const content = reading !== null ? (formatter ? formatter(reading) : reading) : '-';

  return (
    <div className="reading">
      <span className="value">{content}</span>
      <MeasurementReadingUnit unit={unit} />
    </div>
  );
};
