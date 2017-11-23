import * as React from 'react';

import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import ErrorBoundary from '../ErrorBoundary';
import Content from './TrayContent';
import Footer from './TrayFooter';
import Header from './TrayHeader';

interface ITrayWindowProps {
  availableAppUpdate?: { version: string, url: string };
  connectionStatus: Boolean;
  currentMeasurements?: IAirlyCurrentMeasurement;
  isAutoRefreshEnabled: Boolean;
  lastUpdateDate?: Date;
  nearestStation?: IArilyNearestSensorMeasurement;
  onQuitClickHandler: () => void;
  onRefreshClickHandler: () => void;
}

const TrayWindow = ({
  availableAppUpdate,
  connectionStatus,
  currentMeasurements,
  isAutoRefreshEnabled,
  lastUpdateDate,
  nearestStation,
  onQuitClickHandler,
  onRefreshClickHandler,
}: ITrayWindowProps) => {
  return (
    <div className="window">
      <Header />
      <ErrorBoundary>
        <Content
          availableAppUpdate={availableAppUpdate}
          connectionStatus={connectionStatus}
          currentMeasurements={currentMeasurements}
          nearestStation={nearestStation}
        />
      </ErrorBoundary>
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
