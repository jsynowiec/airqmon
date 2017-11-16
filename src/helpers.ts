export function isDev() {
  if ('ELECTRON_IS_DEV' in process.env) {
    return parseInt(process.env.ELECTRON_IS_DEV, 10) === 1;
  }

  return process.defaultApp || /node_modules[\\/]electron[\\/]/.test(process.execPath);
}

export function withLeadingZero(val: number):string {
  return `${val < 10 ? '0' : ''}${val}`;
}

export function formatDateTo24Time(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${withLeadingZero(hours)}:${withLeadingZero(minutes)}`;
}

export function getLocation(): Promise<Position> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}
