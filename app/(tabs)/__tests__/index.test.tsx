import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';
import DashboardScreen from '../index';

// モックの設定
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock('@/lib/stores/steps-store', () => ({
  useStepsStore: jest.fn(() => ({
    todaySteps: 7234,
    dailyGoal: 10000,
  })),
}));

jest.mock('@/lib/stores/workout-store', () => ({
  useWorkoutStore: jest.fn(() => ({
    startWorkout: jest.fn(),
  })),
}));

describe('DashboardScreen', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it('画面が正しくレンダリングされる', () => {
    render(<DashboardScreen />);
    expect(screen.getByTestId('dashboard-screen')).toBeTruthy();
  });

  it('ヘッダーにアプリ名が表示される', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('StepLift')).toBeTruthy();
  });

  it('設定アイコンが表示される', () => {
    render(<DashboardScreen />);
    expect(screen.getByTestId('settings-button')).toBeTruthy();
  });

  it('設定アイコンをタップすると設定画面に遷移する', () => {
    render(<DashboardScreen />);
    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.press(settingsButton);
    expect(mockPush).toHaveBeenCalledWith('/settings');
  });

  it('今日の歩数カードが表示される', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('今日の歩数')).toBeTruthy();
  });

  it('今日のワークアウトカードが表示される', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('今日のワークアウト')).toBeTruthy();
  });

  it('週間サマリーカードが表示される', () => {
    render(<DashboardScreen />);
    expect(screen.getByText('週間サマリー')).toBeTruthy();
  });

  it('背景色がダークモード対応している', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const container = getByTestId('dashboard-screen');
    expect(container.props.className).toContain('bg-black');
  });

  it('フルスクリーンで表示される', () => {
    const { getByTestId } = render(<DashboardScreen />);
    const container = getByTestId('dashboard-screen');
    expect(container.props.className).toContain('flex-1');
  });
});
