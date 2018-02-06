import * as React from 'react';

import { MeasurementReading, IMeasurementReadingProps } from './MeasurementReading';

export const formatters: { [key: string]: (val: number) => string } = {
  significant: (val: number) => val.toFixed(0),
  toFixed2: (val: number) => val.toFixed(2),
  toFixed1: (val: number) => val.toFixed(1),
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

  return (
    <div className="measurement">
      <MeasurementReading reading={reading} unit={unit} formatter={formatter} />
      <div className="measurement__description">
        {description}
        {normContent}
      </div>
    </div>
  );
};
