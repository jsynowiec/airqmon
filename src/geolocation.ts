import { getCurrentPosition } from 'macos-location';

import getLogger from './logger';
import { userSettings } from './user-settings';

const logger = getLogger('geolocation');

export function getLocation(): Promise<Position> {
  return new Promise<Position>((resolve, reject) => {
    if (userSettings.get('useCoreLocation')) {
      return getCurrentPosition(resolve, reject);
    }

    return navigator.geolocation.getCurrentPosition(resolve, reject);
  }).then((position) => {
    if (userSettings.get('useCoreLocation')) {
      logger.debug('Using macOS CoreLocation services.');
      logger.info("Received user's location: %j", position);
      logger.debug(
        'Position is %f seconds old',
        (new Date().getTime() - position.timestamp) / 1000,
      );
    }

    return Promise.resolve<Position>(position);
  });
}
