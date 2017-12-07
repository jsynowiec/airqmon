import * as React from 'react';

import { getCAQIMeta } from '../caqi';

const AirQualityInfo = ({ airQualityIndex }) => {
  const airQualityMeta = getCAQIMeta(airQualityIndex);

  return (
    <div>
      <div className="summary">
        Air quality is&nbsp;
        <strong>{airQualityMeta.labels.airQuality.toLowerCase()}</strong>.
      </div>
      <div className="summary small">{airQualityMeta.description}</div>
    </div>
  );
};

export default AirQualityInfo;
