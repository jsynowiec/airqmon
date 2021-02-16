import './PreferencesWindow.less';

import * as React from 'react';
import { render } from 'react-dom';

import PreferencesWindow from 'app/preferences-window/PreferencesWindow';
import ThemeStore from 'app/ThemeContext';

render(
  <ThemeStore>
    <PreferencesWindow />
  </ThemeStore>,
  document.body.appendChild(document.createElement('div')),
);
