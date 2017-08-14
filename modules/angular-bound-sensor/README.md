# Angular Bound Sensor
Receive element's boundary size changes by events in Angular(v4).
This is very useful to refresh component's contents if the size of `width` or `height` of its boundary changes.

## Installation
You can install it from [npm repository](https://www.npmjs.com/package/angular-bound-sensor):
```sh
$ npm install angular-bound-sensor
```
or from [Yarn repository](https://yarnpkg.com/en/package/angular-bound-sensor)
```sh
$ yarn add angular-bound-sensor
```

## Usage
First import `BoundSensorModule` to your application module, or any module that is using it:
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
then add the directive to your component:
```html
<simple-component boundSensor></simple-component>
```
and receive the event by `HostListener` from `@angular/core`:
```ts
import { HostListener } from '@angular/core';

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
That's it!

## Settings
You may pass an object or its reference to directive to setup the sensor with specific settings as example below:
```html
<simple-component [boundSensor]="{eventName: 'my_resize_event', debounceTime: 1000, modifyStyles: false}"></simple-component>
```
### Settings properties
* `eventName` is a `string` that will be the custom event name. Default is `resize`. Every time sensor dispatches an event, you will receive it by that specific name. This is useful if you want to have different hierarchy of component and easily handle multiple sensors in the same DOM hierarchy.
* `debounceTime` is a `number` in milliseconds. Default is `10` milliseconds. Once there is a change in boundary, sensor will dispatch an event based on this setting. 1000 means that events will be dispatched every 1 second and all the other within 1 seconds will be ignored.
* `modifyStyles` is a `boolean`. Default is `true`. This is useful if you want to handle the style of the host by yourself. There are some cases that you want to have very specific styles on your DOM element. If you want to take advantage of custom styles by setting it to `false` you need to set two styles to the host element manually so sensor can work properly:
  * `position` needs to be `relative`
  * `display` needs to be `block`, `inline-block`, `table` or `flex`

  The css equivalent will be:
    ```css
    simple-component {
      position: relative;
      display: inline-block;
    }
    ```

## Demo
Take a look at this [live demo](https://aminpaks.github.io/bound-sensor/examples/angular-bound-sensor-cli-demo/dist/), and you can find [the source here](https://github.com/aminpaks/bound-sensor/tree/master/examples/angular-bound-sensor-cli-demo).
