import * as React from 'react';

import { Unit, MeasurementReadingUnit } from './MeasurementReadingUnit';

export interface IMeasurementReadingProps {
  reading?: number;
  formatter?: (val: number) => string;
  unit?: Unit;
}

export const MeasurementReading: React.SFC<IMeasurementReadingProps> = ({
  reading,
  formatter,
  unit,
  children,
}) => (
  <>
    <div className="measurement__reading">
      {reading != null ? (formatter ? formatter(reading) : reading) : 'n/a'}
      {reading && unit ? <MeasurementReadingUnit unit={unit} /> : null}
      {children}
    </div>
  </>
);
