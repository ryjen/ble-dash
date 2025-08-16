
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

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

describe('SensorStream', () => {
  test('mockTemperatureStream emits temperature data', (done) => {
    mockTemperatureStream.pipe(take(1)).subscribe(data => {
      expect(data).toHaveProperty('value');
      expect(data).toHaveProperty('timestamp');
      expect(typeof data.value).toBe('number');
      expect(data.value).toBeGreaterThanOrEqual(20);
      expect(data.value).toBeLessThanOrEqual(30);
      done();
    });
  });

  test('mockHumidityStream emits humidity data', (done) => {
    mockHumidityStream.pipe(take(1)).subscribe(data => {
      expect(data).toHaveProperty('value');
      expect(data).toHaveProperty('timestamp');
      expect(typeof data.value).toBe('number');
      expect(data.value).toBeGreaterThanOrEqual(30);
      expect(data.value).toBeLessThanOrEqual(70);
      done();
    });
  });
});
