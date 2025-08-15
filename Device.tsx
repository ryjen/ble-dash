import React from 'react';
import {Text, Button} from 'react-native';

export const Device = (props) => (
  <>
  <Text>{props.name} ({props.id})</Text>
  <Button
  title="Connect"
  onPress={async () => {
    const connectedDevice = await manager.connectToDevice(props.id);
    await connectedDevice.discoverAllServicesAndCharacteristics();
    const services = await connectedDevice.services();
    const characteristics = await services[0].characteristics();

    const value = await connectedDevice.readCharacteristicForService(
      services[0].uuid,
      characteristics[0].uuid
    );

    console.log('Sensor Value:', value.value); // Base64 encoded
  }}
/>
</>
)


