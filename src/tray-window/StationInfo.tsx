import * as React from 'react';

const StationInfo = ({ station, onClickHandler }) => {
  return (
    <div className="summary small">
      Distance to station {(station.distance / 1000).toFixed(2)} km<br/>
      <a
        className="link"
        href="#"
        onClick={onClickHandler}
      >
      {`${station.address.locality}, ${station.address.route}`}
      </a>
    </div>
  );
};

export default StationInfo;
