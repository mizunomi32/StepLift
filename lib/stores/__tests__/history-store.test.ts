import { act, renderHook } from '@testing-library/react-native';
import { getWorkoutsByDateRange } from '@/lib/db/queries/workouts';
import { useHistoryStore } from '../history-store';

// モック
jest.mock('@/lib/db/queries/workouts');

describe('HistoryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // ストアをリセット
    const { result } = renderHook(() => useHistoryStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('初期状態', () => {
    it('初期状態が正しく設定されている', () => {
      const { result } = renderHook(() => useHistoryStore());

      expect(result.current.selectedMonth).toBe('');
      expect(result.current.selectedDate).toBeNull();
      expect(result.current.workouts).toEqual([]);
    });
  });

  describe('setSelectedMonth', () => {
    it('選択月を設定できる', () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.setSelectedMonth('2025-01');
      });

      expect(result.current.selectedMonth).toBe('2025-01');
    });
  });

  describe('setSelectedDate', () => {
    it('選択日を設定できる', () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.setSelectedDate('2025-01-15');
      });

      expect(result.current.selectedDate).toBe('2025-01-15');
    });

    it('選択日をクリアできる', () => {
      const { result } = renderHook(() => useHistoryStore());

      act(() => {
        result.current.setSelectedDate('2025-01-15');
      });

      expect(result.current.selectedDate).toBe('2025-01-15');

      act(() => {
        result.current.setSelectedDate(null);
      });

      expect(result.current.selectedDate).toBeNull();
    });
  });

  describe('loadWorkouts', () => {
    it('指定月のワークアウトを読み込む', async () => {
      const mockWorkouts = [
        {
          id: 'workout1',
          startedAt: '2025-01-15T10:00:00Z',
          finishedAt: '2025-01-15T11:00:00Z',
          notes: null,
          createdAt: '2025-01-15T10:00:00Z',
          sets: [],
        },
        {
          id: 'workout2',
          startedAt: '2025-01-13T14:00:00Z',
          finishedAt: '2025-01-13T15:00:00Z',
          notes: null,
          createdAt: '2025-01-13T14:00:00Z',
          sets: [],
        },
      ];

      (getWorkoutsByDateRange as jest.Mock).mockReturnValue(mockWorkouts);

      const { result } = renderHook(() => useHistoryStore());

      await act(async () => {
        await result.current.loadWorkouts('2025-01');
      });

      expect(getWorkoutsByDateRange).toHaveBeenCalledWith('2025-01-01', '2025-01-31');
      expect(result.current.workouts).toEqual(mockWorkouts);
      expect(result.current.selectedMonth).toBe('2025-01');
    });

    it('エラーが発生した場合は空配列を設定する', async () => {
      (getWorkoutsByDateRange as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const { result } = renderHook(() => useHistoryStore());

      await act(async () => {
        await result.current.loadWorkouts('2025-01');
      });

      expect(result.current.workouts).toEqual([]);
    });
  });
});
