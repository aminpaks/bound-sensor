/**
 * @license Utils
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */
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

/**
 * Simple implementation of isNil
 * @param value A value to check nullify
 */
export function isNil(value: any): boolean {
  return value == null;
}

/**
 * Checks if the value is a function
 * @param value A value to check if it is function
 */
export function isFunction(value: any): boolean {
  return (typeof value === 'function');
}
