import 'module-alias/register';

import * as React from 'react';
import { render } from 'react-dom';

import PreferencesWindow from 'app/preferences-window/PreferencesWindow';
import { getVisitor } from 'common/analytics';

getVisitor()
  .screenview('Preferences window', 'Airqmon')
  .send();

render(<PreferencesWindow />, document.getElementById('preferences'));
