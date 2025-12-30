import { create } from 'zustand';
import type { WorkoutWithSets } from '@/types/workout';
import { getWorkoutsWithSetsByDateRange } from '@/lib/db/queries/workouts';

interface HistoryState {
  selectedMonth: string;
  selectedDate: string | null;
  workouts: WorkoutWithSets[];

  setSelectedMonth: (month: string) => void;
  setSelectedDate: (date: string | null) => void;
  loadWorkouts: (month: string) => Promise<void>;
  reset: () => void;
}

/**
 * 月の最初と最後の日付を取得
 */
function getMonthRange(month: string): { startDate: string; endDate: string } {
  const [year, monthNum] = month.split('-').map(Number);
  const firstDay = new Date(year, monthNum - 1, 1);
  const lastDay = new Date(year, monthNum, 0);

  const startDate = firstDay.toISOString().split('T')[0];
  const endDate = lastDay.toISOString().split('T')[0];

  return { startDate, endDate };
}

export const useHistoryStore = create<HistoryState>((set) => ({
  selectedMonth: '',
  selectedDate: null,
  workouts: [],

  setSelectedMonth: (month: string) => {
    set({ selectedMonth: month });
  },

  setSelectedDate: (date: string | null) => {
    set({ selectedDate: date });
  },

  loadWorkouts: async (month: string) => {
    try {
      const { startDate, endDate } = getMonthRange(month);
      const workouts = getWorkoutsWithSetsByDateRange(startDate, endDate);

      set({
        selectedMonth: month,
        workouts,
      });

      console.log('[HistoryStore] ワークアウトを読み込みました:', workouts.length);
    } catch (error) {
      console.error('[HistoryStore] ワークアウトの読み込みエラー:', error);
      set({ workouts: [] });
    }
  },

  reset: () => {
    set({
      selectedMonth: '',
      selectedDate: null,
      workouts: [],
    });
  },
}));
