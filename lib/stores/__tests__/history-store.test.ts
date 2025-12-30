import { getWorkoutsWithSetsByDateRange } from '@/lib/db/queries/workouts';
import { useHistoryStore } from '../history-store';

// モック
jest.mock('@/lib/db/queries/workouts');

describe('HistoryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // ストアをリセット
    useHistoryStore.getState().reset();
  });

  describe('初期状態', () => {
    it('初期状態が正しく設定されている', () => {
      const state = useHistoryStore.getState();

      expect(state.selectedMonth).toBe('');
      expect(state.selectedDate).toBeNull();
      expect(state.workouts).toEqual([]);
    });
  });

  describe('setSelectedMonth', () => {
    it('選択月を設定できる', () => {
      const { setSelectedMonth } = useHistoryStore.getState();

      setSelectedMonth('2025-01');

      expect(useHistoryStore.getState().selectedMonth).toBe('2025-01');
    });
  });

  describe('setSelectedDate', () => {
    it('選択日を設定できる', () => {
      const { setSelectedDate } = useHistoryStore.getState();

      setSelectedDate('2025-01-15');

      expect(useHistoryStore.getState().selectedDate).toBe('2025-01-15');
    });

    it('選択日をクリアできる', () => {
      const { setSelectedDate } = useHistoryStore.getState();

      setSelectedDate('2025-01-15');
      expect(useHistoryStore.getState().selectedDate).toBe('2025-01-15');

      setSelectedDate(null);
      expect(useHistoryStore.getState().selectedDate).toBeNull();
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

      (getWorkoutsWithSetsByDateRange as jest.Mock).mockReturnValue(mockWorkouts);

      await useHistoryStore.getState().loadWorkouts('2025-01');

      expect(getWorkoutsWithSetsByDateRange).toHaveBeenCalledWith('2025-01-01', '2025-01-31');
      expect(useHistoryStore.getState().workouts).toEqual(mockWorkouts);
      expect(useHistoryStore.getState().selectedMonth).toBe('2025-01');
    });

    it('エラーが発生した場合は空配列を設定する', async () => {
      (getWorkoutsWithSetsByDateRange as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      await useHistoryStore.getState().loadWorkouts('2025-01');

      expect(useHistoryStore.getState().workouts).toEqual([]);
    });
  });
});
