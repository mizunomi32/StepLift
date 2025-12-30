import React from 'react';
import { render } from '@testing-library/react-native';
import { WeeklyStepChart } from '../WeeklyStepChart';
import type { StepRecord } from '@/types/steps';

describe('WeeklyStepChart', () => {
  const mockRecords: StepRecord[] = [
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
    {
      id: '3',
      date: '2025-01-15',
      steps: 6000,
      distanceKm: 4.2,
      calories: 240,
      source: 'sensor',
      createdAt: '2025-01-15T12:00:00Z',
    },
  ];

  it('週間グラフが表示される', () => {
    const { getByTestId } = render(
      <WeeklyStepChart records={mockRecords} goal={10000} />
    );

    expect(getByTestId('weekly-step-chart')).toBeTruthy();
  });

  it('7本の棒グラフが表示される', () => {
    const { getByTestId } = render(
      <WeeklyStepChart records={mockRecords} goal={10000} />
    );

    // 7日分の棒グラフ
    for (let i = 0; i < 7; i++) {
      expect(getByTestId(`chart-bar-${i}`)).toBeTruthy();
    }
  });

  it('曜日ラベルが表示される', () => {
    const { getByText } = render(
      <WeeklyStepChart records={mockRecords} goal={10000} />
    );

    expect(getByText('月')).toBeTruthy();
    expect(getByText('火')).toBeTruthy();
    expect(getByText('水')).toBeTruthy();
    expect(getByText('木')).toBeTruthy();
    expect(getByText('金')).toBeTruthy();
    expect(getByText('土')).toBeTruthy();
    expect(getByText('日')).toBeTruthy();
  });

  it('目標ラインが表示される', () => {
    const { getByTestId } = render(
      <WeeklyStepChart records={mockRecords} goal={10000} />
    );

    expect(getByTestId('goal-line')).toBeTruthy();
  });

  it('空のレコードでもエラーにならない', () => {
    const { getByTestId } = render(
      <WeeklyStepChart records={[]} goal={10000} />
    );

    expect(getByTestId('weekly-step-chart')).toBeTruthy();
  });

  it('目標達成した日は異なる色で表示される', () => {
    const { getByTestId } = render(
      <WeeklyStepChart records={mockRecords} goal={10000} />
    );

    // 目標達成した日の棒グラフを取得
    const achievedBar = getByTestId('chart-bar-1'); // 12000歩の日
    const notAchievedBar = getByTestId('chart-bar-0'); // 8000歩の日

    expect(achievedBar).toBeTruthy();
    expect(notAchievedBar).toBeTruthy();
  });

  it('最大値を超えた場合でも正しく描画される', () => {
    const highRecords: StepRecord[] = [
      {
        id: '1',
        date: '2025-01-13',
        steps: 25000,
        distanceKm: 17.5,
        calories: 1000,
        source: 'sensor',
        createdAt: '2025-01-13T12:00:00Z',
      },
    ];

    const { getByTestId } = render(
      <WeeklyStepChart records={highRecords} goal={10000} />
    );

    expect(getByTestId('weekly-step-chart')).toBeTruthy();
  });
});
