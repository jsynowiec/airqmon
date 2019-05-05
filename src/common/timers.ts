export interface ITimer {
  isRunning: boolean;
  clear: () => void;
}

export class Interval {
  private timer: NodeJS.Timer = null;

  constructor(callback: (...args: any[]) => void, ms: number) {
    this.timer = setInterval(callback, ms);
  }

  get isRunning() {
    return this.timer !== null;
  }

  clear() {
    if (this.isRunning) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export class Timeout {
  private active: boolean = false;
  private timer: NodeJS.Timer = null;

  constructor(callback: (...args: any[]) => void, ms: number) {
    this.active = true;
    this.timer = setTimeout(() => {
      this.active = false;
      callback();
    }, ms);
  }

  get isRunning() {
    return this.timer != null && this.active == true;
  }

  clear() {
    if (this.isRunning) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
