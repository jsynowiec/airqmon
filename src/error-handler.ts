import { app } from 'electron';
import * as Rollbar from 'rollbar';

const keys = require('../keys.json');

const errorHandler = new Rollbar({
  accessToken: keys.rollbar,
  version: app.getVersion(),
  captureUncaught: false,
  captureUnhandledRejections: false,
  payload: {
    code_version: app.getVersion(),
  },
});

process.on('uncaughtException', (error) => {
  errorHandler.error(error);
});

export default errorHandler;
