import * as React from 'react';

import { MeasurementReading, IMeasurementReadingProps } from './MeasurementReading';

export interface IMeasurementProps extends IMeasurementReadingProps {
  description: string;
}

export const MeasurementValue = ({ description, unit, reading, formatter }: IMeasurementProps) => {
  return (
    <div className="measurement">
      <MeasurementReading
        reading={reading}
        unit={unit}
        formatter={formatter}
      />
      <div className="description">{description}</div>
    </div>
  );
};
