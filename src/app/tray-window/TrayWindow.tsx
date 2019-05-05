import * as React from 'react';

import { ApiError, SensorStation } from 'data/airqmon-api';

import Content from 'app/tray-window/Content';
import ErrorBoundary from 'app/tray-window/ErrorBoundary';
import Footer from 'app/tray-window/Footer';
import ThemedWindow from 'app/ThemedWindow';

interface ITrayWindowProps {
  apiError?: ApiError;
  connectionStatus: boolean;
  distanceToStation?: number;
  geolocationError?: PositionError;
  isAutoRefreshEnabled: boolean;
  loadingMessage?: string;
  sensorStation?: SensorStation;
}

const TrayWindow: React.FunctionComponent<ITrayWindowProps> = (props) => {
  const {
    apiError,
    connectionStatus,
    distanceToStation,
    geolocationError,
    isAutoRefreshEnabled,
    loadingMessage,
    sensorStation,
  } = props;

  return (
    <ThemedWindow name="tray">
      <ErrorBoundary>
        <Content
          apiError={apiError}
          loadingMessage={loadingMessage}
          geolocationError={geolocationError}
          connectionStatus={connectionStatus}
          distanceToStation={distanceToStation}
          sensorStation={sensorStation}
        />
      </ErrorBoundary>
      <Footer isAutoRefreshEnabled={isAutoRefreshEnabled} />
    </ThemedWindow>
  );
};

export default TrayWindow;
