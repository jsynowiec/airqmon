import { existsSync, readFileSync, writeFileSync } from 'fs';
import { remote } from 'electron';

import * as ua from 'universal-analytics';
import uuid from 'uuid';
import { isDev } from './helpers';
import { userSettings } from './user-settings';

const keys = require('../keys.json');

const filename = `${remote.app.getPath('userData')}/.clientid`;

let clientID: string;
if (!existsSync(filename)) {
  clientID = uuid.v4();
  writeFileSync(filename, clientID, { encoding: 'utf-8' });
} else {
  clientID = readFileSync(filename, { encoding: 'utf-8' });
}

const visitor = ua(keys.ganalytics, clientID);

visitor.set('ds', 'app');
visitor.set('an', remote.app.getName());
visitor.set('av', remote.app.getVersion());
const { width: screenWidth, height: screenHeight } = remote.screen.getPrimaryDisplay().bounds;
visitor.set('sr', `${screenWidth}x${screenHeight}`);

if (isDev() || !userSettings.get('telemetry')) {
  // @ts-ignore
  visitor.send = () => {};
}

export default visitor;
