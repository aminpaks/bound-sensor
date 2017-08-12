import { Component, HostBinding, HostListener, ElementRef, ViewChild } from '@angular/core';
import { BoundSensorEventDetail } from 'angular-bound-sensor';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

  element: HTMLElement;
  myBoundSize: BoundSensorEventDetail;
  myChildBoundSize: BoundSensorEventDetail;
  myBoundSizeClass = '';
  myChildBoundSizeClass = '';

  @ViewChild('child', { read: ElementRef }) child: ElementRef;
  @HostBinding('class.grow') shouldGrow = false;

  constructor(myElRef: ElementRef) {
    this.element = myElRef.nativeElement;
    this.myBoundSize = <BoundSensorEventDetail>{ width: 0, height: 0 };
    this.myChildBoundSize = <BoundSensorEventDetail>{ width: 0, height: 0 };
  }

  @HostListener('resize', ['$event.detail'])
  onResize(detail: BoundSensorEventDetail) {
    if (detail.host === this.element) {
      this.myBoundSize = detail;
      this.doAnimate('myBoundSizeClass');
    } else if (detail.host === this.child.nativeElement) {
      this.myChildBoundSize = detail;
      this.doAnimate('myChildBoundSizeClass');
    }
  }

  doAnimate(property: string) {
    (<any>this)[property] = 'flash';
    setTimeout(() => (<any>this)[property] = 'flash fade-out', 300);
    setTimeout(() => (<any>this)[property] = '', 500);
  }

  setShouldIGrow(value: boolean) {
    this.shouldGrow = value;
  }
}
