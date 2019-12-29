import { remote, app as _app } from 'electron';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as ua from 'universal-analytics';
import * as uuid from 'uuid';
import * as isDev from 'electron-is-dev';
import { userSettings } from 'common/user-settings';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const keys = require('@root/keys.json');

let clientID: string = null;
let visitor: ua.Visitor = null;

export function getVisitor(): ua.Visitor {
  if (visitor != null) {
    return visitor;
  }

  const app = _app || remote.app;

  if (clientID == null) {
    const filename = `${app.getPath('userData')}/.clientid`;
    if (!existsSync(filename)) {
      clientID = uuid.v4();
      writeFileSync(filename, clientID, { encoding: 'utf-8' });
    } else {
      clientID = readFileSync(filename, { encoding: 'utf-8' });
    }
  }

  visitor = ua(keys.ganalytics, clientID);

  visitor.set('ds', 'app');
  visitor.set('an', app.getName());
  visitor.set('av', app.getVersion());

  if (isDev || !userSettings.get('telemetry')) {
    visitor.send = (): void => {
      return;
    };
  }

  return visitor;
}
