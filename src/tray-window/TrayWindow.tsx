import * as React from 'react';

import { IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import ErrorBoundary from './ErrorBoundary';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

interface ITrayWindowProps {
  availableAppUpdate?: { version: string; url: string };
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
    <>
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
    </>
  );
};

export default TrayWindow;
