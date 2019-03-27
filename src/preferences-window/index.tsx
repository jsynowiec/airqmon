import * as React from 'react';
import { render } from 'react-dom';

import { getVisitor } from '../analytics';
import PreferencesWindow from './PreferencesWindow';

getVisitor()
  .screenview('Preferences window', 'Airqmon')
  .send();

render(<PreferencesWindow />, document.getElementById('preferences'));
