import * as React from 'react';

export enum Unit {
  PM = 'PM',
  TEMP_C = 'TEMP_C',
  PRESSURE_PA = 'PRESSURE_PA',
  PERCENT = 'PERCENT',
}

export interface IMeasurementReadingUnitProps {
  unit?: Unit;
}

export const MeasurementReadingUnit = ({ unit = null }: IMeasurementReadingUnitProps) => {
  let content = {
    [Unit.PM]: (
      <>
        μg/m<sup>3</sup>
      </>
    ),
    [Unit.TEMP_C]: (
      <>
        <sup>&deg;</sup>C
      </>
    ),
    [Unit.PRESSURE_PA]: 'hPA',
    [Unit.PERCENT]: '%',
  }[unit];

  if (content === undefined) {
    content = null;
  }

  return unit !== null ? <div className="measurement__unit"> {content}</div> : null;
};
