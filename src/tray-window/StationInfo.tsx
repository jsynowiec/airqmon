import { ipcRenderer } from 'electron';

import * as React from 'react';
import { SensorStation } from '../airqmon-api';

import IPC_EVENTS from '../ipc-events';

const StationInfo = ({ station, distance }: { station: SensorStation; distance: number }) => {
  function handleExtLinkClick(url: string, event: MouseEvent) {
    event.preventDefault();
    ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
  }

  const providerLink = station.provider.url ? (
    <a className="link" href="#" onClick={handleExtLinkClick.bind(this, station.provider.url)}>
      {station.provider.name}
    </a>
  ) : (
    station.provider.name
  );

  const stationDetails = station.provider.stationDetails ? (
    <a
      className="link"
      href="#"
      onClick={handleExtLinkClick.bind(this, station.provider.stationDetails)}
    >
      <span className="icon icon-direction" />
      &nbsp;
      {station.displayAddress}
    </a>
  ) : (
    <>
      <span className="icon icon-direction" />
      &nbsp;
      {station.displayAddress}
    </>
  );

  return (
    <div className="station-info">
      Data provided by&nbsp;{providerLink}, distance to station {distance.toFixed(2)} km
      <div className="station-info__display-address">{stationDetails}</div>
    </div>
  );
};

export default StationInfo;
