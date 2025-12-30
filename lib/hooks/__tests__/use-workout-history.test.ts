import { renderHook, waitFor } from '@testing-library/react-native';
import { useWorkoutHistory, useWorkoutDetail } from '../use-workout-history';
import { getWorkoutsByDateRange, getWorkoutWithSets } from '@/lib/db/queries/workouts';

// モック
jest.mock('@/lib/db/queries/workouts');

describe('useWorkoutHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('指定月のワークアウト一覧を取得する', async () => {
    const mockWorkouts = [
      {
        id: 'workout1',
        startedAt: '2025-01-15T10:00:00Z',
        finishedAt: '2025-01-15T11:00:00Z',
        notes: null,
        createdAt: '2025-01-15T10:00:00Z',
      },
    ];

    (getWorkoutsByDateRange as jest.Mock).mockReturnValue(mockWorkouts);

    const { result } = renderHook(() => useWorkoutHistory('2025-01'));

    await waitFor(() => {
      expect(result.current.workouts).toEqual(mockWorkouts);
    });

    expect(result.current.isLoading).toBe(false);
    expect(getWorkoutsByDateRange).toHaveBeenCalledWith('2025-01-01', '2025-01-31');
  });

  it('エラーが発生した場合はエラーを設定する', async () => {
    const mockError = new Error('Database error');
    (getWorkoutsByDateRange as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useWorkoutHistory('2025-01'));

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });

    expect(result.current.workouts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });
});

describe('useWorkoutDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ワークアウト詳細を取得する', async () => {
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
            category: 'chest',
            isCustom: false,
            createdAt: '2025-01-01T00:00:00Z',
          },
        },
      ],
    };

    (getWorkoutWithSets as jest.Mock).mockReturnValue(mockWorkout);

    const { result } = renderHook(() => useWorkoutDetail('workout1'));

    await waitFor(() => {
      expect(result.current.workout).toEqual(mockWorkout);
    });

    expect(result.current.isLoading).toBe(false);
    expect(getWorkoutWithSets).toHaveBeenCalledWith('workout1');
  });

  it('ワークアウトが見つからない場合はnullを返す', async () => {
    (getWorkoutWithSets as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useWorkoutDetail('nonexistent'));

    await waitFor(() => {
      expect(result.current.workout).toBeNull();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('エラーが発生した場合はエラーを設定する', async () => {
    const mockError = new Error('Database error');
    (getWorkoutWithSets as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    const { result } = renderHook(() => useWorkoutDetail('workout1'));

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });

    expect(result.current.workout).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
