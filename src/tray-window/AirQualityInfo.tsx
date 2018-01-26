import * as React from 'react';

import { formatters, Measurement } from './measurement/Measurement';
import { getCAQIMeta } from '../caqi';

const AirQualityInfo = ({ airQualityIndex }) => {
  const airQualityMeta = getCAQIMeta(Math.round(airQualityIndex));

  return (
    <div className="air-quality">
      <div className="air-quality__summary">
        <div className="air-quality__label">
          Air quality is&nbsp;
          <strong className={`quality-${airQualityMeta.index}`}>
            {airQualityMeta.labels.airQuality.toLowerCase()}
          </strong>.
        </div>
        <div className="air-quality__description">{airQualityMeta.description}</div>
      </div>
      <div className="air-quality__caqi">
        <Measurement
          description="CAQI"
          reading={airQualityIndex}
          formatter={formatters.significant}
        />
      </div>
    </div>
  );
};

export default AirQualityInfo;
