// Jest setup file

// Global setup for NativeWind/React Native
global.Appearance = {
  getColorScheme: () => 'dark',
  addChangeListener: () => ({ remove: () => {} }),
  removeChangeListener: () => {},
  addEventListener: () => ({ remove: () => {} }),
};

// Mock nativewind
jest.mock('react-native-css-interop', () => ({
  __esModule: true,
}));

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getFirstSync: jest.fn(),
    getAllSync: jest.fn(),
  })),
}));

// Mock react-native
const mockAppearanceListeners = [];

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  Appearance: {
    getColorScheme: jest.fn(() => 'dark'),
    addChangeListener: jest.fn((listener) => {
      mockAppearanceListeners.push(listener);
      return {
        remove: jest.fn(() => {
          const index = mockAppearanceListeners.indexOf(listener);
          if (index > -1) {
            mockAppearanceListeners.splice(index, 1);
          }
        }),
      };
    }),
    removeChangeListener: jest.fn(),
  },
  NativeModules: {
    RNSVGRenderableModule: {
      Mixin: jest.fn(),
    },
  },
  addEventListener: jest.fn((event, handler) => ({
    remove: jest.fn(),
  })),
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: jest.fn(),
  Circle: jest.fn(),
  Rect: jest.fn(),
  Path: jest.fn(),
  G: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {
    createAnimatedComponent: jest.fn((component) => component),
  },
  useSharedValue: jest.fn((value) => ({ value })),
  useAnimatedProps: jest.fn((callback) => ({})),
  withSpring: jest.fn((value) => value),
  createAnimatedComponent: jest.fn((component) => component),
}));
