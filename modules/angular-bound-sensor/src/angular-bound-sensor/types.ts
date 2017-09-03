import { BoundSensorOptions } from 'bound-sensor';
export { BoundSensorEvent, BoundSensorEventDetail } from 'bound-sensor';

export interface BoundSensorSettings extends BoundSensorOptions {
  attachToParent: boolean;
}
