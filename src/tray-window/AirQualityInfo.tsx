import * as React from 'react';

import { getCAQIMeta } from '../caqi';

const AirQualityInfo = ({ airQualityIndex }) => {
  const airQualityMeta = getCAQIMeta(airQualityIndex);

  return (
    <>
      <div className="air-quality__summary">
        Air quality is&nbsp;
        <strong>{airQualityMeta.labels.airQuality.toLowerCase()}</strong>.
      </div>
      <div className="air-quality__description">{airQualityMeta.description}</div>
    </>
  );
};

export default AirQualityInfo;
