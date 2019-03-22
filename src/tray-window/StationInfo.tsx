import * as React from 'react';
import { SensorStation } from '../airqmon-api';

const StationInfo = ({
  station,
  distance,
  onClickHandler,
}: {
  station: SensorStation;
  distance: number;
  onClickHandler: () => void;
}) => {
  return (
    <div className="station-info">
      <a className="link" href="#" onClick={onClickHandler}>
        <span className="icon icon-direction" />
        &nbsp;
        {`${station.displayAddress}`}
      </a>
      <div className="station-info__distance">
        Distance to station {distance.toFixed(2)} km
        <br />
      </div>
    </div>
  );
};

export default StationInfo;
