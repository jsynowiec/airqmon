import * as React from 'react';

import { MeasurementReading, IMeasurementReadingProps } from './MeasurementReading';

export const formatters: { [key: string]: (val: number) => string } = {
  significant: (val: number) => Math.round(val).toFixed(0),
  toFixed2: (val: number) => val.toFixed(2),
  divBy100ToFixed2: (val: number) => (val / 100).toFixed(2),
};

export interface IMeasurementProps extends IMeasurementReadingProps {
  norm?: number;
  description: string;
}

export const Measurement = ({
  description,
  unit,
  reading,
  formatter,
  norm = null,
}: IMeasurementProps) => {
  if (typeof reading === 'string') {
    reading = parseFloat(reading);
  }

  const normContent =
    norm !== null ? (
      <span className="measurement__norm">({(reading / norm * 100).toFixed(0)}%)</span>
    ) : null;

  const content = (
    <div className="measurement">
      <MeasurementReading reading={reading} unit={unit} formatter={formatter} />
      <div className="measurement__description">
        {description}
        {normContent}
      </div>
    </div>
  );

  return reading !== null && reading !== undefined ? content : null;
};
