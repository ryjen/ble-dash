
// mockSensorStream.js
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

export const mockTemperatureStream = interval(1000).pipe(
  map(() => ({
    value: Math.random() * 10 + 20,
    timestamp: new Date()
  }))
);

export const mockHumidityStream = interval(1000).pipe(
  map(() => ({
    value: Math.random() * 40 + 30,
    timestamp: new Date()
  }))
);
