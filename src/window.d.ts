declare class AmbientLightSensor {
  onreading: () => void;
  onerror: (event: { error: any }) => void;
  start: () => void;
  illuminance: number;
}
