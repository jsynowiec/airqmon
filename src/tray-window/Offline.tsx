import * as React from 'react';

const Offline = () => {
  return (
    <div className="window-content">
      <div className="pane centered-content">
        <div className="summary">
          <strong>There is no Internet connection</strong>
          <br />
          Your computer is offline.
        </div>
      </div>
    </div>
  );
};

export default Offline;
