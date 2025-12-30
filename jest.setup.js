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

// Global addEventListener for react-native-css-interop
global.addEventListener = jest.fn((_event, _handler) => ({
  remove: jest.fn(),
}));
global.removeEventListener = jest.fn();

// Mock react-native-css-interop (NativeWind)
jest.mock('react-native-css-interop', () => ({
  __esModule: true,
  cssInterop: jest.fn((component) => component),
  remapProps: jest.fn((component) => component),
}));

// Mock nativewind
jest.mock('nativewind', () => ({
  __esModule: true,
  styled: jest.fn((component) => component),
}));

// Mock expo-sqlite
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runSync: jest.fn(),
    getFirstSync: jest.fn(),
    getAllSync: jest.fn(() => []),
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

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  __esModule: true,
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock expo-constants
jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      version: '1.0.0',
    },
    appOwnership: 'standalone',
  },
}));

// Mock react-native-health
jest.mock('react-native-health', () => ({
  __esModule: true,
  default: {
    initHealthKit: jest.fn((permissions, callback) => callback(null)),
    getStepCount: jest.fn((options, callback) => callback(null, { value: 1000 })),
    getDailyStepCountSamples: jest.fn((options, callback) => callback(null, [])),
    Constants: {
      Permissions: {
        StepCount: 'StepCount',
      },
    },
  },
}));

// Mock @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(() => Promise.resolve(null)),
    setItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
    clear: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
  },
}));

// Mock react-native-svg
jest.mock('react-native-svg', () => ({
  __esModule: true,
  default: 'Svg',
  Svg: 'Svg',
  Circle: 'Circle',
  Rect: 'Rect',
  Path: 'Path',
  G: 'G',
  Text: 'Text',
  TSpan: 'TSpan',
  Defs: 'Defs',
  LinearGradient: 'LinearGradient',
  RadialGradient: 'RadialGradient',
  Stop: 'Stop',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock @react-native-community/datetimepicker
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useFocusEffect: jest.fn((callback) => callback()),
  Link: 'Link',
  Stack: {
    Screen: 'Screen',
  },
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock DB queries (defaults, can be overridden in individual tests)
jest.mock('@/lib/db/queries/workouts', () => ({
  getWorkoutsByDateRange: jest.fn(() => []),
  getWorkoutsWithSetsByDateRange: jest.fn(() => []),
  getWorkoutWithSets: jest.fn(() => null),
  createWorkout: jest.fn(),
  finishWorkout: jest.fn(),
  deleteWorkout: jest.fn(),
  updateWorkout: jest.fn(),
}));

jest.mock('@/lib/db/queries/steps', () => ({
  getStepRecordsByDateRange: jest.fn(() => []),
  getAverageStepsByDateRange: jest.fn(() => 0),
}));

jest.mock('@/lib/db/queries/exercises', () => ({
  getAllExercises: jest.fn(() => []),
  createCustomExercise: jest.fn(),
}));

jest.mock('@/lib/db/queries/workout-sets', () => ({
  addSet: jest.fn(),
  updateSet: jest.fn(),
  deleteSet: jest.fn(),
}));
