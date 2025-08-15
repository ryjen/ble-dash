
import React, { useEffect, useState, useCallback } from 'react';
import { View, Button, FlatList } from 'react-native';
import manager, { requestPermissions } from './BleManager';
import { Device } from './Device';

export function Devices() {
  const [devices, setDevices] = useState([]);

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
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Button title="Scan for Sensors" onPress={startScan} />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
	  <Device {...item} />
        )}
      />
    </View>
  );
}
