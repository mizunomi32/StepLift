import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TodayStepsCard } from '../TodayStepsCard';

describe('TodayStepsCard', () => {
  it('歩数と目標値が表示される', () => {
    render(<TodayStepsCard steps={7234} goal={10000} streakDays={5} />);

    expect(screen.getByText(/7,234/)).toBeTruthy();
    expect(screen.getByText(/10,000/)).toBeTruthy();
  });

  it('達成率が表示される', () => {
    render(<TodayStepsCard steps={7234} goal={10000} streakDays={5} />);

    expect(screen.getByText('72%')).toBeTruthy();
  });

  it('ストリーク日数が表示される', () => {
    render(<TodayStepsCard steps={7234} goal={10000} streakDays={5} />);

    expect(screen.getByText(/5日連続達成中/)).toBeTruthy();
  });

  it('目標達成時は100%と表示される', () => {
    render(<TodayStepsCard steps={12000} goal={10000} streakDays={3} />);

    expect(screen.getByText('120%')).toBeTruthy();
  });

  it('ストリークが0日の場合は表示されない', () => {
    render(<TodayStepsCard steps={5000} goal={10000} streakDays={0} />);

    expect(screen.queryByText(/連続達成中/)).toBeNull();
  });

  it('歩数が0の場合も正しく表示される', () => {
    render(<TodayStepsCard steps={0} goal={10000} streakDays={0} />);

    expect(screen.getByText(/0/)).toBeTruthy();
    expect(screen.getByText('0%')).toBeTruthy();
  });

  it('カンマ区切りで表示される', () => {
    render(<TodayStepsCard steps={12345} goal={10000} streakDays={0} />);

    expect(screen.getByText(/12,345/)).toBeTruthy();
  });
});
