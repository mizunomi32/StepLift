import { create } from 'zustand';
import { Platform } from 'react-native';
import type { StepRecord } from '@/types/steps';
import {
  getTodaySteps as getDbTodaySteps,
  getStepGoal,
  getWeeklyStepRecords,
  updateOrCreateStepRecord,
  updateStepGoal as dbUpdateStepGoal,
} from '@/lib/db/queries/steps';
import * as healthkit from '@/lib/services/healthkit';
import * as healthConnect from '@/lib/services/health-connect';

interface StepsState {
  // 状態
  todaySteps: number;
  dailyGoal: number;
  weeklyRecords: StepRecord[];
  isTracking: boolean;

  // アクション
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  updateTodaySteps: (steps: number) => void;
  setDailyGoal: (steps: number) => Promise<void>;
  loadWeeklyRecords: () => Promise<void>;
  syncWithHealthAPI: () => Promise<void>;
}

export const useStepsStore = create<StepsState>((set, get) => ({
  // 初期状態
  todaySteps: 0,
  dailyGoal: 10000,
  weeklyRecords: [],
  isTracking: false,

  /**
   * トラッキング開始
   */
  startTracking: async () => {
    try {
      // DBから現在の歩数を読み込む
      const dbSteps = getDbTodaySteps();
      const goal = getStepGoal();

      set({
        todaySteps: dbSteps,
        dailyGoal: goal?.dailySteps ?? 10000,
        isTracking: true,
      });

      console.log('[StepsStore] トラッキングを開始しました');
    } catch (error) {
      console.error('[StepsStore] トラッキング開始エラー:', error);
      set({ isTracking: true });
    }
  },

  /**
   * トラッキング停止
   */
  stopTracking: () => {
    set({ isTracking: false });
    console.log('[StepsStore] トラッキングを停止しました');
  },

  /**
   * 今日の歩数を更新
   */
  updateTodaySteps: (steps: number) => {
    if (steps < 0) {
      console.warn('[StepsStore] 負の歩数は設定できません:', steps);
      return;
    }

    set({ todaySteps: steps });
    console.log('[StepsStore] 今日の歩数を更新しました:', steps);

    // DBに保存
    try {
      updateOrCreateStepRecord(steps);
    } catch (error) {
      console.error('[StepsStore] 歩数のDB保存エラー:', error);
    }
  },

  /**
   * 日次目標を設定
   */
  setDailyGoal: async (steps: number) => {
    if (steps <= 0) {
      console.warn('[StepsStore] 無効な目標値:', steps);
      return;
    }

    try {
      await dbUpdateStepGoal(steps);
      set({ dailyGoal: steps });
      console.log('[StepsStore] 日次目標を設定しました:', steps);
    } catch (error) {
      console.error('[StepsStore] 日次目標の設定エラー:', error);
      throw error;
    }
  },

  /**
   * 週間の歩数記録を読み込む
   */
  loadWeeklyRecords: async () => {
    try {
      const records = getWeeklyStepRecords();
      set({ weeklyRecords: records });
      console.log('[StepsStore] 週間記録を読み込みました:', records.length);
    } catch (error) {
      console.error('[StepsStore] 週間記録の読み込みエラー:', error);
      set({ weeklyRecords: [] });
    }
  },

  /**
   * ヘルスAPIから歩数を同期
   */
  syncWithHealthAPI: async () => {
    try {
      let steps = 0;

      // プラットフォームに応じてAPIを選択
      if (Platform.OS === 'ios') {
        try {
          steps = await healthkit.getTodaySteps();
          console.log('[StepsStore] HealthKitから歩数を取得:', steps);
        } catch (error) {
          console.warn('[StepsStore] HealthKit同期エラー:', error);
        }
      } else if (Platform.OS === 'android') {
        try {
          steps = await healthConnect.getTodaySteps();
          console.log('[StepsStore] Health Connectから歩数を取得:', steps);
        } catch (error) {
          console.warn('[StepsStore] Health Connect同期エラー:', error);
        }
      }

      if (steps > 0) {
        set({ todaySteps: steps });
        updateOrCreateStepRecord(steps, null, null, Platform.OS === 'ios' ? 'healthkit' : 'health_connect');
      }
    } catch (error) {
      console.error('[StepsStore] ヘルスAPI同期エラー:', error);
    }
  },
}));
