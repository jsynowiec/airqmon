import * as React from 'react';
import { render } from 'react-dom';

import { App } from './app';

const keys = require('../keys.json');

render(<App airlyToken={keys.airly} />, document.getElementById('app'));
