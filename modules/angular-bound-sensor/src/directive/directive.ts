/**
 * @license AngularBoundSensor v1.0.4
 * (c) 2017 Amin Paks <amin.pakseresht@hotmail.com>
 * License: MIT
 */

import {
  Input,
  Inject,
  Directive,
  ElementRef,
  HostBinding,
  SimpleChanges,

  OnInit,
  OnDestroy,
  OnChanges,
} from '@angular/core';

import {
  BoundSensor,
  BoundSensorOptions,
  BoundSensorDefaultOptions,
} from 'bound-sensor';
import {
  BoundSensorSettings,
} from './types';


@Directive({
  selector: '[boundSensor]',
})
export class BoundSensorDirective implements OnInit, OnDestroy, OnChanges {
  private _element: HTMLElement;
  private _sensor: BoundSensor;
  private _options: BoundSensorSettings;

  @Input() boundSensor: BoundSensorSettings;
  @HostBinding('style.position') _hostPositionStyle: string;

  constructor( @Inject(ElementRef) elementRef: ElementRef) {
    this._hostPositionStyle = '';
    this._element = elementRef.nativeElement;
    this._options = Object.assign({}, BoundSensorDefaultOptions, { attachToParent: false });
  }

  ngOnInit() {
    this.updateHostStyles();
    const host = this._options.attachToParent === true ? this._element.parentElement : this._element;
    this._sensor = new BoundSensor(Object.assign({}, this._options, { modifyStyles: false }));
    this._sensor.attachSensor(host);
  }

  ngOnChanges(changes: SimpleChanges) {
    const options = changes['boundSensor'];
    if (options) {
      const newOptions: BoundSensorSettings = options.currentValue;

      if (options.firstChange === true) {
        if (typeof newOptions.debounceTime === 'number') {
          this._options.debounceTime = newOptions.debounceTime;
        }
        if (typeof newOptions.eventName === 'string') {
          this._options.eventName = newOptions.eventName;
        }
        if (typeof newOptions.modifyStyles === 'boolean') {
          this._options.modifyStyles = newOptions.modifyStyles;
        }
        if (typeof newOptions.attachToParent === 'boolean') {
          this._options.attachToParent = newOptions.attachToParent;
        }
      }
    }
  }

  ngOnDestroy() {
    this._sensor.detachSensor();
    this.removeHostStyles();
  }

  updateHostStyles() {
    if (this._options.modifyStyles === true) {
      if (this._options.attachToParent === false) {
        this._hostPositionStyle = 'relative';
      } else {
        this._element.parentElement.style.position = 'relative';
      }
    }
  }

  removeHostStyles() {
    if (this._options.modifyStyles === true) {
      if (this._options.attachToParent === true) {
        this._element.parentElement.style.position = '';
      }
    }
  }
}
