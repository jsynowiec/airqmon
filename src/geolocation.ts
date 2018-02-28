import { getCurrentPosition } from 'macos-location';

const MAXIMUM_AGE: number = 5 * 60 * 1000; // 5 minutes in ms

export function getLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    getCurrentPosition(resolve, reject, { maximumAge: MAXIMUM_AGE });
  }).then((position: Position) => {
    /**
     * Sometimes returned position is older, than requested maximumAge so we need to
     * check and retry the request.
     */
    let positionAge = Math.abs(position.timestamp - new Date().getTime());
    if (Math.abs(positionAge) > MAXIMUM_AGE) {
      console.log('Position is too old, retrying request to macos-location.');
      return getLocation();
    }

    return Promise.resolve(position);
  });
}
