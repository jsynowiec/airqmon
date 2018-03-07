import * as React from 'react';

import {
  Contaminates,
  CONTAMINATION_NORM_VALUES,
  CONTAMINATION_THRESHOLDS,
  getContaminationThresholdIndex,
} from '../../contamination';

import { MeasurementReading, IMeasurementReadingProps } from './MeasurementReading';
import { Unit } from './MeasurementReadingUnit';

export const formatters: { [key: string]: (val: number) => string } = {
  significant: (val) => val.toFixed(0),
  toFixed2: (val) => val.toFixed(2),
  toFixed1: (val) => val.toFixed(1),
};

const CONTAMINATE_DESCRIPTIONS = {
  [Contaminates.PM1]: 'PM1',
  [Contaminates.PM10]: 'PM10',
  [Contaminates.PM25]: 'PM2.5',
};

const CONTAMINATE_UNITS = {
  [Contaminates.PM1]: Unit.PM,
  [Contaminates.PM10]: Unit.PM,
  [Contaminates.PM25]: Unit.PM,
};

const CONTAMINATE_FORMATTERS = {
  [Contaminates.PM1]: formatters.significant,
  [Contaminates.PM10]: formatters.significant,
  [Contaminates.PM25]: formatters.significant,
};

export interface IMeasurementProps extends IMeasurementReadingProps {
  contaminate?: Contaminates;
  description?: string;
  norm?: number;
}

export const Measurement: React.SFC<IMeasurementProps> = ({
  contaminate,
  reading,
  description = CONTAMINATE_DESCRIPTIONS[contaminate],
  formatter = CONTAMINATE_FORMATTERS[contaminate],
  norm = CONTAMINATION_NORM_VALUES[contaminate],
  unit = CONTAMINATE_UNITS[contaminate],
}) => {
  if (typeof reading === 'string') {
    reading = parseFloat(reading);
  }

  let normContent: JSX.Element = null;
  if (contaminate && CONTAMINATION_THRESHOLDS[contaminate]) {
    const normContentClassName = `measurement__norm treshold-${getContaminationThresholdIndex(
      contaminate,
      reading,
    )}`;
    normContent = <div className={normContentClassName}>{(reading / norm * 100).toFixed(0)}%</div>;
  }

  return (
    <div className="measurement">
      <MeasurementReading reading={reading} unit={unit} formatter={formatter}>
        {normContent}
      </MeasurementReading>
      <div className="measurement__description">{description}</div>
    </div>
  );
};
