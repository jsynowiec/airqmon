import * as React from 'react';

interface IErrorMessageProps {
  header?: string;
  children: JSX.Element;
}

const ErrorMessage = ({ header = null, children }: IErrorMessageProps): JSX.Element => {
  const messageHeader =
    header === null ? null : <div className="error-message__header">{header}</div>;

  return (
    <div className="centered-content">
      <div className="error-message">
        {messageHeader}
        <div className="error-message__notice">{children}</div>
      </div>
    </div>
  );
};

export default ErrorMessage;
