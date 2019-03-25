import { ipcRenderer, remote } from 'electron';
import * as React from 'react';
import IPC_EVENTS from '../ipc-events';
import { userSettings } from '../user-settings';

interface IFooterProps {
  isAutoRefreshEnabled: boolean;
}

const Footer = ({ isAutoRefreshEnabled }: IFooterProps) => {
  const handlePreferencesClick = () => {
    ipcRenderer.send(IPC_EVENTS.SHOW_PREFERENCES_WINDOW);
  };

  const handleQuitClick = () => {
    ipcRenderer.send(IPC_EVENTS.CLOSE_WINDOW);
  };

  const handleRefreshClick = () => {
    userSettings.set('refreshMeasurements', !isAutoRefreshEnabled);
  };

  return (
    <footer className="toolbar toolbar-footer">
      <div className="toolbar-footer__footer-text">Airqmon v{remote.app.getVersion()}</div>
      <div className="toolbar-actions pull-right">
        <div className="btn-group">
          <button
            className={'btn btn-default' + (isAutoRefreshEnabled ? ' active' : '')}
            onClick={handleRefreshClick}
          >
            <span className="icon icon-arrows-ccw" title="Background fetch" />
          </button>
          <button className="btn btn-default" onClick={handlePreferencesClick}>
            <span className="icon icon-cog" title="Preferences" />
          </button>
          <button className="btn btn-default" onClick={handleQuitClick}>
            <span className="icon icon-cancel" title="Quit" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
