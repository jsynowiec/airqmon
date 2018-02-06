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
  const content = reading ? (formatter ? formatter(reading) : reading) : 'n/a';

  return (
    <>
      <div className="measurement__reading">
        {content}
        {reading ? <MeasurementReadingUnit unit={unit} /> : null}
      </div>
    </>
  );
};
