# Bound Sensor Project
I started this project because I couldn't find any easy way to find out once an element size inside of DOM changes. This doesn't exist until this day that I write this package by native browser except `onresize` for window.  
I wrote this lightweight library to receive an event once an element's boundary changes.

## Bound Sensor
This is the base library that is written for JavaScript project, you can find [the code here](https://github.com/aminpaks/bound-sensor/tree/master/modules/bound-sensor) and a working [example here](https://github.com/aminpaks/bound-sensor/tree/master/examples/bound-sensor-demo).

## Angular Bound Sensor
This is a very small `@Directive` based on `bound-sensor` that does the job for you in Angular world. You can find [the source code here](https://github.com/aminpaks/bound-sensor/tree/master/modules/angular-bound-sensor), a [live demo here](https://aminpaks.github.io/bound-sensor/examples/angular-bound-sensor-cli-demo/dist/) and also an example source code [here](https://github.com/aminpaks/bound-sensor/tree/master/examples/angular-bound-sensor-demo) or [here with CLI](https://github.com/aminpaks/bound-sensor/tree/master/examples/angular-bound-sensor-cli-demo).

### Known issue
IE 11 doesn't support custom event which is necessary to take advantage of communicating between elements within DOM. If you would like to use BoundSensor (or AngularBoundSensor) on IE 11 you have to install a polyfill for `CustomEvent`. I personally use [this package](https://www.npmjs.com/package/custom-event-polyfill), just import it into your polyfills.

### Credits
Thanks to [@nasreddineskandrani](https://github.com/nasreddineskandrani)
