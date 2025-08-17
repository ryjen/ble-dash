import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, FlatList, StyleSheet } from 'react-native';
import manager, { requestPermissions } from './BleManager';
import { DeviceItem } from './DeviceItem';
import { Device } from 'react-native-ble-plx';

export function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    requestPermissions();
  }, []);

  const startScan = useCallback(() => {
    setDevices([]);
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn(error);
        return;
      }

      if (device && device.name && !devices.find(d => d.id === device.id)) {
        setDevices(prev => [...prev, device]);
      }
    });

    // Stop scan after 10 seconds
    setTimeout(() => manager.stopDeviceScan(), 10000);
  }, [devices]);

  return (
    <View style={styles.container}>
      <Button title="Scan for Sensors" onPress={startScan} />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <DeviceItem id={item.id} name={item.name} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
