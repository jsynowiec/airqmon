import * as React from 'react';

import {
  Contaminants,
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

const CONTAMINANT_DESCRIPTIONS = {
  [Contaminants.PM1]: 'PM1',
  [Contaminants.PM10]: 'PM10',
  [Contaminants.PM25]: 'PM2.5',
};

const CONTAMINANT_UNITS = {
  [Contaminants.PM1]: Unit.PM,
  [Contaminants.PM10]: Unit.PM,
  [Contaminants.PM25]: Unit.PM,
};

const CONTAMINANT_FORMATTERS = {
  [Contaminants.PM1]: formatters.significant,
  [Contaminants.PM10]: formatters.significant,
  [Contaminants.PM25]: formatters.significant,
};

export interface IMeasurementProps extends IMeasurementReadingProps {
  contaminant?: Contaminants;
  description?: string;
  norm?: number;
}

export const Measurement: React.SFC<IMeasurementProps> = ({
  contaminant,
  reading,
  description = CONTAMINANT_DESCRIPTIONS[contaminant],
  formatter = CONTAMINANT_FORMATTERS[contaminant],
  norm = CONTAMINATION_NORM_VALUES[contaminant],
  unit = CONTAMINANT_UNITS[contaminant],
}) => {
  let normContent: JSX.Element = null;
  if (contaminant && CONTAMINATION_THRESHOLDS[contaminant]) {
    const normContentClassName = `measurement__norm treshold-${getContaminationThresholdIndex(
      contaminant,
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
