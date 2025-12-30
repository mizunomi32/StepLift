import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WeeklySummaryCard } from '../WeeklySummaryCard';

describe('WeeklySummaryCard', () => {
  it('週間サマリーが正しく表示される', () => {
    render(<WeeklySummaryCard workoutCount={3} averageSteps={8432} streakDays={5} />);

    expect(screen.getByText('週間サマリー')).toBeTruthy();
    expect(screen.getByText(/3回/)).toBeTruthy();
    expect(screen.getByText(/8,432歩/)).toBeTruthy();
    expect(screen.getByText(/5日/)).toBeTruthy();
  });

  it('ワークアウト回数が0の場合も表示される', () => {
    render(<WeeklySummaryCard workoutCount={0} averageSteps={5000} streakDays={0} />);

    expect(screen.getByText(/0回/)).toBeTruthy();
  });

  it('平均歩数がカンマ区切りで表示される', () => {
    render(<WeeklySummaryCard workoutCount={2} averageSteps={12345} streakDays={3} />);

    expect(screen.getByText(/12,345歩/)).toBeTruthy();
  });

  it('アイコンが表示される', () => {
    const { getByTestId } = render(
      <WeeklySummaryCard workoutCount={3} averageSteps={8432} streakDays={5} />
    );

    expect(getByTestId('icon-workout')).toBeTruthy();
    expect(getByTestId('icon-steps')).toBeTruthy();
    expect(getByTestId('icon-streak')).toBeTruthy();
  });
});
