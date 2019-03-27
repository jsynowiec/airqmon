import * as React from 'react';
import { render } from 'react-dom';

import visitor from './analytics';
import { App } from './app';

visitor.screenview('Tray window', 'Airqmon').send();

render(<App />, document.getElementById('app'));
