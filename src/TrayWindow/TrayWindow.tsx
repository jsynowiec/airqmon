import * as React from 'react';

import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';

import Header from './Header';
import Content from './Content';
import Footer from './Footer';

interface ITrayWindowProps {
  currentMeasurements?: IAirlyCurrentMeasurement;
  nearestStation?: IArilyNearestSensorMeasurement;
  lastUpdateDate?: Date;
  isAutoRefreshEnabled: Boolean;
  onQuitClickHandler: () => void;
  onRefreshClickHandler: () => void;
}

const TrayWindow = ({
  currentMeasurements,
  nearestStation,
  lastUpdateDate,
  isAutoRefreshEnabled,
  onQuitClickHandler,
  onRefreshClickHandler,
}: ITrayWindowProps) => {
  return (
    <div className="window">
      <Header />
      <Content
        currentMeasurements={currentMeasurements}
        nearestStation={nearestStation}
      />
      <Footer
        lastUpdateDate={lastUpdateDate}
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        onQuitClick={onQuitClickHandler}
        onRefreshClick={onRefreshClickHandler}
      />
    </div>
  );
};

export default TrayWindow;
