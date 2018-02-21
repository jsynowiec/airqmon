import { ipcRenderer } from 'electron';
import * as React from 'react';

import { formatDateTo24Time } from '../helpers';
import IPC_EVENTS from '../ipc-events';

interface IFooterProps {
  lastUpdateDate?: Date;
  isAutoRefreshEnabled: boolean;
  onRefreshClick: () => void;
  onPreferencesClickHandler: () => void;
  onQuitClick: () => void;
}

const Footer = ({
  lastUpdateDate,
  isAutoRefreshEnabled,
  onRefreshClick,
  onPreferencesClickHandler,
  onQuitClick,
}: IFooterProps) => {
  function handleExtLinkClick(url: string, event: MouseEvent) {
    event.preventDefault();
    ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
  }

  const lastUpdate: string = lastUpdateDate
    ? `, last update at ${formatDateTo24Time(lastUpdateDate)}`
    : null;

  return (
    <footer className="toolbar toolbar-footer">
      <div className="toolbar-footer__footer-text">
        Powered by&nbsp;
        <a
          className="link"
          href="#"
          onClick={handleExtLinkClick.bind(this, 'https://developer.airly.eu')}
        >
          Airly
        </a>
        {lastUpdate}
      </div>
      <div className="toolbar-actions pull-right">
        <div className="btn-group">
          <button
            className={'btn btn-default' + (isAutoRefreshEnabled ? ' active' : '')}
            onClick={onRefreshClick}
          >
            <span className="icon icon-arrows-ccw" title="Background fetch" />
          </button>
          <button className="btn btn-default">
            <span
              className="icon icon-cog"
              title="Preferences"
              onClick={onPreferencesClickHandler}
            />
          </button>
          <button className="btn btn-default" onClick={onQuitClick}>
            <span className="icon icon-cancel" title="Quit" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
