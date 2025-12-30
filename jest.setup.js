// Jest setup file

// Mock Expo import.meta registry
global.__ExpoImportMetaRegistry = new Map();

// Global setup for NativeWind/React Native
global.Appearance = {
  getColorScheme: () => 'dark',
  addChangeListener: () => ({ remove: () => {} }),
  removeChangeListener: () => {},
  addEventListener: () => ({ remove: () => {} }),
};

// Global addEventListener
global.addEventListener = jest.fn((_event, _handler) => ({
  remove: jest.fn(),
}));
global.removeEventListener = jest.fn();

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

// Mock expo-sqlite/kv-store
const mockKvStore = new Map();
jest.mock('expo-sqlite/kv-store', () => ({
  openDatabaseSync: jest.fn(() => ({
    get: jest.fn((key) => mockKvStore.get(key)),
    set: jest.fn((key, value) => mockKvStore.set(key, value)),
    delete: jest.fn((key) => mockKvStore.delete(key)),
    clear: jest.fn(() => mockKvStore.clear()),
    getAllKeys: jest.fn(() => Array.from(mockKvStore.keys())),
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
  addEventListener: jest.fn((_event, _handler) => ({
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
  useAnimatedProps: jest.fn((_callback) => ({})),
  withSpring: jest.fn((value) => value),
  createAnimatedComponent: jest.fn((component) => component),
}));

// Mock Expo modules
jest.mock('expo', () => ({
  __esModule: true,
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.0.0',
    },
  },
}));

// Mock DB queries
jest.mock('@/lib/db/queries/workouts', () => ({
  getWorkoutsByDateRange: jest.fn(() => []),
  getWorkoutWithSets: jest.fn(() => null),
}));

jest.mock('@/lib/db/queries/steps', () => ({
  getStepRecordsByDateRange: jest.fn(() => []),
  getAverageStepsByDateRange: jest.fn(() => 0),
}));
