import { useEffect, useState } from 'react';
import { getWorkoutsByDateRange, getWorkoutWithSets } from '@/lib/db/queries/workouts';
import type { Workout, WorkoutWithSets } from '@/types/workout';

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

/**
 * 指定月のワークアウト一覧を取得するフック
 */
export function useWorkoutHistory(month: string) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!month) {
      setWorkouts([]);
      setIsLoading(false);
      return;
    }

    const loadWorkouts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { startDate, endDate } = getMonthRange(month);
        const data = getWorkoutsByDateRange(startDate, endDate);

        setWorkouts(data);
      } catch (err) {
        console.error('[useWorkoutHistory] エラー:', err);
        setError(err as Error);
        setWorkouts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkouts();
  }, [month]);

  return { workouts, isLoading, error };
}

/**
 * ワークアウト詳細を取得するフック
 */
export function useWorkoutDetail(id: string) {
  const [workout, setWorkout] = useState<WorkoutWithSets | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setWorkout(null);
      setIsLoading(false);
      return;
    }

    const loadWorkout = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data = getWorkoutWithSets(id);
        setWorkout(data);
      } catch (err) {
        console.error('[useWorkoutDetail] エラー:', err);
        setError(err as Error);
        setWorkout(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkout();
  }, [id]);

  return { workout, isLoading, error };
}
