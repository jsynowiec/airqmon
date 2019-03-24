import * as ua from 'universal-analytics';
import { isDev } from './helpers';
import { userSettings } from './user-settings';

const keys = require('../keys.json');

const visitor = ua(keys.ganalytics);

if (isDev() || !userSettings.get('telemetry')) {
  const dummy = () => ({ send: () => {} });

  visitor.event = dummy;
  visitor.screenview = dummy;
}

export default visitor;
