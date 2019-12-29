export interface ITimer {
  isRunning: boolean;
  clear: () => void;
}

export class Interval {
  private timer: NodeJS.Timer = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(callback: (...args: any[]) => void, ms: number) {
    this.timer = setInterval(callback, ms);
  }

  get isRunning(): boolean {
    return this.timer !== null;
  }

  clear(): void {
    if (this.isRunning) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export class Timeout {
  private active = false;
  private timer: NodeJS.Timer = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(callback: (...args: any[]) => void, ms: number) {
    this.active = true;
    this.timer = setTimeout(() => {
      this.active = false;
      callback();
    }, ms);
  }

  get isRunning(): boolean {
    return this.timer != null && this.active == true;
  }

  clear(): void {
    if (this.isRunning) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
