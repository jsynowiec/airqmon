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

export const MeasurementReadingUnit = ({ unit }: IMeasurementReadingUnitProps) => {
  const content = {
    [Unit.PM]: <span>μg/m<sup>3</sup></span>,
    [Unit.TEMP_C]: <span><sup>&deg;</sup>C</span>,
    [Unit.PRESSURE_PA]: 'hPA',
    [Unit.PERCENT]: '%',
  }[unit] || null;

  return unit ? <span className="unit"> {content}</span> : null;
};
