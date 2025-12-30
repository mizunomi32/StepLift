import { render, screen } from '@testing-library/react-native';
import TabLayout from '../_layout';

// Mock dependencies
jest.mock('expo-router', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const MockScreen = ({ name, options }: any) =>
    React.createElement(
      View,
      { testID: `tab-screen-${name}` },
      React.createElement(Text, null, options?.title)
    );

  const MockTabs = ({ children, screenOptions }: any) =>
    React.createElement(
      View,
      {
        testID: 'tabs',
        'data-screen-options': JSON.stringify(screenOptions),
      },
      children
    );
  MockTabs.Screen = MockScreen;

  return { Tabs: MockTabs };
});

jest.mock('@/components/haptic-tab', () => ({
  HapticTab: 'HapticTab',
}));

jest.mock('@/components/ui/icon-symbol', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    IconSymbol: ({ name }: any) =>
      React.createElement(View, { testID: `icon-${name}` }, React.createElement(Text, null, name)),
  };
});

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
  it('4つのタブが正しく定義されている', () => {
    render(<TabLayout />);
    // モックのtab-screen-{name}でタブをカウント
    expect(screen.getByTestId('tab-screen-index')).toBeTruthy();
    expect(screen.getByTestId('tab-screen-workout')).toBeTruthy();
    expect(screen.getByTestId('tab-screen-steps')).toBeTruthy();
    expect(screen.getByTestId('tab-screen-history')).toBeTruthy();
  });

  it('ホームタブが正しく設定されている', () => {
    render(<TabLayout />);
    // ホームタブのアイコンとラベルが正しく設定されていることを確認
    expect(screen.getByText('ホーム')).toBeTruthy();
  });

  it('筋トレタブが正しく設定されている', () => {
    render(<TabLayout />);
    expect(screen.getByText('筋トレ')).toBeTruthy();
  });

  it('歩数タブが正しく設定されている', () => {
    render(<TabLayout />);
    expect(screen.getByText('歩数')).toBeTruthy();
  });

  it('履歴タブが正しく設定されている', () => {
    render(<TabLayout />);
    expect(screen.getByText('履歴')).toBeTruthy();
  });

  it('ダークテーマの色が適用されている', () => {
    const { getByTestId } = render(<TabLayout />);
    const tabs = getByTestId('tabs');
    const screenOptions = JSON.parse(tabs.props['data-screen-options']);

    // アクティブタブの色が #22C55E (プライマリグリーン)
    expect(screenOptions.tabBarActiveTintColor).toBe('#22C55E');
  });

  it('タブバーの背景色がダークモード対応している', () => {
    const { getByTestId } = render(<TabLayout />);
    const tabs = getByTestId('tabs');
    const screenOptions = JSON.parse(tabs.props['data-screen-options']);

    // タブバーの背景色が #0A0A0A
    expect(screenOptions.tabBarStyle?.backgroundColor).toBe('#0A0A0A');
  });

  it('非アクティブタブの色が正しく設定されている', () => {
    const { getByTestId } = render(<TabLayout />);
    const tabs = getByTestId('tabs');
    const screenOptions = JSON.parse(tabs.props['data-screen-options']);

    // 非アクティブタブの色が #9CA3AF
    expect(screenOptions.tabBarInactiveTintColor).toBe('#9CA3AF');
  });

  it('ハプティクスフィードバックが有効になっている', () => {
    const { getByTestId } = render(<TabLayout />);
    const tabs = getByTestId('tabs');
    const screenOptions = JSON.parse(tabs.props['data-screen-options']);

    expect(screenOptions.tabBarButton).toBe('HapticTab');
  });

  it('各タブに正しいアイコンが設定されている', () => {
    render(<TabLayout />);

    // 期待されるアイコン名
    const expectedIcons = {
      home: 'house.fill',
      workout: 'dumbbell.fill',
      steps: 'figure.walk',
      history: 'clock.fill',
    };

    // 各アイコンが存在することを確認
    Object.values(expectedIcons).forEach((iconName) => {
      expect(screen.queryByTestId(`icon-${iconName}`)).toBeTruthy();
    });
  });
});
