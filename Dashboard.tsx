
import React, { useEffect, useState } from 'react';
import { Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import manager from './BleManager';
import { Buffer } from 'buffer';

const DashboardScreen = ({navigator}: {navigator: any}) => {
  const { deviceId, serviceUUID, characteristicUUID } = navigator.route.params;
  const [currentValue, setCurrentValue] = useState(null);

  useEffect(() => {
    const connectAndSubscribe = async () => {
      const device = await manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();

      device.monitorCharacteristicForService(
        serviceUUID,
        characteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.warn('Monitor error:', error);
            return;
          }
          if (!characteristic || !characteristic.value) {
            console.warn('No characteristic value received');
            return;
          }

          // Decode the characteristic value as json
          const value = Buffer.from(characteristic.value, 'base64').toString('utf-8');
          const parsedValue = JSON.parse(value);
          setCurrentValue(parsedValue);
        }
      );
    };

    connectAndSubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>Device Dashboard</Text>
      <Text style={styles.value}>Device ID: {deviceId}</Text>
      <Text style={styles.value}>Service UUID: {serviceUUID}</Text>
      <Text style={styles.value}>Characteristic UUID: {characteristicUUID}</Text> 

      <LineChart
        data={{
          labels,
          datasets: [{ data: dataPoints }],
        }}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisSuffix="°C"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f0f0f0',
          backgroundGradientTo: '#e0e0e0',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  value: {
    fontSize: 28,
    color: '#007AFF',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
});

export default DashboardScreen;
