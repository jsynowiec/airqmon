import * as React from 'react';

const Loader = () => {
  return (
    <div className="window-content">
      <div className="pane centered-content">
        <div>
          <div className="summary">Fetching data&hellip;</div>
          <div className="spinner">
            <div className="rect1" />
            <div className="rect2" />
            <div className="rect3" />
            <div className="rect4" />
            <div className="rect5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
