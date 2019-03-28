import * as React from 'react';

import * as isDev from 'electron-is-dev';
import errorHandler from '../error-handler';

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{}, IErrorBoundaryState> {
  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    this.setState({ hasError: true });
    if (!isDev) {
      errorHandler.error(error);
    } else {
      console.error(error);
    }
  }

  render() {
    let content = this.props.children;

    if (this.state.hasError) {
      content = (
        <div className="centered-content">
          <div className="error-message">
            <div className="error-message__header">
              <span className="icon icon-alert" /> Uh oh...
            </div>
            <div className="error-message_description">
              Looks like something went wrong. Please try restarting the app.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="window-content">
        <div className="pane">{content}</div>
      </div>
    );
  }
}

export default ErrorBoundary;
