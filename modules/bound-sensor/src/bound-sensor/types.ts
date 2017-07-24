export interface BoundSensorOptions {
  eventName: string;
  debounceTime: number;
  modifyStyles: boolean;
}

export interface BoundSensorEventDetail {
  host: HTMLElement;
  width: number;
  height: number;
}

export interface BoundSensorEvent extends CustomEvent {
  detail: BoundSensorEventDetail;
}
export interface BoundSensorCallback {
  (event: BoundSensorEvent): void;
}
