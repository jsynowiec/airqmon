import { getCurrentPosition } from 'macos-location';

import getLogger from './logger';

const logger = getLogger('geolocation');

export function getLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    getCurrentPosition((position) => {
      logger.info("Received user's location: %o", position);
      logger.debug(
        'Position is %f seconds old',
        (new Date().getTime() - position.timestamp) / 1000,
      );

      resolve(position);
    }, reject);
  });
}
