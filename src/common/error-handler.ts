import * as Rollbar from 'rollbar';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const keys = require('@root/keys.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const version: string = require('@root/package.json').version;

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
