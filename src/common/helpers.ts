import { ipcRenderer } from 'electron';
import IPC_EVENTS from './ipc-events';

export function withLeadingZero(val: number): string {
  return `${val >= 0 && val < 10 ? '0' : ''}${val}`; // don't care about negative values
}

export function formatDateTo24Time(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${withLeadingZero(hours)}:${withLeadingZero(minutes)}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function catcher<T = any, E = Error>(
  promise: Promise<T>,
): Promise<[T | undefined, E | null]> {
  return promise
    .then<[T, null]>((data: T) => [data, null])
    .catch<[undefined, E]>((err: E) => {
      return [undefined, err];
    });
}

export function handleExtLinkClick(url: string, event: MouseEvent): void {
  event.preventDefault();
  ipcRenderer.send(IPC_EVENTS.OPEN_BROWSER_FOR_URL, url);
}
