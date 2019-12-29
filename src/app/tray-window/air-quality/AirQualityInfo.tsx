import * as React from 'react';

import { getAQIndexMetadataForValue, DEFAULT_AQ_INDEX } from 'common/air-quality';

import AirQualityValueBar from 'app/tray-window/air-quality/AirQualityValueBar';

const AirQualityInfo = ({ airQualityIndex }: { airQualityIndex: number }): JSX.Element => {
  const airQualityMeta = getAQIndexMetadataForValue(DEFAULT_AQ_INDEX, Math.round(airQualityIndex));

  return (
    <div className="air-quality">
      <div className="air-quality__summary">
        <div className="air-quality__label">Common Air Quality Index (CAQI)</div>
        <AirQualityValueBar airQualityIndex={airQualityIndex} />
        <div className="air-quality__label">Advisory</div>
        <div className="air-quality__advisory">{airQualityMeta.advisory}</div>
        <div className="air-quality__description">{airQualityMeta.description}</div>
      </div>
    </div>
  );
};

export default AirQualityInfo;
