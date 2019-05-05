import * as React from 'react';
import { useContext } from 'react';

import { ApiError, SensorStation } from 'data/airqmon-api';

import Content from 'app/tray-window/Content';
import ErrorBoundary from 'app/tray-window/ErrorBoundary';
import Footer from 'app/tray-window/Footer';
import { ThemeContext } from 'app/ThemeContext';

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

const TrayWindow: React.FunctionComponent<ITrayWindowProps> = (props) => {
  const theme = useContext(ThemeContext);

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
    <div className={`window tray-window ${theme}-theme`}>
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
    </div>
  );
};

export default TrayWindow;
