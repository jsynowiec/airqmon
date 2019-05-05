export function withLeadingZero(val: number): string {
  return `${val >= 0 && val < 10 ? '0' : ''}${val}`; // don't care about negative values
}

export function formatDateTo24Time(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${withLeadingZero(hours)}:${withLeadingZero(minutes)}`;
}

export function isEmptyObject(obj: Object): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function catcher<T = any, E = Error>(
  promise: Promise<T>,
): Promise<[T | undefined, E | null]> {
  return promise
    .then<[T, null]>((data: T) => [data, null])
    .catch<[undefined, E]>((err: E) => {
      return [undefined, err];
    });
}
