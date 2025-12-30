import { fireEvent, render } from '@testing-library/react-native';
import { WorkoutHistoryItem } from '../WorkoutHistoryItem';

describe('WorkoutHistoryItem', () => {
  const mockWorkout = {
    id: 'workout1',
    startedAt: '2025-01-15T10:00:00Z',
    finishedAt: '2025-01-15T11:00:00Z',
    notes: null,
    createdAt: '2025-01-15T10:00:00Z',
    sets: [
      {
        id: 'set1',
        workoutId: 'workout1',
        exerciseId: 'exercise1',
        setNumber: 1,
        weightKg: 60,
        reps: 10,
        notes: null,
        createdAt: '2025-01-15T10:00:00Z',
        exercise: {
          id: 'exercise1',
          name: 'ベンチプレス',
          category: 'chest' as const,
          isCustom: false,
          createdAt: '2025-01-01T00:00:00Z',
        },
      },
      {
        id: 'set2',
        workoutId: 'workout1',
        exerciseId: 'exercise2',
        setNumber: 2,
        weightKg: 20,
        reps: 12,
        notes: null,
        createdAt: '2025-01-15T10:15:00Z',
        exercise: {
          id: 'exercise2',
          name: 'ダンベルフライ',
          category: 'chest' as const,
          isCustom: false,
          createdAt: '2025-01-01T00:00:00Z',
        },
      },
    ],
  };

  it('ワークアウト時間が表示される', () => {
    const { getByText } = render(<WorkoutHistoryItem workout={mockWorkout} onPress={jest.fn()} />);

    expect(getByText('60分')).toBeTruthy();
  });

  it('種目数とセット数が表示される', () => {
    const { getByText } = render(<WorkoutHistoryItem workout={mockWorkout} onPress={jest.fn()} />);

    expect(getByText(/2種目/)).toBeTruthy();
    expect(getByText(/2セット/)).toBeTruthy();
  });

  it('主な種目名が表示される', () => {
    const { getByText } = render(<WorkoutHistoryItem workout={mockWorkout} onPress={jest.fn()} />);

    expect(getByText(/ベンチプレス/)).toBeTruthy();
    expect(getByText(/ダンベルフライ/)).toBeTruthy();
  });

  it('タップすると詳細画面に遷移する', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(<WorkoutHistoryItem workout={mockWorkout} onPress={onPress} />);

    fireEvent.press(getByTestId('workout-history-item'));

    expect(onPress).toHaveBeenCalled();
  });
});
