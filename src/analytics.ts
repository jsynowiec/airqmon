import * as ua from 'universal-analytics';
import { isDev } from './helpers';

const keys = require('../keys.json');

const visitor = ua(keys.ganalytics);

if (isDev()) {
  const dummy = () => ({ send: () => {} });

  visitor.event = dummy;
  visitor.screenview = dummy;
}

export default visitor;
