import * as React from 'react';
import { ApiError, SensorStation } from '../airqmon-api';
import Content from './Content';
import ErrorBoundary from './ErrorBoundary';
import Footer from './Footer';
import Header from './Header';

interface ITrayWindowProps {
  apiError?: ApiError;
  availableAppUpdate?: { version: string; url: string };
  connectionStatus: boolean;
  distanceToStation?: number;
  geolocationError?: PositionError;
  isAutoRefreshEnabled: boolean;
  loadingMessage?: string;
  sensorStation?: SensorStation;
}

const TrayWindow = (props: ITrayWindowProps) => {
  const {
    apiError,
    availableAppUpdate,
    connectionStatus,
    distanceToStation,
    geolocationError,
    isAutoRefreshEnabled,
    loadingMessage,
    sensorStation,
  } = props;

  return (
    <>
      <Header />
      <ErrorBoundary>
        <Content
          apiError={apiError}
          loadingMessage={loadingMessage}
          geolocationError={geolocationError}
          availableAppUpdate={availableAppUpdate}
          connectionStatus={connectionStatus}
          distanceToStation={distanceToStation}
          sensorStation={sensorStation}
        />
      </ErrorBoundary>
      <Footer isAutoRefreshEnabled={isAutoRefreshEnabled} />
    </>
  );
};

export default TrayWindow;
