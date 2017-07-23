import { Component } from '@angular/core';

@Component({
  selector: 'root-component',
  template: `
    <simple-component boundSensor></simple-component>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1 1 100%;
      flex-direction: column;
      padding: 10px;
    }
  `]
})
export class RootComponent { }
