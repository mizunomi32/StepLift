import { calculateWorkoutStreak, calculateStepStreak } from '../streak';
import type { Workout } from '@/types/workout';
import type { StepRecord } from '@/types/steps';

describe('streak.ts', () => {
  describe('calculateWorkoutStreak', () => {
    it('連続トレーニング日数が0日の場合', () => {
      const workouts: Workout[] = [];
      expect(calculateWorkoutStreak(workouts)).toBe(0);
    });

    it('連続トレーニング日数が1日の場合', () => {
      const today = new Date();
      const workouts: Workout[] = [
        {
          id: '1',
          startedAt: today.toISOString(),
          finishedAt: today.toISOString(),
          notes: null,
          createdAt: today.toISOString(),
        },
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(1);
    });

    it('連続トレーニング日数が3日の場合', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const workouts: Workout[] = [
        {
          id: '1',
          startedAt: today.toISOString(),
          finishedAt: today.toISOString(),
          notes: null,
          createdAt: today.toISOString(),
        },
        {
          id: '2',
          startedAt: yesterday.toISOString(),
          finishedAt: yesterday.toISOString(),
          notes: null,
          createdAt: yesterday.toISOString(),
        },
        {
          id: '3',
          startedAt: twoDaysAgo.toISOString(),
          finishedAt: twoDaysAgo.toISOString(),
          notes: null,
          createdAt: twoDaysAgo.toISOString(),
        },
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(3);
    });

    it('1日空いた場合、ストリークが途切れる', () => {
      const today = new Date();
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const workouts: Workout[] = [
        {
          id: '1',
          startedAt: today.toISOString(),
          finishedAt: today.toISOString(),
          notes: null,
          createdAt: today.toISOString(),
        },
        {
          id: '2',
          startedAt: threeDaysAgo.toISOString(),
          finishedAt: threeDaysAgo.toISOString(),
          notes: null,
          createdAt: threeDaysAgo.toISOString(),
        },
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(1);
    });

    it('同じ日に複数のワークアウトがあっても1日とカウント', () => {
      const today = new Date();
      const workouts: Workout[] = [
        {
          id: '1',
          startedAt: today.toISOString(),
          finishedAt: today.toISOString(),
          notes: null,
          createdAt: today.toISOString(),
        },
        {
          id: '2',
          startedAt: today.toISOString(),
          finishedAt: today.toISOString(),
          notes: null,
          createdAt: today.toISOString(),
        },
      ];
      expect(calculateWorkoutStreak(workouts)).toBe(1);
    });

    it('今日のワークアウトがない場合、昨日からのストリークをカウント', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const workouts: Workout[] = [
        {
          id: '1',
          startedAt: yesterday.toISOString(),
          finishedAt: yesterday.toISOString(),
          notes: null,
          createdAt: yesterday.toISOString(),
        },
        {
          id: '2',
          startedAt: twoDaysAgo.toISOString(),
          finishedAt: twoDaysAgo.toISOString(),
          notes: null,
          createdAt: twoDaysAgo.toISOString(),
        },
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
      const today = new Date().toISOString().split('T')[0];
      const records: StepRecord[] = [
        {
          id: '1',
          date: today,
          steps: 12000,
          distanceKm: 8.0,
          calories: 400,
          source: 'sensor',
          createdAt: new Date().toISOString(),
        },
      ];
      expect(calculateStepStreak(records, 10000)).toBe(1);
    });

    it('連続歩数目標達成日数が3日の場合', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const records: StepRecord[] = [
        {
          id: '1',
          date: today.toISOString().split('T')[0],
          steps: 12000,
          distanceKm: 8.0,
          calories: 400,
          source: 'sensor',
          createdAt: today.toISOString(),
        },
        {
          id: '2',
          date: yesterday.toISOString().split('T')[0],
          steps: 11000,
          distanceKm: 7.5,
          calories: 380,
          source: 'sensor',
          createdAt: yesterday.toISOString(),
        },
        {
          id: '3',
          date: twoDaysAgo.toISOString().split('T')[0],
          steps: 10500,
          distanceKm: 7.0,
          calories: 360,
          source: 'sensor',
          createdAt: twoDaysAgo.toISOString(),
        },
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
        {
          id: '1',
          date: today.toISOString().split('T')[0],
          steps: 12000,
          distanceKm: 8.0,
          calories: 400,
          source: 'sensor',
          createdAt: today.toISOString(),
        },
        {
          id: '2',
          date: yesterday.toISOString().split('T')[0],
          steps: 8000, // 目標未達成
          distanceKm: 5.5,
          calories: 300,
          source: 'sensor',
          createdAt: yesterday.toISOString(),
        },
        {
          id: '3',
          date: twoDaysAgo.toISOString().split('T')[0],
          steps: 11000,
          distanceKm: 7.5,
          calories: 380,
          source: 'sensor',
          createdAt: twoDaysAgo.toISOString(),
        },
      ];
      expect(calculateStepStreak(records, 10000)).toBe(1);
    });

    it('今日の記録がない場合、昨日からのストリークをカウント', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      const records: StepRecord[] = [
        {
          id: '1',
          date: yesterday.toISOString().split('T')[0],
          steps: 12000,
          distanceKm: 8.0,
          calories: 400,
          source: 'sensor',
          createdAt: yesterday.toISOString(),
        },
        {
          id: '2',
          date: twoDaysAgo.toISOString().split('T')[0],
          steps: 11000,
          distanceKm: 7.5,
          calories: 380,
          source: 'sensor',
          createdAt: twoDaysAgo.toISOString(),
        },
      ];
      expect(calculateStepStreak(records, 10000)).toBe(2);
    });

    it('ちょうど目標値の場合も達成とみなす', () => {
      const today = new Date().toISOString().split('T')[0];
      const records: StepRecord[] = [
        {
          id: '1',
          date: today,
          steps: 10000, // ちょうど目標値
          distanceKm: 7.0,
          calories: 350,
          source: 'sensor',
          createdAt: new Date().toISOString(),
        },
      ];
      expect(calculateStepStreak(records, 10000)).toBe(1);
    });
  });
});
