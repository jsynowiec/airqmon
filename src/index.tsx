import * as React from 'react';
import { render } from 'react-dom';

import { App } from './App';

const keys = require('../keys.json');

render(<App airlyToken={keys.airly} />, document.getElementById('app'));
