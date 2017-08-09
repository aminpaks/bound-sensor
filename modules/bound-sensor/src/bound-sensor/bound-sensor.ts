/**
 * @license BoundSensor v1.0.4
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */

 import {
  debounce,
  defaults,
  isFunction,
  isNil,
} from './utils';

import { BoundSensorDefaultOptions } from './constants';
import { BoundSensorEventDetail, BoundSensorOptions } from './types';

export class BoundSensor {
  private host: HTMLElement;
  private frame: HTMLIFrameElement;
  private options: BoundSensorOptions;
  private debouncedEventHandler: EventListener;

  constructor(options: BoundSensorOptions) {
    this.options = defaults(options, BoundSensorDefaultOptions);
  }

  attachSensor(element: HTMLElement): void {
    if (element instanceof HTMLElement) {
      this.host = element;

      if (this.options.modifyStyles === true) {
        this.prepareElementStyles();
      }
      if (this.addFrameElement() === true) {
        this.host.appendChild(this.frame);

        const self = this;
        this.debouncedEventHandler = debounce(self.callResizeEvent.bind(self), this.options.debounceTime);
        this.frame.contentWindow.addEventListener('resize', this.debouncedEventHandler);

        // First event should be dispatched on initialization
        this.callResizeEvent();
      }

    }
  }

  prepareElementStyles(): void {
    this.host.style.position = 'relative';
    this.host.style.display = 'block';
  }

  cleanElementStyles(): void {
    this.host.style.position = '';
    this.host.style.display = '';
  }

  addFrameElement(): boolean {
    if (!(this.frame instanceof HTMLIFrameElement)) {
      this.frame = window.document.createElement('iframe');
    }

    const frameStyle = this.frame.style;

    frameStyle.width = '100%';
    frameStyle.height = '100%';
    frameStyle.top = '0';
    frameStyle.left = '0';
    frameStyle.border = 'none';
    frameStyle.zIndex = '-1';
    frameStyle.position = 'absolute';
    frameStyle.visibility = 'hidden';

    return this.frame instanceof HTMLIFrameElement;
  }

  callResizeEvent(): void {
    const event = new CustomEvent(this.options.eventName, {
      detail: <BoundSensorEventDetail>{
        host: this.host,
        width: this.frame.clientWidth,
        height: this.frame.clientHeight,
      },
      bubbles: true,
      cancelable: true,
    });

    this.host.dispatchEvent(event);
  }

  detachSensor(): boolean {
    if (this.frame instanceof HTMLIFrameElement) {
      if (this.options.modifyStyles === true) {
        this.cleanElementStyles();
      }
      if (!isNil(this.frame.contentWindow)) {
        const proto = Object.getPrototypeOf(this.frame.contentWindow);

        if (isFunction(proto.removeEventListener)) {
          this.frame.contentWindow.removeEventListener('resize', this.debouncedEventHandler);
        }
      }

      if (this.host instanceof HTMLElement) {
        this.host.removeChild(this.frame);
      }
      return true;
    }
    return false;
  }
}
