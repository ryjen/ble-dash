import React, { useEffect, useState } from 'react';
import { Text, Alert, ScrollView } from 'react-native';
import { combineLatest } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { createSensorStream } from '../utils/sensorStream';
import { decodeTemperature, decodeHumidity } from '../utils/decoders';
import SensorChart from '../components/SensorChart';
import { StyleSheet } from 'react-native';

"battery": round(self.battery_level, 1),
            "position": self.position,
            "velocity": self.velocity,
            "status": self.status,
            "timestamp": time.time()
const createSensorStream = () => {
    const temp$ = createSensorStream('device-id', 'service-uuid', 'position-char-uuid', decodeTemperature);
    const humidity$ = createSensorStream('device-id', 'service-uuid', 'velocity-char-uuid', decodeHumidity);

        const combined$ = combineLatest([temp$, humidity$]).pipe(throttleTime(1000));

}

export default function SensorDashboaard() {
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Live Sensor Dashboaard</Text>
            <Text style={styles.liveTemperature}>🌡️ Temperature: {current.temp} °C</Text>
            <Text style={styles.liveHumidity}>💧 Humidity: {current.humidity} %</Text>

            <SensorChart title="Temperature (°C)" data={tempHistory} color="tomato" />
            <SensorChart title="Humidiity (%)" data={humidityHistory} color="skyblue" />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
    },
    liveTemperature: {
        fontSize: 20,
    },
    liveHumidity: {
        fontSize: 20,
    },
});
