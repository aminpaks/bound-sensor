import { Component, HostListener } from '@angular/core';
import { BoundSensorEventDetail } from 'angular-bound-sensor';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.scss']
})
export class ChildComponent {

  intervalID: number;
  randomContents: string;
  myBoundSize: BoundSensorEventDetail;
  myBoundSizeClass = '';

  constructor() {
    this.myBoundSize = <BoundSensorEventDetail>{ width: 0, height: 0 };
  }

  doAnimate(property: string) {
    (<any>this)[property] = 'flash';
    setTimeout(() => (<any>this)[property] = 'flash fade-out', 300);
    setTimeout(() => (<any>this)[property] = '', 500);
  }

  @HostListener('resize', ['$event.detail'])
  onResizeEvent(detail: BoundSensorEventDetail) {
    this.myBoundSize = detail;
    this.doAnimate('myBoundSizeClass');
  }

  getTexts() {
    const count = Math.floor(Math.random() * 200) + 40;
    const texts = Array(count).fill('<span>Short Text</span>').join('');

    this.randomContents = texts;
  }

  generateContents() {
    this.getTexts();
    this.intervalID = window.setInterval(() => this.getTexts(), 2000);
  }

  removeContents() {
    window.clearInterval(this.intervalID);
    this.randomContents = '';
  }
}
