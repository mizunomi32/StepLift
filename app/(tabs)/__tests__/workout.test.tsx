import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import WorkoutScreen from '../workout';
import { useWorkoutStore } from '@/lib/stores/workout-store';

// ワークアウトストアをモック
jest.mock('@/lib/stores/workout-store');

describe('WorkoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('非アクティブ状態', () => {
    beforeEach(() => {
      (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
        isWorkoutActive: false,
        activeWorkout: null,
        startWorkout: jest.fn(),
      });
    });

    it('画面が正しくレンダリングされる', () => {
      render(<WorkoutScreen />);
      expect(screen.getByTestId('workout-screen')).toBeTruthy();
    });

    it('背景色がダークモード対応している', () => {
      const { getByTestId } = render(<WorkoutScreen />);
      const container = getByTestId('workout-screen');
      expect(container.props.className).toContain('bg-black');
    });

    it('フルスクリーンで表示される', () => {
      const { getByTestId } = render(<WorkoutScreen />);
      const container = getByTestId('workout-screen');
      expect(container.props.className).toContain('flex-1');
    });

    it('ワークアウト開始ボタンが表示される', () => {
      render(<WorkoutScreen />);
      expect(screen.getByTestId('start-workout-button')).toBeTruthy();
    });

    it('ワークアウト開始ボタンをタップするとstartWorkoutが呼ばれる', () => {
      const startWorkout = jest.fn();
      (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
        isWorkoutActive: false,
        activeWorkout: null,
        startWorkout,
      });

      render(<WorkoutScreen />);
      const button = screen.getByTestId('start-workout-button');
      fireEvent.press(button);

      expect(startWorkout).toHaveBeenCalledTimes(1);
    });
  });

  describe('アクティブ状態', () => {
    const mockActiveWorkout = {
      id: 'test-workout-1',
      startedAt: '2025-01-15T10:00:00.000Z',
      exercises: [
        {
          exercise: {
            id: 'ex-1',
            name: 'ベンチプレス',
            category: 'chest' as const,
            isCustom: false,
            createdAt: '2025-01-01T00:00:00.000Z',
          },
          sets: [
            {
              id: 'set-1',
              exerciseId: 'ex-1',
              setNumber: 1,
              weightKg: 60,
              reps: 10,
              isCompleted: true,
            },
            {
              id: 'set-2',
              exerciseId: 'ex-1',
              setNumber: 2,
              weightKg: 60,
              reps: 10,
              isCompleted: false,
            },
          ],
        },
      ],
    };

    beforeEach(() => {
      (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
        isWorkoutActive: true,
        activeWorkout: mockActiveWorkout,
        startWorkout: jest.fn(),
        endWorkout: jest.fn(),
        addExercise: jest.fn(),
        removeExercise: jest.fn(),
        addSet: jest.fn(),
        updateSet: jest.fn(),
        removeSet: jest.fn(),
        toggleSetComplete: jest.fn(),
      });
    });

    it('タイマーが表示される', () => {
      render(<WorkoutScreen />);
      expect(screen.getByTestId('workout-timer')).toBeTruthy();
    });

    it('種目追加ボタンが表示される', () => {
      render(<WorkoutScreen />);
      expect(screen.getByTestId('add-exercise-button')).toBeTruthy();
    });

    it('種目カードが表示される', () => {
      render(<WorkoutScreen />);
      expect(screen.getByText('ベンチプレス')).toBeTruthy();
      expect(screen.getByTestId('exercise-card-ex-1')).toBeTruthy();
    });

    it('ワークアウト終了ボタンが表示される', () => {
      render(<WorkoutScreen />);
      expect(screen.getByTestId('end-workout-button')).toBeTruthy();
    });

    it('ワークアウト終了ボタンをタップするとendWorkoutが呼ばれる', async () => {
      const endWorkout = jest.fn().mockResolvedValue(undefined);
      (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
        isWorkoutActive: true,
        activeWorkout: mockActiveWorkout,
        endWorkout,
        addExercise: jest.fn(),
        removeExercise: jest.fn(),
        addSet: jest.fn(),
        updateSet: jest.fn(),
        removeSet: jest.fn(),
        toggleSetComplete: jest.fn(),
      });

      render(<WorkoutScreen />);
      const button = screen.getByTestId('end-workout-button');
      fireEvent.press(button);

      await waitFor(() => {
        expect(endWorkout).toHaveBeenCalledTimes(1);
      });
    });

    it('種目が複数ある場合、すべて表示される', () => {
      const multiExerciseWorkout = {
        ...mockActiveWorkout,
        exercises: [
          ...mockActiveWorkout.exercises,
          {
            exercise: {
              id: 'ex-2',
              name: 'ダンベルフライ',
              category: 'chest' as const,
              isCustom: false,
              createdAt: '2025-01-01T00:00:00.000Z',
            },
            sets: [],
          },
        ],
      };

      (useWorkoutStore as unknown as jest.Mock).mockReturnValue({
        isWorkoutActive: true,
        activeWorkout: multiExerciseWorkout,
        endWorkout: jest.fn(),
        addExercise: jest.fn(),
        removeExercise: jest.fn(),
        addSet: jest.fn(),
        updateSet: jest.fn(),
        removeSet: jest.fn(),
        toggleSetComplete: jest.fn(),
      });

      render(<WorkoutScreen />);
      expect(screen.getByText('ベンチプレス')).toBeTruthy();
      expect(screen.getByText('ダンベルフライ')).toBeTruthy();
    });
  });
});
