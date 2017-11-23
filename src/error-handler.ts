import * as Rollbar from 'rollbar';

const keys = require('../keys.json');

const errorHandler = new Rollbar({
  accessToken: keys.rollbar,
  version: require('../package.json').version,
  captureUncaught: false,
  captureUnhandledRejections: false,
  payload: {
    code_version: require('../package.json').version,
  },
});

process.on('uncaughtException', (error) => {
  errorHandler.error(error);
});

export default errorHandler;
