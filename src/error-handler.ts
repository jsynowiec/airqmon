import * as Rollbar from 'rollbar';

import { isDev } from './helpers';

const keys = require('../keys.json');

const errorHandler = new Rollbar({
  accessToken: keys.rollbar,
  version: require('../package.json').version,
  captureUncaught: false,
  captureUnhandledRejections: false,
  payload: {
    code_version: require('../package.json').version,
    environment: isDev() ? 'development' : 'production',
  },
});

process.on('uncaughtException', (error) => {
  errorHandler.error(error);
});

export default errorHandler;
