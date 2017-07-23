# Bound Sensor
`bound-sensor` is a super lightweight JavaScript library to help you to make better applications.  
This library is very useful if you want to refresh the content of a container once its boundary's size (width & height) changes.

## Usage
```js
import { BoundSensor, BoundSensorEvent } from 'bound-sensor';

// Our event name, you may name it anything
const eventName = 'resize';

// Creates a new reference of bound-sensor
const sensor = new BoundSensor({
  // Name of event, this is a CustomEvent
  eventName,
  // If you don't want bound-sensor manipulate the host styles
  // you can set this to false and then you must add `position: relative`
  // Manually to the host
  modifyStyles: true,
  // This value is amount of time in miliseconds to debounce the event
  // This is quiet useful if you don't wanna receive too many events
  // specially on resize windows or so...
  // Here we'll be notified every seconds after last event
  debounceTime: 1000,
});

// Let's get the element that we want to attache the sensor to
const holder = window.document.getElementById('holder');

// Let's receive the resize event sent by bound-sensor by adding an event listeneer
holder.addEventListener(eventName, function (event: BoundSensorEvent) {
  // Here we receive the resize details from event
  // This will log: { width: x, height: x, host: `<div id="holder">` }
  console.log(event.detail);
});

// Now we attach the sensor
sensor.attachSensor(holder);

// Let's detach the sensor after 10 seconds
// You must detach the sensor to avoid memory leaks
window.setTimeout(function () {
  sensor.detachSensor();
}, 10000);

// That's it!
```
