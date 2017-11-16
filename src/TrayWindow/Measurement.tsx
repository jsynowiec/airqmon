import * as React from 'react';

interface IMeasurementProps {
  description: string;
  unit?: string;
  reading: any;
  formatter?: Function;
}

const Measurement = ({ description, unit, reading, formatter }: IMeasurementProps) => {
  // TODO: Look for a better way than dangerouslySetInnerHTML for unit
  return (
    <div className="measurement">
      <div className="reading">
        {reading ? formatter ? formatter(reading) : reading : '-'}
        <span dangerouslySetInnerHTML={{ __html: (reading ? unit ? ` ${unit}` : '' : '') }}/>
      </div>
      <div className="description">{description}</div>
    </div>
  );
};

export default Measurement;
