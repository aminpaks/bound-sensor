import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimpleComponent } from './component';
import { SimpleChildComponent } from './child/component';
import { SimpleNotificationComponent } from './notification/component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BoundSensorModule } from 'angular-bound-sensor';

@NgModule({
  declarations: [
    SimpleComponent,
    SimpleChildComponent,
    SimpleNotificationComponent,
  ],
  imports: [
    CommonModule,
    BoundSensorModule,
    BrowserAnimationsModule,
  ],
  exports: [
    SimpleComponent,
    SimpleChildComponent,
  ],
})
export class ExampleModule {}
