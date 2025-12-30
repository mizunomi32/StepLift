import { render, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import TabLayout from '../_layout';

// モックコンポーネント
const mockScreen = jest.fn(({ name, options }: any) => (
  <View testID={`tab-screen-${name}`}>
    <Text>{options?.title}</Text>
  </View>
));

const mockTabs = jest.fn(({ children, screenOptions }: any) => (
  <View testID="tabs" data-screen-options={JSON.stringify(screenOptions)}>
    {children}
  </View>
));

// expo-routerモック
jest.mock('expo-router', () => {
  const MockTabsComponent = (props: any) => mockTabs(props);
  MockTabsComponent.Screen = (props: any) => mockScreen(props);
  return { Tabs: MockTabsComponent };
});

jest.mock('@/components/haptic-tab', () => ({
  HapticTab: 'HapticTab',
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: ({ name }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View testID={`icon-${name}`}>
        <Text>{name}</Text>
      </View>
    );
  },
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'dark',
}));

jest.mock('@/constants/theme', () => ({
  Colors: {
    dark: {
      background: '#0A0A0A',
      tint: '#22C55E',
      inactive: '#9CA3AF',
    },
  },
}));

describe('TabLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('4つのタブが正しく定義されている', () => {
    render(<TabLayout />);
    // mockScreenが4回呼ばれることを確認
    expect(mockScreen).toHaveBeenCalledTimes(4);
  });

  it('ホームタブが正しく設定されている', () => {
    render(<TabLayout />);
    expect(mockScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'index',
        options: expect.objectContaining({ title: 'ホーム' }),
      })
    );
  });

  it('筋トレタブが正しく設定されている', () => {
    render(<TabLayout />);
    expect(mockScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'workout',
        options: expect.objectContaining({ title: '筋トレ' }),
      })
    );
  });

  it('歩数タブが正しく設定されている', () => {
    render(<TabLayout />);
    expect(mockScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'steps',
        options: expect.objectContaining({ title: '歩数' }),
      })
    );
  });

  it('履歴タブが正しく設定されている', () => {
    render(<TabLayout />);
    expect(mockScreen).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'history',
        options: expect.objectContaining({ title: '履歴' }),
      })
    );
  });

  it('ダークテーマの色が適用されている', () => {
    render(<TabLayout />);
    expect(mockTabs).toHaveBeenCalledWith(
      expect.objectContaining({
        screenOptions: expect.objectContaining({
          tabBarActiveTintColor: '#22C55E',
        }),
      })
    );
  });

  it('タブバーの背景色がダークモード対応している', () => {
    render(<TabLayout />);
    expect(mockTabs).toHaveBeenCalledWith(
      expect.objectContaining({
        screenOptions: expect.objectContaining({
          tabBarStyle: expect.objectContaining({
            backgroundColor: '#0A0A0A',
          }),
        }),
      })
    );
  });

  it('非アクティブタブの色が正しく設定されている', () => {
    render(<TabLayout />);
    expect(mockTabs).toHaveBeenCalledWith(
      expect.objectContaining({
        screenOptions: expect.objectContaining({
          tabBarInactiveTintColor: '#9CA3AF',
        }),
      })
    );
  });

  it('ハプティクスフィードバックが有効になっている', () => {
    render(<TabLayout />);
    expect(mockTabs).toHaveBeenCalledWith(
      expect.objectContaining({
        screenOptions: expect.objectContaining({
          tabBarButton: 'HapticTab',
        }),
      })
    );
  });

  it('各タブにアイコンが設定されている', () => {
    render(<TabLayout />);
    // 各タブにtabBarIconオプションが設定されていることを確認
    const calls = mockScreen.mock.calls;
    expect(calls).toHaveLength(4);

    // 各呼び出しでoptions.tabBarIconが関数であることを確認
    calls.forEach((call) => {
      expect(typeof call[0].options.tabBarIcon).toBe('function');
    });
  });
});
