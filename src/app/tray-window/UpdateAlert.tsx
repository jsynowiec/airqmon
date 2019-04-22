import * as React from 'react';

interface IUpdateAlertProps {
  onClickHandler: () => void;
}

const UpdateAlert = ({ onClickHandler }: IUpdateAlertProps) => {
  return (
    <div className="available-update">
      <a className="link" href="#" onClick={onClickHandler}>
        <strong>Heads up!</strong> A new version is available for download.
      </a>
    </div>
  );
};

export default UpdateAlert;
