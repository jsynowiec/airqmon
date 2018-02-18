import * as React from 'react';
import { render } from 'react-dom';

import viewer from '../analytics';
import PreferencesWindow from './PreferencesWindow';

viewer.screenview('Preferences window', 'Airqmon').send();

render(<PreferencesWindow />, document.getElementById('preferences'));
