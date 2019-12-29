import { ipcRenderer } from 'electron';
import * as React from 'react';

import { getVisitor } from 'common/analytics';
import IPC_EVENTS from 'common/ipc-events';
import updateChecker from 'data/update-checker';

interface IUpdaterContextState {
  version: string | null;
  url: string | null;
}

const DEFAULT_STATE: IUpdaterContextState = {
  version: null,
  url: null,
};

export const UpdaterContext = React.createContext<IUpdaterContextState>(DEFAULT_STATE);

class UpdaterStore extends React.Component<{}, IUpdaterContextState> {
  constructor(props) {
    super(props);

    this.state = DEFAULT_STATE;
  }

  componentDidMount(): void {
    updateChecker.on('update-available', (version, url) => {
      this.setState({
        version,
        url,
      });

      this.notify();
    });
  }

  private notify(): void {
    const { version, url } = this.state;

    new Notification('Update available', {
      body: `Version ${version} is available to download.`,
    }).addEventListener('click', () => {
      getVisitor()
        .event('App updates', 'Clicked on notification body.')
        .send();

      ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
    });
  }

  render(): JSX.Element {
    return (
      <UpdaterContext.Provider
        value={{
          version: this.state.version,
          url: this.state.url,
        }}
      >
        {this.props.children}
      </UpdaterContext.Provider>
    );
  }
}

export default UpdaterStore;
