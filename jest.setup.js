jest.mock('react-native', () => ({
  StatusBar: 'StatusBar',
  StyleSheet: {
    create: jest.fn(styles => styles),
  },
  useColorScheme: jest.fn(() => 'light'),
  View: 'View',
  Text: 'Text',
  Button: 'Button',
  FlatList: 'FlatList',
  Platform: {
    OS: 'ios',
    select: jest.fn(obj => obj.ios || obj.default),
  },
  NativeModules: {
    BleManager: {},
  },
  DeviceEventEmitter: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
  },
}));

jest.mock('react-native-ble-plx', () => {
  return {
    BleManager: jest.fn().mockImplementation(() => ({
      startDeviceScan: jest.fn(),
      stopDeviceScan: jest.fn(),
      connectToDevice: jest.fn(),
      discoverAllServicesAndCharacteristicsForDevice: jest.fn(),
      monitorCharacteristicForDevice: jest.fn(),
    })),
    Device: jest.fn(),
  };
});

jest.mock('react-native-chart-kit', () => ({
  LineChart: () => 'LineChart',
}));

jest.mock('react-native-svg', () => ({
  Svg: () => 'Svg',
  Circle: () => 'Circle',
  Line: () => 'Line',
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({children}) => children,
  useSafeAreaInsets: () => ({top: 0, right: 0, bottom: 0, left: 0}),
}));

jest.mock('./BleManager', () => ({
  __esModule: true,
  default: {
    startDeviceScan: jest.fn(),
    stopDeviceScan: jest.fn(),
    connectToDevice: jest.fn(),
  },
  requestPermissions: jest.fn(),
}));

jest.mock('./Device', () => ({
  Device: () => 'Device',
}));