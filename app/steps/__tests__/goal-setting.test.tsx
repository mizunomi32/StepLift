import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GoalSettingScreen from '../goal-setting';
import { useStepsStore } from '@/lib/stores/steps-store';
import { router } from 'expo-router';

// モック
jest.mock('@/lib/stores/steps-store');
jest.mock('expo-router', () => ({
  router: {
    back: jest.fn(),
  },
}));

describe('GoalSettingScreen', () => {
  const mockSetDailyGoal = jest.fn();
  const mockUseStepsStore = useStepsStore as jest.MockedFunction<typeof useStepsStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseStepsStore.mockReturnValue({
      dailyGoal: 10000,
      todaySteps: 0,
      weeklyRecords: [],
      isTracking: false,
      startTracking: jest.fn(),
      stopTracking: jest.fn(),
      updateTodaySteps: jest.fn(),
      setDailyGoal: mockSetDailyGoal,
      loadWeeklyRecords: jest.fn(),
      syncWithHealthAPI: jest.fn(),
    });
  });

  it('画面が正しくレンダリングされる', () => {
    const { getByTestId } = render(<GoalSettingScreen />);
    expect(getByTestId('goal-setting-screen')).toBeTruthy();
  });

  it('現在の目標が表示される', () => {
    const { getByText } = render(<GoalSettingScreen />);
    expect(getByText(/10,000/)).toBeTruthy();
  });

  it('プリセットボタンが4つ表示される', () => {
    const { getByTestId } = render(<GoalSettingScreen />);
    expect(getByTestId('preset-5000')).toBeTruthy();
    expect(getByTestId('preset-8000')).toBeTruthy();
    expect(getByTestId('preset-10000')).toBeTruthy();
    expect(getByTestId('preset-15000')).toBeTruthy();
  });

  it('プリセットボタンをタップすると目標値が変更される', async () => {
    const { getByTestId, getByText } = render(<GoalSettingScreen />);

    const preset8000 = getByTestId('preset-8000');
    fireEvent.press(preset8000);

    expect(getByText(/8,000/)).toBeTruthy();
  });

  it('カスタム入力フィールドが表示される', () => {
    const { getByTestId } = render(<GoalSettingScreen />);
    expect(getByTestId('custom-goal-input')).toBeTruthy();
  });

  it('カスタム入力に数値を入力できる', () => {
    const { getByTestId } = render(<GoalSettingScreen />);
    const input = getByTestId('custom-goal-input');

    fireEvent.changeText(input, '12000');
    expect(input.props.value).toBe('12000');
  });

  it('保存ボタンが表示される', () => {
    const { getByTestId } = render(<GoalSettingScreen />);
    expect(getByTestId('save-button')).toBeTruthy();
  });

  it('保存ボタンをタップすると目標が保存される', async () => {
    const { getByTestId } = render(<GoalSettingScreen />);

    // プリセットを選択
    const preset8000 = getByTestId('preset-8000');
    fireEvent.press(preset8000);

    // 保存ボタンをタップ
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockSetDailyGoal).toHaveBeenCalledWith(8000);
    });
  });

  it('保存後に画面が閉じる', async () => {
    const { getByTestId } = render(<GoalSettingScreen />);

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('無効な値では保存できない', async () => {
    const { getByTestId } = render(<GoalSettingScreen />);

    // 0を入力
    const input = getByTestId('custom-goal-input');
    fireEvent.changeText(input, '0');

    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    await waitFor(() => {
      expect(mockSetDailyGoal).not.toHaveBeenCalled();
    });
  });

  it('ステッパーボタンで増減できる', () => {
    const { getByTestId } = render(<GoalSettingScreen />);

    const incrementButton = getByTestId('increment-button');
    const decrementButton = getByTestId('decrement-button');

    expect(incrementButton).toBeTruthy();
    expect(decrementButton).toBeTruthy();
  });

  it('ステッパーで目標を増やせる', () => {
    const { getByTestId, getByText } = render(<GoalSettingScreen />);

    const incrementButton = getByTestId('increment-button');
    fireEvent.press(incrementButton);

    // 10000 + 500 = 10500
    expect(getByText(/10,500/)).toBeTruthy();
  });

  it('ステッパーで目標を減らせる', () => {
    const { getByTestId, getByText } = render(<GoalSettingScreen />);

    const decrementButton = getByTestId('decrement-button');
    fireEvent.press(decrementButton);

    // 10000 - 500 = 9500
    expect(getByText(/9,500/)).toBeTruthy();
  });

  it('目標は1000未満にならない', () => {
    mockUseStepsStore.mockReturnValue({
      dailyGoal: 1000,
      todaySteps: 0,
      weeklyRecords: [],
      isTracking: false,
      startTracking: jest.fn(),
      stopTracking: jest.fn(),
      updateTodaySteps: jest.fn(),
      setDailyGoal: mockSetDailyGoal,
      loadWeeklyRecords: jest.fn(),
      syncWithHealthAPI: jest.fn(),
    });

    const { getByTestId, getByText } = render(<GoalSettingScreen />);

    const decrementButton = getByTestId('decrement-button');
    fireEvent.press(decrementButton);

    // 1000のまま
    expect(getByText(/1,000/)).toBeTruthy();
  });
});
