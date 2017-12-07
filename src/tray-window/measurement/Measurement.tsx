import * as React from 'react';

import { MeasurementReading, IMeasurementReadingProps } from './MeasurementReading';

export const formatters: { [key: string]: (val: string | number) => string } = {
  toFixed2: (val: number) => val.toFixed(2),
  divBy100ToFixed2: (val: number) => (val / 100).toFixed(2),
};

export interface IMeasurementProps extends IMeasurementReadingProps {
  description: string;
}

export const Measurement = ({ description, unit, reading, formatter }: IMeasurementProps) => {
  return (
    <div className="measurement">
      <MeasurementReading reading={reading} unit={unit} formatter={formatter} />
      <div className="description">{description}</div>
    </div>
  );
};
