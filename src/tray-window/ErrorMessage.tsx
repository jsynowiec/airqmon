import * as React from 'react';

interface IErrorMessageProps {
  header?: string;
  message: string;
}

const ErrorMessage = ({ header, message }: IErrorMessageProps) => {
  return (
    <div className="centered-content">
      <div className="error-message">
        <div className="error-message__header">{header}</div>
        <div className="error-message__notice">{message}</div>
      </div>
    </div>
  );
};

export default ErrorMessage;
