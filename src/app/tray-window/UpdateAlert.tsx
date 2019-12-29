import * as React from 'react';
import { useContext } from 'react';

import { UpdaterContext } from 'app/UpdaterContext';
import { handleExtLinkClick } from 'common/helpers';

const UpdateAlert: React.FunctionComponent = () => {
  const { url } = useContext(UpdaterContext);
  if (!url) return null;

  return (
    <div className="available-update animated slideInUp">
      <a className="link" href="#" onClick={handleExtLinkClick.bind(this, url)}>
        <strong>Heads up!</strong> A new version is available to download.
      </a>
    </div>
  );
};

export default UpdateAlert;
