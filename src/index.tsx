import * as React from 'react';
import { render } from 'react-dom';

import { getVisitor } from 'common/analytics';
import { App } from './app';

getVisitor()
  .screenview('Tray window', 'Airqmon')
  .send();

render(<App />, document.getElementById('app'));
