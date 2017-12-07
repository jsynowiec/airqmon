import * as React from 'react';

const StationInfo = ({ station, onClickHandler }) => {
  return (
    <div className="station-info">
      <a className="link" href="#" onClick={onClickHandler}>
        <span className="icon icon-direction" />&nbsp;
        {`${station.address.locality}, ${station.address.route}`}
      </a>
      <div className="station-info__distance">
        Distance to station {(station.distance / 1000).toFixed(1)} km<br />
      </div>
    </div>
  );
};

export default StationInfo;
