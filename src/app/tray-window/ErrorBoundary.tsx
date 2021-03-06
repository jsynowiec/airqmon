import * as React from 'react';
import * as isDev from 'electron-is-dev';

interface IErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Record<string, unknown>, IErrorBoundaryState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = { hasError: false };
  }

  componentDidCatch(error: Error): void {
    this.setState({ hasError: true });
    if (isDev) {
      console.error(error);
    }
  }

  render(): JSX.Element {
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
