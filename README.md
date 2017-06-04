# bound-sensor
Get inform once an element boundary changes in Angular

## Usage
First import `BoundSensorModule` to your application module
```
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
```
<simple boundSensor="resize"></simple>
```
and receive the event by `HotListener`:
```
@Component({
  selector: 'simple'
  (...)
})
class SimpleComponent {
  @HotListener('resize', ['$event'])
  onResize(event) {
    console.log(event.detail);
  }
}
```
