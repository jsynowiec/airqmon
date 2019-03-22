import * as React from 'react';
import { render } from 'react-dom';

import viewer from './analytics';
import { App } from './app';

viewer.screenview('Tray window', 'Airqmon').send();

render(<App />, document.getElementById('app'));
