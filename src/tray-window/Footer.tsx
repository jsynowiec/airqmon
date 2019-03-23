import { remote } from 'electron';
import * as React from 'react';

interface IFooterProps {
  isAutoRefreshEnabled: boolean;
  onRefreshClick: () => void;
  onPreferencesClickHandler: () => void;
  onQuitClick: () => void;
}

const Footer = ({
  isAutoRefreshEnabled,
  onRefreshClick,
  onPreferencesClickHandler,
  onQuitClick,
}: IFooterProps) => {
  return (
    <footer className="toolbar toolbar-footer">
      <div className="toolbar-footer__footer-text">v{remote.app.getVersion()}</div>
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
