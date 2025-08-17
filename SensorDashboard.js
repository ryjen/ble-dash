import React, { useEffect, useState } from 'react';
import { Text, Alert, ScrollView } from 'react-native';
import { combineLatest } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { createSensorStream } from '../utils/sensorStream';
import { decodeTemperature, decodeHumidity } from '../utils/decoders';
import SensorChart from '../components/SensorChart';

export default function SensorDashboard() {
  const [tempHistory, setTempHistory] = useState([]);
  const [humidityHistory, setHumidityHistory] = useState([]);
  const [current, setCurrent] = useState({ temp: null, humidity: null });

  useEffect(() => {
    const temp$ = createSensorStream('device-id', 'service-uuid', 'temp-char-uuid', decodeTemperature);
    const humidity$ = createSensorStream('device-id', 'service-uuid', 'humidity-char-uuid', decodeHumidity);

    const combined$ = combineLatest([temp$, humidity$]).pipe(throttleTime(1000));

    const subscription = combined$.subscribe(([temp, humidity]) => {
      setCurrent({ temp: temp.value, humidity: humidity.value });

      setTempHistory(prev => [...prev.slice(-19), temp]);
      setHumidityHistory(prev => [...prev.slice(-19), humidity]);

      if (temp.value > 30) {
        Alert.alert('🔥 High Temperature', `Temp: ${temp.value} °C`);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Live Sensor Dashboard</Text>
      <Text>🌡️ Temperature: {current.temp} °C</Text>
      <Text>💧 Humidity: {current.humidity} %</Text>

      <SensorChart title="Temperature (°C)" data={tempHistory} color="tomato" />
      <SensorChart title="Humidity (%)" data={humidityHistory} color="skyblue" />
    </ScrollView>
  );
}
