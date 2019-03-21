export function getLocation(): Promise<Position> {
  return new Promise<Position>((resolve, reject) => {
    return navigator.geolocation.getCurrentPosition(resolve, reject);
  }).then((position) => {
    return Promise.resolve<Position>(position);
  });
}
