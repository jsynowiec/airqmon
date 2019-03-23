import * as React from 'react';

interface ILoaderProps {
  message?: string;
}

const Loader = ({ message }: ILoaderProps = { message: 'Loading data' }) => {
  return (
    <div className="centered-content">
      <div className="loader">
        <div className="loader__summary">{message}&hellip;</div>
        <div className="loader__spinner">
          <div className="loader__spinner__r1" />
          <div className="loader__spinner__r2" />
          <div className="loader__spinner__r3" />
          <div className="loader__spinner__r4" />
          <div className="loader__spinner__r5" />
        </div>
      </div>
    </div>
  );
};

export default Loader;
