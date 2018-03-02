import { getCurrentPosition } from 'macos-location';

export function getLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    getCurrentPosition(resolve, reject);
  });
}
