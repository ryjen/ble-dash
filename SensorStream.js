// sensorStream.js
import { Observable } from 'rxjs';
import { Buffer } from 'buffer';
import manager from './BleManager';

export const createSensorStream = (deviceId, serviceUUID, characteristicUUID, decodeFn) => {
  return new Observable(observer => {
    let subscription;

    const connectAndMonitor = async () => {
      const device = await manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();

      subscription = device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        (error, characteristic) => {
          if (error) {
            observer.error(error);
            return;
          }

          const base64 = characteristic?.value;
          const buffer = Buffer.from(base64, 'base64');
          const value = decodeFn(buffer);

          observer.next({ value, timestamp: new Date() });
        }
      );
    };

    connectAndMonitor();

    return () => {
      if (subscription) subscription.remove();
    };
  });
};
