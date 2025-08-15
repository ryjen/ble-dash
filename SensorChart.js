// components/SensorChart.js
import React from 'react';
import { LineChart, Grid } from 'react-native-svg-charts';
import { View, Text } from 'react-native';

export default function SensorChart({ title, data, color }) {
  const values = data.map(d => d.value);

  return (
    <View style={{ marginVertical: 10 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{title}</Text>
      <LineChart
        style={{ height: 150 }}
        data={values}
        svg={{ stroke: color }}
        contentInset={{ top: 20, bottom: 20 }}
      >
        <Grid />
      </LineChart>
    </View>
  );
}
