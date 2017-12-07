import * as React from 'react';

const Offline = () => {
  return (
    <div className="centered-content">
      <div className="offline-info">
        <div className="offline-info__header">There is no Internet connection</div>
        <div className="offline-info__notice">Your computer is offline.</div>
      </div>
    </div>
  );
};

export default Offline;
