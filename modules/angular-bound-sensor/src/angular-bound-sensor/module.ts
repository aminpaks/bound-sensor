import { NgModule } from '@angular/core';
import { BoundSensorDirective } from './directive';


@NgModule({
  declarations: [
    BoundSensorDirective,
  ],
  exports: [
    BoundSensorDirective,
  ],
})
export class BoundSensorModule { }
