import { getCurrentPosition } from 'macos-location';

const MAXIMUM_AGE: number = 5 * 60 * 1000; // 5 minutes in ms

export function getLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    getCurrentPosition(resolve, reject, { maximumAge: MAXIMUM_AGE });
  });
}
