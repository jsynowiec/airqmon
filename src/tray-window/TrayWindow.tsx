import * as React from 'react';

import { AirlyAPIStatus, IAirlyCurrentMeasurement, IArilyNearestSensorMeasurement } from '../airly';
import ErrorBoundary from './ErrorBoundary';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';

interface ITrayWindowProps {
  airlyApiStatus?: AirlyAPIStatus;
  availableAppUpdate?: { version: string; url: string };
  connectionStatus: boolean;
  currentMeasurements?: IAirlyCurrentMeasurement;
  isAutoRefreshEnabled: boolean;
  lastUpdateDate?: Date;
  nearestStation?: IArilyNearestSensorMeasurement;
  onQuitClickHandler: () => void;
  onRefreshClickHandler: () => void;
  onPreferencesClickHandler: () => void;
}

const TrayWindow = ({
  availableAppUpdate,
  connectionStatus,
  currentMeasurements,
  airlyApiStatus,
  isAutoRefreshEnabled,
  lastUpdateDate,
  nearestStation,
  onQuitClickHandler,
  onRefreshClickHandler,
  onPreferencesClickHandler,
}: ITrayWindowProps) => {
  return (
    <>
      <Header />
      <ErrorBoundary>
        <Content
          airlyApiStatus={airlyApiStatus}
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
        onPreferencesClickHandler={onPreferencesClickHandler}
      />
    </>
  );
};

export default TrayWindow;
