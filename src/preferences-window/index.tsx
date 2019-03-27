import * as React from 'react';
import { render } from 'react-dom';

import visitor from '../analytics';
import PreferencesWindow from './PreferencesWindow';

visitor.screenview('Preferences window', 'Airqmon').send();

render(<PreferencesWindow />, document.getElementById('preferences'));
