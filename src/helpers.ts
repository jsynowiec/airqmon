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
