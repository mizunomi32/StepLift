import { render } from '@testing-library/react-native';
import SettingsScreen from '../index';

// ストアをモック
jest.mock('@/lib/stores/settings-store', () => ({
  useSettingsStore: jest.fn(() => ({
    dailyStepGoal: 10000,
    theme: 'system',
    weightUnit: 'kg',
    setDailyStepGoal: jest.fn(),
    setTheme: jest.fn(),
    setWeightUnit: jest.fn(),
    loadSettings: jest.fn(),
  })),
}));

describe('SettingsScreen', () => {
  it('正しくレンダリングされる', () => {
    const { getByTestId } = render(<SettingsScreen />);

    // ヘッダーの「設定」はStack.Screenで表示されるため、セクションで確認
    expect(getByTestId('settings-section-目標')).toBeTruthy();
  });

  it('目標セクションが表示される', () => {
    const { getByTestId } = render(<SettingsScreen />);

    expect(getByTestId('settings-section-目標')).toBeTruthy();
  });

  it('表示セクションが表示される', () => {
    const { getByTestId } = render(<SettingsScreen />);

    expect(getByTestId('settings-section-表示')).toBeTruthy();
  });

  it('データセクションが表示される', () => {
    const { getByTestId } = render(<SettingsScreen />);

    expect(getByTestId('settings-section-データ')).toBeTruthy();
  });

  it('ヘルス連携セクションが表示される', () => {
    const { getByTestId } = render(<SettingsScreen />);

    expect(getByTestId('settings-section-ヘルス連携')).toBeTruthy();
  });

  it('アプリについてセクションが表示される', () => {
    const { getByTestId } = render(<SettingsScreen />);

    expect(getByTestId('settings-section-アプリについて')).toBeTruthy();
  });

  it('歩数目標が表示される', () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText('1日の歩数目標')).toBeTruthy();
    expect(getByText('10,000')).toBeTruthy();
  });

  it('テーマ設定が表示される', () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText('テーマ')).toBeTruthy();
    expect(getByText('システム')).toBeTruthy();
  });

  it('重量単位設定が表示される', () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText('重量単位')).toBeTruthy();
    expect(getByText('kg')).toBeTruthy();
  });

  it('データエクスポートオプションが表示される', () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText('エクスポート')).toBeTruthy();
  });

  it('データ削除オプションが表示される', () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText('データを削除')).toBeTruthy();
  });

  it('バージョン情報が表示される', () => {
    const { getByText } = render(<SettingsScreen />);

    expect(getByText('バージョン')).toBeTruthy();
  });
});
