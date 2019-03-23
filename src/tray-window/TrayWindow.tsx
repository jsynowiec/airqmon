import * as React from 'react';

import ErrorBoundary from './ErrorBoundary';
import Content from './Content';
import Footer from './Footer';
import Header from './Header';
import { SensorStation, ApiError } from '../airqmon-api';

interface ITrayWindowProps {
  apiError?: ApiError;
  geolocationError?: PositionError;
  availableAppUpdate?: { version: string; url: string };
  connectionStatus: boolean;
  isAutoRefreshEnabled: boolean;
  distanceToStation?: number;
  sensorStation?: SensorStation;
  onQuitClickHandler: () => void;
  onRefreshClickHandler: () => void;
  onPreferencesClickHandler: () => void;
}

const TrayWindow = ({
  availableAppUpdate,
  connectionStatus,
  apiError,
  geolocationError,
  isAutoRefreshEnabled,
  distanceToStation,
  sensorStation,
  onQuitClickHandler,
  onRefreshClickHandler,
  onPreferencesClickHandler,
}: ITrayWindowProps) => {
  return (
    <>
      <Header />
      <ErrorBoundary>
        <Content
          apiError={apiError}
          geolocationError={geolocationError}
          availableAppUpdate={availableAppUpdate}
          connectionStatus={connectionStatus}
          distanceToStation={distanceToStation}
          sensorStation={sensorStation}
        />
      </ErrorBoundary>
      <Footer
        isAutoRefreshEnabled={isAutoRefreshEnabled}
        onQuitClick={onQuitClickHandler}
        onRefreshClick={onRefreshClickHandler}
        onPreferencesClickHandler={onPreferencesClickHandler}
      />
    </>
  );
};

export default TrayWindow;
