import { ipcRenderer } from 'electron';
import * as React from 'react';

import { formatDateTo24Time } from '../helpers';
import IPC_EVENTS from '../ipc-events';

interface ITrayFooterProps {
  lastUpdateDate?: Date;
  isAutoRefreshEnabled: Boolean;
  onRefreshClick: () => void;
  onQuitClick: () => void;
}

class TrayFooter extends React.Component<ITrayFooterProps> {
  constructor(props: ITrayFooterProps) {
    super(props);
  }

  handleExtLinkClick(url) {
    ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
  }

  render() {
    const lastUpdate = this.props.lastUpdateDate
      ? `, last update at ${formatDateTo24Time(this.props.lastUpdateDate)}`
      : null;

    return (
      <footer className="toolbar toolbar-footer">
        <div className="footer-text">
          Powered by&nbsp;
          <a
            href="#"
            onClick={this.handleExtLinkClick.bind(this, 'https://developer.airly.eu')}
          >
          Airly
          </a>
          {lastUpdate}
        </div>
        <div className="toolbar-actions pull-right">
          <div className="btn-group">
            <button
              className={'btn btn-default' + (this.props.isAutoRefreshEnabled ? ' active' : '')}
              onClick={this.props.onRefreshClick}
            >
              <span className="icon icon-arrows-ccw" title="Auto refresh" />
            </button>
            <button className="btn btn-default" onClick={this.props.onQuitClick}>
              <span className="icon icon-cancel" title="Quit" />
            </button>
          </div>
        </div>
      </footer>
    );
  }
}

export default TrayFooter;
