import { render, screen } from '@testing-library/react-native';
import { useStepsStore } from '@/lib/stores/steps-store';
import StepsScreen from '../steps';

// Zustandストアのモック
jest.mock('@/lib/stores/steps-store');

describe('StepsScreen', () => {
  const mockUseStepsStore = useStepsStore as jest.MockedFunction<typeof useStepsStore>;

  beforeEach(() => {
    mockUseStepsStore.mockReturnValue({
      todaySteps: 12456,
      dailyGoal: 10000,
      weeklyRecords: [
        {
          id: '1',
          date: '2025-01-13',
          steps: 8000,
          distanceKm: 5.6,
          calories: 320,
          source: 'sensor',
          createdAt: '2025-01-13T12:00:00Z',
        },
        {
          id: '2',
          date: '2025-01-14',
          steps: 12000,
          distanceKm: 8.4,
          calories: 480,
          source: 'sensor',
          createdAt: '2025-01-14T12:00:00Z',
        },
      ],
      isTracking: true,
      startTracking: jest.fn(),
      stopTracking: jest.fn(),
      updateTodaySteps: jest.fn(),
      setDailyGoal: jest.fn(),
      loadWeeklyRecords: jest.fn(),
      syncWithHealthAPI: jest.fn(),
    });
  });

  it('画面が正しくレンダリングされる', () => {
    render(<StepsScreen />);
    expect(screen.getByTestId('steps-screen')).toBeTruthy();
  });

  it('背景色がダークモード対応している', () => {
    const { getByTestId } = render(<StepsScreen />);
    const container = getByTestId('steps-screen');
    expect(container.props.className).toContain('bg-black');
  });

  it('フルスクリーンで表示される', () => {
    const { getByTestId } = render(<StepsScreen />);
    const container = getByTestId('steps-screen');
    expect(container.props.className).toContain('flex-1');
  });

  it('円形プログレスリングが表示される', () => {
    const { getByTestId } = render(<StepsScreen />);
    expect(getByTestId('step-goal-ring')).toBeTruthy();
  });

  it('今日の歩数が表示される', () => {
    const { getByText } = render(<StepsScreen />);
    expect(getByText('12,456')).toBeTruthy();
  });

  it('目標歩数が表示される', () => {
    const { getByText } = render(<StepsScreen />);
    expect(getByText(/10,000/)).toBeTruthy();
  });

  it('統計カードが表示される', () => {
    const { getByTestId } = render(<StepsScreen />);
    expect(getByTestId('step-stats')).toBeTruthy();
  });

  it('週間グラフが表示される', () => {
    const { getByTestId } = render(<StepsScreen />);
    expect(getByTestId('weekly-step-chart')).toBeTruthy();
  });

  it('目標達成時に達成メッセージが表示される', () => {
    const { getByText } = render(<StepsScreen />);
    expect(getByText(/達成/)).toBeTruthy();
  });

  it('目標設定へのリンクが表示される', () => {
    const { getByTestId } = render(<StepsScreen />);
    expect(getByTestId('goal-setting-link')).toBeTruthy();
  });

  it('目標未達成の場合、達成メッセージが表示されない', () => {
    mockUseStepsStore.mockReturnValue({
      todaySteps: 5000,
      dailyGoal: 10000,
      weeklyRecords: [],
      isTracking: true,
      startTracking: jest.fn(),
      stopTracking: jest.fn(),
      updateTodaySteps: jest.fn(),
      setDailyGoal: jest.fn(),
      loadWeeklyRecords: jest.fn(),
      syncWithHealthAPI: jest.fn(),
    });

    const { queryByText } = render(<StepsScreen />);
    expect(queryByText(/達成/)).toBeNull();
  });
});
