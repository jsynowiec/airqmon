import { ipcRenderer } from 'electron';
import * as React from 'react';
import { useContext, MouseEvent } from 'react';

import { UpdaterContext } from 'app/UpdaterContext';
import IPC_EVENTS from 'common/ipc-events';

function handleExtLinkClick(url: string, event: MouseEvent) {
  event.preventDefault();
  ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
}

const UpdateAlert: React.FunctionComponent = () => {
  const { url } = useContext(UpdaterContext);
  const onClickHandler = (event: MouseEvent) => handleExtLinkClick(url, event);

  if (!url) return null;

  return (
    <div className="available-update animated slideInUp">
      <a className="link" href="#" onClick={onClickHandler}>
        <strong>Heads up!</strong> A new version is available to download.
      </a>
    </div>
  );
};

export default UpdateAlert;
