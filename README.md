# bound-sensor
Get inform once an element parent's boundary changes in Angular2.
This is very usefull to refresh a component if the size of `width` or `height` of its container changes.

## Usage
First import `BoundSensorModule` to your application module
```ts
import { BoundSensorModule } from 'bound-sensor';

@NgModule({
  (...)
  imports: [
    BoundSensorModule,
  ],
})
export class AppModule { }
```
then add the directive to your component (`resize` is the name of event, you may name it anything):
```ts
<simple boundSensor="resize"></simple>
```
and receive the event by `HostListener`:
```ts
@Component({
  selector: 'simple'
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


### Credits
Thanks to [@nasreddineskandrani](https://github.com/nasreddineskandrani)
