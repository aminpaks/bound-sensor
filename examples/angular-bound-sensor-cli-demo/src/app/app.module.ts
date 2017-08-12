import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BoundSensorModule } from 'angular-bound-sensor';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { ChildComponent } from './child/child.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainComponent,
    FooterComponent,
    HeaderComponent,
    ChildComponent
  ],
  imports: [
    BrowserModule,
    BoundSensorModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
