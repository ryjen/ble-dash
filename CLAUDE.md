# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BLE Dash is a React Native application for creating Bluetooth Low Energy (BLE) sensor dashboards with real-time data visualization. The app connects to BLE devices, reads sensor data, and displays it in charts with live updates.

## Architecture

### Frontend (React Native)
- **App.tsx**: Main app component with safe area provider and dark mode support
- **Devices.tsx**: Device discovery and scanning interface 
- **Device.tsx**: Individual device connection component
- **Dashboard.tsx**: Live temperature dashboard with chart visualization
- **SensorDashboard.js**: Multi-sensor dashboard combining temperature and humidity
- **SensorChart.js**: Reusable chart component using react-native-svg-charts
- **SensorStream.js**: RxJS-based reactive stream for BLE sensor data
- **BleManager.js**: BLE manager wrapper with Android permissions handling
- **Decoders.js**: Data decoders for different sensor types (temperature, humidity)

### Backend
- **server/**: Contains BLE GATT server implementation and setup scripts
- **server/setup-ble.sh**: Arch Linux setup script for BLE server with systemd integration

### Key Technologies
- React Native 0.81.0 with TypeScript support
- react-native-ble-plx for BLE connectivity
- RxJS for reactive data streams
- react-native-chart-kit and react-native-svg-charts for data visualization
- Jest for testing

## Development Commands

### React Native Development
```bash
# Start Metro bundler
npm start

# Run on Android (requires Android setup)
npm run android

# Run on iOS (requires iOS setup and macOS)
npm run ios

# Run tests
npm test

# Lint code
npm run lint
```

### Android Development
```bash
# Build Android app directly
cd android && ./gradlew assembleDebug

# Clean Android build
cd android && ./gradlew clean
```

### BLE Server Setup (Linux)
```bash
# Setup BLE GATT server on Arch Linux
cd server && ./setup-ble.sh

# Run BLE server manually
python3 server/ble-gatt-server
```

## Code Patterns

### BLE Data Flow
1. **BleManager.js** handles device connections and Android permissions
2. **SensorStream.js** creates RxJS observables for continuous data streaming
3. **Decoders.js** converts raw BLE data buffers to sensor values
4. Chart components render real-time data with automatic data point limiting

### Component Structure
- Device scanning starts in **Devices.tsx** which renders **Device.tsx** components
- Individual devices connect via BLE and can navigate to dashboard views
- Dashboard components use reactive streams for real-time sensor data updates

### Testing Strategy
- Uses Jest with React Native preset
- Basic smoke tests for component rendering
- Mock sensor streams available in test files for simulating BLE data

## Key Implementation Details

- BLE permissions are handled automatically for Android in BleManager.js:6-14
- Sensor data is decoded using little-endian format in Decoders.js:2
- Real-time charts limit data points to prevent memory issues (Dashboard.tsx:36, SensorDashboard.js:23)
- RxJS streams provide clean subscription management with automatic cleanup
- Temperature alerts trigger when values exceed 30°C (SensorDashboard.js:26-28)