import { Alert } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { deleteWorkout, updateWorkout } from '@/lib/db/queries/workouts';
import { useWorkoutDetail } from '@/lib/hooks/use-workout-history';
import WorkoutDetailScreen from '../[id]';

// モック
jest.mock('expo-router');
jest.mock('@/lib/hooks/use-workout-history');
jest.mock('@/lib/db/queries/workouts');

// Alertのモック
const mockAlertAlert = jest.spyOn(Alert, 'alert');

describe('WorkoutDetailScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: 'workout1' });
  });

  it('ワークアウト詳細が表示される', async () => {
    const mockWorkout = {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: 'テストメモ',
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
      ],
    };

    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<WorkoutDetailScreen />);

    await waitFor(() => {
      expect(getByText('ベンチプレス')).toBeTruthy();
      // コンポーネントは "60kg × 10回" と表示
      expect(getByText(/60kg.*10回/)).toBeTruthy();
      expect(getByText('テストメモ')).toBeTruthy();
    });
  });

  it('ローディング中はインジケーターが表示される', () => {
    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: null,
      isLoading: true,
      error: null,
    });

    const { getByTestId } = render(<WorkoutDetailScreen />);

    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('削除ボタンで確認ダイアログが表示される', async () => {
    const mockWorkout = {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: null,
      createdAt: '2025-01-15T10:00:00Z',
      sets: [],
    };

    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      isLoading: false,
      error: null,
    });

    const { getByTestId } = render(<WorkoutDetailScreen />);

    fireEvent.press(getByTestId('delete-workout-button'));

    await waitFor(() => {
      // Alert.alertが呼ばれたことを確認
      expect(mockAlertAlert).toHaveBeenCalledWith(
        'ワークアウトを削除',
        'このワークアウトを削除しますか?',
        expect.any(Array)
      );
    });
  });

  it('削除確認後、ワークアウトが削除される', async () => {
    const mockWorkout = {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: null,
      createdAt: '2025-01-15T10:00:00Z',
      sets: [],
    };

    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      isLoading: false,
      error: null,
    });
    (deleteWorkout as jest.Mock).mockReturnValue(true);

    // Alertの「削除」ボタンを自動押下するようモック
    mockAlertAlert.mockImplementation((_title, _message, buttons) => {
      const deleteButton = buttons?.find((b: any) => b.text === '削除');
      if (deleteButton?.onPress) {
        deleteButton.onPress();
      }
    });

    const { getByTestId } = render(<WorkoutDetailScreen />);

    fireEvent.press(getByTestId('delete-workout-button'));

    await waitFor(() => {
      expect(deleteWorkout).toHaveBeenCalledWith('workout1');
      expect(router.back).toHaveBeenCalled();
    });
  });

  it('開始時刻の編集ボタンが表示される', () => {
    const mockWorkout = {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: null,
      createdAt: '2025-01-15T10:00:00Z',
      sets: [],
    };

    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      isLoading: false,
      error: null,
    });

    const { getByTestId } = render(<WorkoutDetailScreen />);

    expect(getByTestId('edit-start-time-button')).toBeTruthy();
  });

  it('終了時刻の編集ボタンが表示される', () => {
    const mockWorkout = {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: null,
      createdAt: '2025-01-15T10:00:00Z',
      sets: [],
    };

    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      isLoading: false,
      error: null,
    });

    const { getByTestId } = render(<WorkoutDetailScreen />);

    expect(getByTestId('edit-end-time-button')).toBeTruthy();
  });

  it('開始時刻編集ボタンを押すとDateTimePickerが表示される', async () => {
    const mockWorkout = {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: null,
      createdAt: '2025-01-15T10:00:00Z',
      sets: [],
    };

    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      isLoading: false,
      error: null,
    });

    const { getByTestId } = render(<WorkoutDetailScreen />);

    fireEvent.press(getByTestId('edit-start-time-button'));

    await waitFor(() => {
      expect(getByTestId('start-time-picker')).toBeTruthy();
    });
  });

  it('終了時刻編集ボタンを押すとDateTimePickerが表示される', async () => {
    const mockWorkout = {
      id: 'workout1',
      startedAt: '2025-01-15T10:00:00Z',
      finishedAt: '2025-01-15T11:00:00Z',
      notes: null,
      createdAt: '2025-01-15T10:00:00Z',
      sets: [],
    };

    (useWorkoutDetail as jest.Mock).mockReturnValue({
      workout: mockWorkout,
      isLoading: false,
      error: null,
    });

    const { getByTestId } = render(<WorkoutDetailScreen />);

    fireEvent.press(getByTestId('edit-end-time-button'));

    await waitFor(() => {
      expect(getByTestId('end-time-picker')).toBeTruthy();
    });
  });

  // 注意: DateTimePickerのイベントシミュレーションはモックの制限により困難なため、
  // ピッカーの表示テストのみ行い、updateWorkoutの呼び出しテストはスキップ
});
