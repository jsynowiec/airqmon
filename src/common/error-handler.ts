import * as Rollbar from 'rollbar';

const keys = require('../keys.json');

const version: string = require('../package.json').version;

const errorHandler: Rollbar = new Rollbar({
  accessToken: keys.rollbar,
  version,
  captureUncaught: false,
  captureUnhandledRejections: false,
  payload: {
    code_version: version,
  },
});

process.on('uncaughtException', (error) => {
  errorHandler.error(error);
});

export default errorHandler;
