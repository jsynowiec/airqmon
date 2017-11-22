import * as React from 'react';

import errorHandler from './error-handler';

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
    errorHandler.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="window-content">
          <div className="pane">
            <div className="summary error-message">
              <strong><span className="icon icon-alert" /> Uh oh...</strong><br/>
              Looks like something went wrong. Please try restarting the app.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
