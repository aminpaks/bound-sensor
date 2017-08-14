# Bound Sensor
`bound-sensor` is a super lightweight JavaScript library to help you to make better applications.  
This library is very useful if you want to refresh the content of a container once its boundary's size (width & height) changes.

## Breaking Changes
This package on NPM used to be for Angular, now they've been separated. If you want to install this lib for Angular you may [find it here as `angular-bound-sensor`](https://github.com/aminpaks/bound-sensor/tree/master/modules/angular-bound-sensor).

## Usage
```ts
import { BoundSensor, BoundSensorEvent } from 'bound-sensor';

/**
 * Our event name, you may name it anything and we
 * will receive it by the same name
 */
const eventName = 'resize';

// Creates a new copy of bound-sensor
const sensor = new BoundSensor({
  // Name of event, this is a CustomEvent
  eventName,
  /**
   * If you don't want bound-sensor manipulate the host styles
   * you can set this to false and then you must add two properties
   * to host element:
   * 1. `position` to `relative`
   * 2. `display` to `block`, `table`, `inline-block` or `flex`
   */
  modifyStyles: true,
  /**
   * This value is amount of time in milliseconds to debounce the event
   * This is quiet useful if you don't wanna receive too many events
   * specially on resize windows or so...
   * Here we'll be notified every seconds after last event
   */
  debounceTime: 1000,
});

// Let's get the element that we want to attache the sensor to
const holder = window.document.getElementById('holder');

/**
 * Let's receive the resize event sent by bound-sensor by adding an
 * event listener to our host element
 */
holder.addEventListener(eventName, function (event: BoundSensorEvent) {
  // Here we receive the resize details from event
  // This will log: { width: x, height: x, host: `<div id="holder">` }
  console.log(event.detail);
});

// Now we attach the sensor
sensor.attachSensor(holder);

// Let's detach the sensor after 10 seconds
// We must detach the sensor to avoid memory leaks
window.setTimeout(function () {
  sensor.detachSensor();
}, 10000);

// That's it!
```

## Example
You can checkout a [demo here](https://github.com/aminpaks/bound-sensor/tree/master/examples/bound-sensor-demo).
