/**
 * Simple implementation of defaults
 * @param {Object} dest The result object
 * @param {Object} origin The origin object to clone from
 */
export function defaults<T = any>(dest: any, origin: T): T {
  const result: { [key: string]: any } = {};

  Object.keys(origin).forEach((key) => {
    if (dest[key] !== undefined) {
      result[key] = dest[key];
    } else {
      result[key] = (<any>origin)[key];
    }
  });

  return <T>result;
}

export interface DebounceCallback {
  (...args: any[]): any;
}

/**
 * Simple implementation of debounce callback
 * @param func A function to be called once timeout is passed
 * @param timeout A number in miliseconds to pass then call callback
 */
export function debounce<T extends DebounceCallback>(func: T, timeout: number): T {
  return Debounce.from(func, timeout);
}

class Debounce<T extends DebounceCallback> {
  private timeoutId: number | null = null;
  private timeout: number;
  private target: T;

  constructor(func: T, timeout: number) {
    this.target = func;
    this.timeout = timeout;
  }

  static from<T extends DebounceCallback>(func: T, timeout: number): T {
    return new Debounce(func, timeout).getDebounce();
  }

  getDebounce(): T {
    const result = (...args: any[]) => {
      if (this.timeoutId !== null) {
        window.clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      window.setTimeout(() => {
        this.target.call(null, ...args);
      }, this.timeout);
    };

    return <T>result;
  }
}
