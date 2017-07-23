import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RootComponent } from './component';
import { ExampleModule } from './example';
import { BoundSensorModule } from 'angular-bound-sensor';


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ExampleModule,
    BoundSensorModule,
  ],
  declarations: [
    RootComponent,
  ],
  entryComponents: [
    RootComponent,
  ],
  bootstrap: [
    RootComponent,
  ]
})
export class RootModule { }
