import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
} from '@angular/core';

import { BoundSensorEventDetail } from 'angular-bound-sensor';

@Component({
  selector: 'simple-child-component',
  templateUrl: './component.html',
  styleUrls: ['./component.scss'],
})
export class SimpleChildComponent implements OnInit {

  private myElement: HTMLElement;
  private content: string = '';
  private myBoundSize: string;
  private dynamicContentEnable: boolean = true;

  constructor (elementRef: ElementRef) {
    this.myElement = elementRef.nativeElement;
  }

  ngOnInit() {
    this.myBoundSize = 'width: 0, height: 0';
  }

  updateContent() {
    const count = Math.floor(Math.random() * 100) + 50;
    this.content = Array(count).fill('<span>Sample Text</span>').join(' ');
  }

  dynamicContent() {
    this.dynamicContentEnable = false;
    this.updateContent();
    window.setInterval(this.updateContent.bind(this), 1000);
  }

  @HostListener('resize', ['$event.detail'])
  onResizeEvent(detail: BoundSensorEventDetail) {
    const { host, width, height } = detail;

    if (host === this.myElement) {
      this.myBoundSize = `width: ${width}, height: ${height}`;
    }
  }
}
