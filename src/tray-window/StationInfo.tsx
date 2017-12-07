import * as React from 'react';

const StationInfo = ({ station, onClickHandler }) => {
  return (
    <div className="summary small">
      <a className="link" href="#" onClick={onClickHandler}>
        <span className="icon icon-direction" />&nbsp;
        {`${station.address.locality}, ${station.address.route}`}
      </a>
      <p>
        Distance to station {(station.distance / 1000).toFixed(1)} km<br />
      </p>
    </div>
  );
};

export default StationInfo;
