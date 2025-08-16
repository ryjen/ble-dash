# AGENTS.md

## Build/Test Commands

- `npm test` - Run all tests
- `npm test -- --testNamePattern="specific test"` - Run specific test by name
- `npm run lint` - Lint all code
- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS only)

## Code Style Guidelines

- **Imports**: Group React Native imports first, then third-party, then local imports with relative paths
- **Formatting**: Use Prettier defaults - single quotes, trailing commas, avoid arrow parens
- **Types**: Mix of TypeScript (.tsx) and JavaScript (.js) files; use TypeScript for new React components
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for test files
- **Components**: Export default for main components, named exports for utilities
- **Error Handling**: Use console.warn() for BLE errors, try/catch for async operations
- **Styles**: Use StyleSheet.create() at bottom of files, descriptive style names
- **BLE**: Import manager from './BleManager', handle permissions for Android
- **Data**: Use Buffer for BLE data parsing, limit chart data points (slice(-9))
- **Testing**: Use ReactTestRenderer with act() wrapper for async component tests

## Project Notes

React Native 0.81.0 BLE sensor dashboard app. Key files: BleManager.js (permissions), SensorStream.js (RxJS), Decoders.js (data parsing).
