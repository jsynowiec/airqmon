import './TrayWindow.less';

import * as React from 'react';

import {ApiError, Measurements, SensorStation} from 'data/airqmon-api';

import Content from 'app/tray-window/Content';
import ErrorBoundary from 'app/tray-window/ErrorBoundary';
import Footer from 'app/tray-window/Footer';
import ThemedWindow from 'app/ThemedWindow';

interface ITrayWindowProps {
  apiError?: ApiError;
  connectionStatus: boolean;
  isAutoRefreshEnabled: boolean;
  loadingMessage?: string;
  sensorStation?: SensorStation;
  measurements: Measurements;
}

const TrayWindow: React.FunctionComponent<ITrayWindowProps> = (props) => {
  const {
    apiError,
    connectionStatus,
    isAutoRefreshEnabled,
    loadingMessage,
    sensorStation,
    measurements
  } = props;

  return (
    <ThemedWindow name="tray">
      <ErrorBoundary>
        <Content
          apiError={apiError}
          loadingMessage={loadingMessage}
          connectionStatus={connectionStatus}
          sensorStation={sensorStation}
          measurements={measurements}
        />
      </ErrorBoundary>
      <Footer isAutoRefreshEnabled={isAutoRefreshEnabled} />
    </ThemedWindow>
  );
};

export default TrayWindow;
