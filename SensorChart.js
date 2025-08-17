import React from 'react';
import { LineChart, Grid } from 'react-native-svg-charts';
import { View, Text, StyleSheet } from 'react-native';

export default function SensorChart({ title, data, color }) {
  const values = data.map(d => d.value);

  return (
    <View style={styles.container} >
      <Text style={styles.title}>{title}</Text>
      <LineChart
        style={styles.chart}
        data={values}
        svg={{ stroke: color }}
        contentInset={{ top: 20, bottom: 20 }}
      >
        <Grid />
      </LineChart>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  chart: {
    height: 150,
  },
});
