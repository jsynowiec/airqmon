import * as React from 'react';

import { MeasurementReadingUnit, IMeasurementReadingUnitProps } from './MeasurementReadingUnit';

export interface IMeasurementReadingProps extends IMeasurementReadingUnitProps {
  reading?: number | string;
  formatter?: (val: number | string) => string;
}

export const MeasurementReading: React.SFC<IMeasurementReadingProps> = ({
  reading,
  formatter,
  unit,
  children,
}) => {
  const content = reading ? (formatter ? formatter(reading) : reading) : 'n/a';

  return (
    <>
      <div className="measurement__reading">
        {content}
        {reading ? <MeasurementReadingUnit unit={unit} /> : null}
        {children}
      </div>
    </>
  );
};
