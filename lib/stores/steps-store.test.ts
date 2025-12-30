import { act, renderHook } from '@testing-library/react';
import { useStepsStore } from './steps-store';
import type { StepRecord } from '@/types/steps';

// モック設定
jest.mock('@/lib/db/queries/steps', () => ({
  getTodaySteps: jest.fn(),
  getStepGoal: jest.fn(),
  getWeeklyStepRecords: jest.fn(),
  updateOrCreateStepRecord: jest.fn(),
  updateStepGoal: jest.fn(),
}));

jest.mock('@/lib/services/healthkit', () => ({
  getTodaySteps: jest.fn(),
  getStepHistory: jest.fn(),
}));

jest.mock('@/lib/services/health-connect', () => ({
  getTodaySteps: jest.fn(),
  getStepHistory: jest.fn(),
}));

import * as stepsQueries from '@/lib/db/queries/steps';
import * as healthkit from '@/lib/services/healthkit';
import * as healthConnect from '@/lib/services/health-connect';

describe('useStepsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // ストアをリセット
    const { result } = renderHook(() => useStepsStore());
    act(() => {
      result.current.stopTracking();
    });
  });

  describe('初期状態', () => {
    it('デフォルト値が設定されている', () => {
      const { result } = renderHook(() => useStepsStore());

      expect(result.current.todaySteps).toBe(0);
      expect(result.current.dailyGoal).toBe(10000);
      expect(result.current.weeklyRecords).toEqual([]);
      expect(result.current.isTracking).toBe(false);
    });
  });

  describe('startTracking', () => {
    it('トラッキングを開始できる', async () => {
      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.startTracking();
      });

      expect(result.current.isTracking).toBe(true);
    });
  });

  describe('stopTracking', () => {
    it('トラッキングを停止できる', async () => {
      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.startTracking();
      });

      act(() => {
        result.current.stopTracking();
      });

      expect(result.current.isTracking).toBe(false);
    });
  });

  describe('updateTodaySteps', () => {
    it('今日の歩数を更新できる', () => {
      const { result } = renderHook(() => useStepsStore());

      act(() => {
        result.current.updateTodaySteps(5000);
      });

      expect(result.current.todaySteps).toBe(5000);
    });

    it('負の値は設定できない', () => {
      const { result } = renderHook(() => useStepsStore());

      act(() => {
        result.current.updateTodaySteps(-100);
      });

      expect(result.current.todaySteps).toBe(0);
    });
  });

  describe('setDailyGoal', () => {
    it('日次目標を設定できる', async () => {
      (stepsQueries.updateStepGoal as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.setDailyGoal(12000);
      });

      expect(result.current.dailyGoal).toBe(12000);
      expect(stepsQueries.updateStepGoal).toHaveBeenCalledWith(12000);
    });

    it('無効な目標値（0以下）は設定できない', async () => {
      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.setDailyGoal(0);
      });

      // デフォルト値のまま
      expect(result.current.dailyGoal).toBe(10000);
    });
  });

  describe('loadWeeklyRecords', () => {
    it('週間の歩数記録を読み込める', async () => {
      const mockRecords: StepRecord[] = [
        {
          id: '1',
          date: '2024-01-01',
          steps: 8000,
          distanceKm: 6.0,
          calories: 320,
          source: 'sensor',
          createdAt: '2024-01-01T12:00:00Z',
        },
        {
          id: '2',
          date: '2024-01-02',
          steps: 10000,
          distanceKm: 7.5,
          calories: 400,
          source: 'sensor',
          createdAt: '2024-01-02T12:00:00Z',
        },
      ];

      (stepsQueries.getWeeklyStepRecords as jest.Mock).mockReturnValue(mockRecords);

      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.loadWeeklyRecords();
      });

      expect(result.current.weeklyRecords).toEqual(mockRecords);
      expect(stepsQueries.getWeeklyStepRecords).toHaveBeenCalled();
    });

    it('データがない場合は空配列を返す', async () => {
      (stepsQueries.getWeeklyStepRecords as jest.Mock).mockReturnValue([]);

      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.loadWeeklyRecords();
      });

      expect(result.current.weeklyRecords).toEqual([]);
    });
  });

  describe('syncWithHealthAPI', () => {
    it('HealthKitから歩数を同期できる（iOS）', async () => {
      (healthkit.getTodaySteps as jest.Mock).mockResolvedValue(7500);
      (stepsQueries.updateOrCreateStepRecord as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.syncWithHealthAPI();
      });

      expect(healthkit.getTodaySteps).toHaveBeenCalled();
      expect(result.current.todaySteps).toBe(7500);
    });

    it('Health Connectから歩数を同期できる（Android）', async () => {
      // HealthKitが失敗してHealth Connectにフォールバック
      (healthkit.getTodaySteps as jest.Mock).mockRejectedValue(new Error('Not iOS'));
      (healthConnect.getTodaySteps as jest.Mock).mockResolvedValue(8500);
      (stepsQueries.updateOrCreateStepRecord as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await result.current.syncWithHealthAPI();
      });

      expect(healthConnect.getTodaySteps).toHaveBeenCalled();
      expect(result.current.todaySteps).toBe(8500);
    });

    it('両方のAPIが失敗してもエラーをスローしない', async () => {
      (healthkit.getTodaySteps as jest.Mock).mockRejectedValue(new Error('Not iOS'));
      (healthConnect.getTodaySteps as jest.Mock).mockRejectedValue(new Error('Not Android'));

      const { result } = renderHook(() => useStepsStore());

      await act(async () => {
        await expect(result.current.syncWithHealthAPI()).resolves.not.toThrow();
      });
    });
  });
});
