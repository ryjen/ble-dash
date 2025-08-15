
import React, { useEffect, useState } from 'react';
import { Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import manager from './BleManager'; // Your BLE manager instance
import { Buffer } from 'buffer';

const DashboardScreen = ({ route }) => {
  const { deviceId, serviceUUID, characteristicUUID } = route.params;
  const [dataPoints, setDataPoints] = useState([]);
  const [labels, setLabels] = useState([]);
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

          const base64 = characteristic?.value;
          const buffer = Buffer.from(base64, 'base64');
          const raw = buffer.readInt16LE(0); // Adjust based on your sensor
          const value = raw / 100;

          const timestamp = new Date().toLocaleTimeString();

          setCurrentValue(value);
          setDataPoints(prev => [...prev.slice(-9), value]);
          setLabels(prev => [...prev.slice(-9), timestamp]);
        }
      );
    };

    connectAndSubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Live Temperature</Text>
      <Text style={styles.value}>{currentValue?.toFixed(1)} °C</Text>

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
