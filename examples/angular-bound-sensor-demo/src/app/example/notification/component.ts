import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'simple-notification',
  template: `<span>{{hostName}} => {{size}}</span>`,
  styles: [`
    :host {
      display: block;
      padding: 4px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background-color: #fff;
      text-align: right;
    }
    :host:not(:last-of-type) {
      margin-bottom: 4px;
    }
  `],
})
export class SimpleNotificationComponent {

  @Input() size: string = '';
  @Input() hostName: string = '';

}
