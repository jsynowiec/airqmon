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
  return (
    <>
      <div className="measurement__reading">
        {formatter ? formatter(reading) : reading}
        <MeasurementReadingUnit unit={unit} />
      </div>
    </>
  );
};
