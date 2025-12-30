import type { StepRecord } from '@/types/steps';
import type { Workout } from '@/types/workout';
import { calculateStepStreak, calculateWorkoutStreak } from '../streak';

// ローカルタイムゾーンでYYYY-MM-DD形式の日付文字列を生成
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// テスト用のワークアウトを作成（日付はローカルタイムゾーン基準）
function createWorkout(date: Date, id: string): Workout {
  return {
    id,
    startedAt: date.toISOString(),
    finishedAt: date.toISOString(),
    notes: null,
    createdAt: date.toISOString(),
  };
}

// テスト用のステップレコードを作成
function createStepRecord(date: Date, steps: number, id: string): StepRecord {
  return {
    id,
    date: formatLocalDate(date),
    steps,
    distanceKm: steps * 0.0007,
    calories: steps * 0.04,
    source: 'sensor' as const,
    createdAt: date.toISOString(),
  };
}

describe('streak.ts', () => {
  describe('calculateWorkoutStreak', () => {
    it('連続トレーニング日数が0日の場合', () => {
      const workouts: Workout[] = [];
      expect(calculateWorkoutStreak(workouts)).toBe(0);
    });

    it('連続トレーニング日数が1日の場合', () => {
      const today = new Date();
      const workouts: Workout[] = [createWorkout(today, '1')];
      expect(calculateWorkoutStreak(workouts)).toBe(1);
    });

    it('連続トレーニング日数が3日の場合', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const workouts: Workout[] = [
        createWorkout(today, '1'),
        createWorkout(yesterday, '2'),
        createWorkout(twoDaysAgo, '3'),
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(3);
    });

    it('1日空いた場合、ストリークが途切れる', () => {
      const today = new Date();
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const workouts: Workout[] = [
        createWorkout(today, '1'),
        createWorkout(threeDaysAgo, '2'),
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(1);
    });

    it('同じ日に複数のワークアウトがあっても1日とカウント', () => {
      const today = new Date();
      const workouts: Workout[] = [
        createWorkout(today, '1'),
        createWorkout(today, '2'),
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(1);
    });

    it('今日のワークアウトがない場合、昨日からのストリークをカウント', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const workouts: Workout[] = [
        createWorkout(yesterday, '1'),
        createWorkout(twoDaysAgo, '2'),
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(2);
    });
  });

  describe('calculateStepStreak', () => {
    it('連続歩数目標達成日数が0日の場合', () => {
      const records: StepRecord[] = [];
      expect(calculateStepStreak(records, 10000)).toBe(0);
    });

    it('連続歩数目標達成日数が1日の場合', () => {
      const today = new Date();
      const records: StepRecord[] = [createStepRecord(today, 12000, '1')];
      expect(calculateStepStreak(records, 10000)).toBe(1);
    });

    it('連続歩数目標達成日数が3日の場合', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const records: StepRecord[] = [
        createStepRecord(today, 12000, '1'),
        createStepRecord(yesterday, 11000, '2'),
        createStepRecord(twoDaysAgo, 10500, '3'),
      ];
      expect(calculateStepStreak(records, 10000)).toBe(3);
    });

    it('目標未達成の日がある場合、ストリークが途切れる', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const records: StepRecord[] = [
        createStepRecord(today, 12000, '1'),
        createStepRecord(yesterday, 8000, '2'), // 目標未達成
        createStepRecord(twoDaysAgo, 11000, '3'),
      ];
      expect(calculateStepStreak(records, 10000)).toBe(1);
    });

    it('今日の記録がない場合、昨日からのストリークをカウント', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const records: StepRecord[] = [
        createStepRecord(yesterday, 12000, '1'),
        createStepRecord(twoDaysAgo, 11000, '2'),
      ];
      expect(calculateStepStreak(records, 10000)).toBe(2);
    });

    it('ちょうど目標値の場合も達成とみなす', () => {
      const today = new Date();
      const records: StepRecord[] = [createStepRecord(today, 10000, '1')];
      expect(calculateStepStreak(records, 10000)).toBe(1);
    });
  });
});
