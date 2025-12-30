import { create } from 'zustand';
import { getWorkoutsWithSetsByDateRange } from '@/lib/db/queries/workouts';
import type { WorkoutWithSets } from '@/types/workout';

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
 * 日付をローカルタイムゾーンのYYYY-MM-DD形式に変換
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 月の最初と最後の日付を取得
 */
function getMonthRange(month: string): { startDate: string; endDate: string } {
  const [year, monthNum] = month.split('-').map(Number);
  const firstDay = new Date(year, monthNum - 1, 1);
  const lastDay = new Date(year, monthNum, 0);

  const startDate = formatLocalDate(firstDay);
  const endDate = formatLocalDate(lastDay);

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
