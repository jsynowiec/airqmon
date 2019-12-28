import './PreferencesWindow.less';

import * as React from 'react';
import { render } from 'react-dom';

import PreferencesWindow from 'app/preferences-window/PreferencesWindow';
import { getVisitor } from 'common/analytics';
import ThemeStore from 'app/ThemeContext';

getVisitor()
  .screenview('Preferences window', 'Airqmon')
  .send();

render(
  <ThemeStore>
    <PreferencesWindow />
  </ThemeStore>,
  document.body.appendChild(document.createElement('div')),
);
