import * as React from 'react';
import { render } from 'react-dom';

import viewer from './analytics';
import { App } from './app';

const keys = require('../keys.json');

viewer.screenview('Tray window', 'Airqmon').send();

render(<App airlyToken={keys.airly} />, document.getElementById('app'));
