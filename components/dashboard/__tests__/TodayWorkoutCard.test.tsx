import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TodayWorkoutCard } from '../TodayWorkoutCard';
import type { WorkoutWithSets } from '@/types/workout';

describe('TodayWorkoutCard', () => {
  const mockOnStartWorkout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ワークアウトがない場合、空の状態が表示される', () => {
    render(<TodayWorkoutCard workout={null} onStartWorkout={mockOnStartWorkout} />);

    expect(screen.getByText('今日のワークアウト')).toBeTruthy();
    expect(screen.getByText('まだ記録がありません')).toBeTruthy();
    expect(screen.getByText('ワークアウトを開始')).toBeTruthy();
  });

  it('ワークアウト開始ボタンをタップできる', () => {
    render(<TodayWorkoutCard workout={null} onStartWorkout={mockOnStartWorkout} />);

    const startButton = screen.getByText('ワークアウトを開始');
    fireEvent.press(startButton);

    expect(mockOnStartWorkout).toHaveBeenCalledTimes(1);
  });

  it('ワークアウトがある場合、詳細が表示される', () => {
    const workout: WorkoutWithSets = {
      id: '1',
      startedAt: '2025-01-01T10:00:00Z',
      finishedAt: '2025-01-01T10:45:00Z',
      notes: null,
      createdAt: '2025-01-01T10:00:00Z',
      sets: [
        {
          id: '1',
          workoutId: '1',
          exerciseId: 'bench_press',
          setNumber: 1,
          weightKg: 60,
          reps: 10,
          notes: null,
          createdAt: '2025-01-01T10:00:00Z',
          exercise: {
            id: 'bench_press',
            name: 'ベンチプレス',
            category: 'chest',
            isCustom: false,
            createdAt: '2025-01-01T10:00:00Z',
          },
        },
        {
          id: '2',
          workoutId: '1',
          exerciseId: 'bench_press',
          setNumber: 2,
          weightKg: 60,
          reps: 10,
          notes: null,
          createdAt: '2025-01-01T10:00:00Z',
          exercise: {
            id: 'bench_press',
            name: 'ベンチプレス',
            category: 'chest',
            isCustom: false,
            createdAt: '2025-01-01T10:00:00Z',
          },
        },
        {
          id: '3',
          workoutId: '1',
          exerciseId: 'dumbbell_fly',
          setNumber: 1,
          weightKg: 20,
          reps: 12,
          notes: null,
          createdAt: '2025-01-01T10:00:00Z',
          exercise: {
            id: 'dumbbell_fly',
            name: 'ダンベルフライ',
            category: 'chest',
            isCustom: false,
            createdAt: '2025-01-01T10:00:00Z',
          },
        },
      ],
    };

    render(<TodayWorkoutCard workout={workout} onStartWorkout={mockOnStartWorkout} />);

    expect(screen.getByText('今日のワークアウト')).toBeTruthy();
    expect(screen.getByText(/45分/)).toBeTruthy();
    expect(screen.getByText(/2種目/)).toBeTruthy();
    expect(screen.getByText(/3セット/)).toBeTruthy();
    expect(screen.getByText(/ベンチプレス/)).toBeTruthy();
  });

  it('ワークアウトの時間が正しく計算される', () => {
    const workout: WorkoutWithSets = {
      id: '1',
      startedAt: '2025-01-01T10:00:00Z',
      finishedAt: '2025-01-01T11:30:00Z', // 90分
      notes: null,
      createdAt: '2025-01-01T10:00:00Z',
      sets: [],
    };

    render(<TodayWorkoutCard workout={workout} onStartWorkout={mockOnStartWorkout} />);

    expect(screen.getByText(/90分/)).toBeTruthy();
  });

  it('複数の種目がある場合、主な種目のみ表示される', () => {
    const workout: WorkoutWithSets = {
      id: '1',
      startedAt: '2025-01-01T10:00:00Z',
      finishedAt: '2025-01-01T10:45:00Z',
      notes: null,
      createdAt: '2025-01-01T10:00:00Z',
      sets: [
        {
          id: '1',
          workoutId: '1',
          exerciseId: 'bench_press',
          setNumber: 1,
          weightKg: 60,
          reps: 10,
          notes: null,
          createdAt: '2025-01-01T10:00:00Z',
          exercise: {
            id: 'bench_press',
            name: 'ベンチプレス',
            category: 'chest',
            isCustom: false,
            createdAt: '2025-01-01T10:00:00Z',
          },
        },
        {
          id: '2',
          workoutId: '1',
          exerciseId: 'dumbbell_fly',
          setNumber: 1,
          weightKg: 20,
          reps: 12,
          notes: null,
          createdAt: '2025-01-01T10:00:00Z',
          exercise: {
            id: 'dumbbell_fly',
            name: 'ダンベルフライ',
            category: 'chest',
            isCustom: false,
            createdAt: '2025-01-01T10:00:00Z',
          },
        },
        {
          id: '3',
          workoutId: '1',
          exerciseId: 'incline_bench_press',
          setNumber: 1,
          weightKg: 40,
          reps: 10,
          notes: null,
          createdAt: '2025-01-01T10:00:00Z',
          exercise: {
            id: 'incline_bench_press',
            name: 'インクラインベンチプレス',
            category: 'chest',
            isCustom: false,
            createdAt: '2025-01-01T10:00:00Z',
          },
        },
      ],
    };

    render(<TodayWorkoutCard workout={workout} onStartWorkout={mockOnStartWorkout} />);

    expect(screen.getByText(/ベンチプレス/)).toBeTruthy();
    expect(screen.getByText(/他2種目/)).toBeTruthy();
  });
});
