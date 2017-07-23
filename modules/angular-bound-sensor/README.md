# Angular Bound Sensor
Receive element's boundary size changes by events in Angular(v4).
This is very usefull to refresh component's contents if the size of `width` or `height` of its boundary changes.

## Instalation
You can install the module from npm repository:
```sh
npm install angular-bound-sensor
```
or by Yarn
```sh
yarn add angular-bound-sensor
```

## Usage
First import `BoundSensorModule` to your application module
```ts
import { BoundSensorModule } from 'angular-bound-sensor';

@NgModule({
  (...)
  imports: [
    BoundSensorModule,
  ],
})
export class AppModule { }
```
then add the directive to your component (`resize` is the name of event, you may name it anything):
```html
<simple-component boundSensor></simple-component>
```
and receive the event by `HostListener`:
```ts
@Component({
  selector: 'simple-component'
  (...)
})
class SimpleComponent {
  @HostListener('resize', ['$event'])
  onResize(event) {
    console.log(event.detail);
  }
}
```

## Demo
Take a look at this [working example at plunker](http://embed.plnkr.co/kYRXPHT6rHc7dcLw0Pxo/)
