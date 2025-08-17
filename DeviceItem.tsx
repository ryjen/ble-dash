import React, { useCallback } from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Text, Button } from 'react-native';
import manager from './BleManager';

type RootStackParamList = {
  Dashboard: {
    deviceId: string;
    serviceUUID: string;
    characteristicUUID: string;
  }
};
type DeviceItemProps = {
  name: string;
  id: string;
};

export const DeviceItem = ({ name, id }: DeviceItemProps) => {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleConnect = useCallback(async () => {
    try {
      const connectedDevice = await manager.connectToDevice(id);
      await connectedDevice.discoverAllServicesAndCharacteristics();
      // get the service and characteristic UUIDs
      const services = await connectedDevice.services();
      const serviceUUID = services[0].uuid;
      const characteristics = await connectedDevice.characteristicsForService(serviceUUID);
      const characteristicUUID = characteristics[0].uuid;

      // Navigate to the Dashboard with the device details
      navigation.navigate('Dashboard', {
        deviceId: id,
        serviceUUID,
        characteristicUUID
      });
    } catch (error) {
      console.error('Connection error:', error);
    }
  }, [id, navigation]);

  return (
  <>
    <Text>{name} ({id})</Text>
    <Button
      title="Connect"
      onPress={handleConnect}
    />
  </>
)
}


