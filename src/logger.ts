import bunyan = require('bunyan');
import { remote } from 'electron';

import { isDev } from './helpers';

function ConsoleStream() {}
ConsoleStream.prototype.write = function(rec) {
  rec = JSON.parse(rec);

  console.log(
    '[%s] %s %s (%s): %s',
    rec.time,
    bunyan.nameFromLevel[rec.level].toUpperCase(),
    rec.name,
    rec.component || 'main',
    rec.msg,
  );
};

let streams: bunyan.Stream[] = [
  {
    path: `${remote.app.getPath(
      'userData',
    )}/${remote.app.getName()}-${remote.app.getVersion()}.log`,
    level: 'debug',
  },
];

if (isDev()) {
  streams = [
    ...streams,
    {
      stream: new ConsoleStream(),
      level: 'debug',
    },
  ];
}

const logger = bunyan.createLogger({
  name: remote.app.getName(),
  level: isDev() ? 'debug' : 'warn',
  streams,
});

export default function getLogger(component: string) {
  return logger.child({
    component,
  });
}
