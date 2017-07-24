import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnInit,
} from '@angular/core';

import { SafeHtml } from '@angular/platform-browser';
import { escapeHtml } from '../utils/esacpe';
import { NotificationElement } from './types';

import { BoundSensorEventDetail } from 'angular-bound-sensor';

@Component({
  selector: 'simple-component',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class SimpleComponent implements OnInit, AfterViewInit {

  private notifications: NotificationElement[];
  private myBoundSize: string;
  private myChildBoundSize: string;
  private myElement: HTMLElement;
  private myChildElement: HTMLElement;
  private content: string = '';
  private dynamicContentEnable: boolean = true;
  private safeValues: { [key: string]: SafeHtml } = {};
  @HostBinding('class.flexbox') flexbox: boolean = false;

  constructor (elementRef: ElementRef) {
    this.myBoundSize = 'width: unknown, height: unknown';
    this.myChildBoundSize = 'width: unknown, height: unknown';
    this.myElement = elementRef.nativeElement;
    this.notifications = [];
  }

  ngOnInit() {
    this.safeValues.compSample = escapeHtml('<simple-component boundSensor ></simple-component>')
      .replace('boundSensor', '<b style="color: blue">boundSensor</b>');
    this.safeValues.settingSample = escapeHtml('<simple-component boundSensor="{SETTINGS}"></simple-component>')
      .replace('{SETTINGS}', `<b>{
        debounceTime: 200,
        eventName: 'resize'
      }</b>`.replace(/[\n\s]/g, ''));
  }

  ngAfterViewInit() {
    this.myChildElement = <HTMLElement>this.myElement.querySelector('simple-child-component');
  }

  toggleFlexbox() {
    this.flexbox = !this.flexbox;
  }

  updateContent() {
    const count = Math.floor(Math.random() * 200) + 100;
    this.content = Array(count).fill('<span>Sample Text</span>').join(' ');
  }

  dynamicContent() {
    this.dynamicContentEnable = false;
    this.updateContent();
    window.setInterval(this.updateContent.bind(this), 1000);
  }

  addNotification(hostName: string, size: string) {
    const item: NotificationElement = {
      show: false,
      hostName,
      size,
    };
    this.notifications.push(item);
    window.setTimeout(() => {
      const index = this.notifications.findIndex(element => element === item);
      this.notifications.splice(index, 1);
    }, 7000);
  }

  @HostListener('resize', ['$event.detail'])
  onResizeEvent(detail: BoundSensorEventDetail) {
    const { width, height, host } = detail;
    const currentSize = `width: ${width}, height: ${height}`;
    this.addNotification(detail.host.tagName, currentSize);

    if (host === this.myElement) {
      this.myBoundSize = currentSize;
    } else if (host === this.myChildElement) {
      this.myChildBoundSize = currentSize;
    }
  }
}
