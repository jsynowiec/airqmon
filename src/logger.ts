import { createLogger, format, transports } from 'winston';
const { combine, timestamp, label, printf } = format;

import { remote } from 'electron';
import { isDev } from './helpers';

const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level} - ${message}`;
});

const logger = createLogger({
  level: isDev() ? 'debug' : 'warn',
  format: combine(
    label({ label: 'main' }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
  transports: [
    new transports.File({
      filename: `${remote.app.getPath(
        'userData',
      )}/${remote.app.getName()}-${remote.app.getVersion()}.log`,
    }),
  ],
});

if (isDev()) {
  logger.add(new transports.Console());
}

export default function getLogger(label?: string) {
  if (!label) {
    return logger;
  }

  return logger.child({
    label,
  });
}
