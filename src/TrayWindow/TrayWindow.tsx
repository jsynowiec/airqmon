import * as React from 'react';

import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';

import Header from './TrayHeader';
import Content from './TrayContent';
import Footer from './TrayFooter';

interface ITrayWindowProps {
  currentMeasurements?: IAirlyCurrentMeasurement;
  nearestStation?: IArilyNearestSensorMeasurement;
  lastUpdateDate?: Date;
  connectionStatus: Boolean;
  isAutoRefreshEnabled: Boolean;
  onQuitClickHandler: () => void;
  onRefreshClickHandler: () => void;
}

const TrayWindow = ({
  currentMeasurements,
  nearestStation,
  lastUpdateDate,
  isAutoRefreshEnabled,
  connectionStatus,
  onQuitClickHandler,
  onRefreshClickHandler,
}: ITrayWindowProps) => {
  return (
    <div className="window">
      <Header />
      <Content
        connectionStatus={connectionStatus}
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
