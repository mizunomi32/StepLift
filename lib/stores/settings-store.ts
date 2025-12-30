import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEYS = {
  DAILY_STEP_GOAL: 'settings.dailyStepGoal',
  THEME: 'settings.theme',
  WEIGHT_UNIT: 'settings.weightUnit',
} as const;

export type Theme = 'light' | 'dark' | 'system';
export type WeightUnit = 'kg' | 'lb';

interface SettingsState {
  // 状態
  dailyStepGoal: number;
  theme: Theme;
  weightUnit: WeightUnit;

  // アクション
  setDailyStepGoal: (steps: number) => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  setWeightUnit: (unit: WeightUnit) => Promise<void>;
  loadSettings: () => Promise<void>;
}

/**
 * 設定ストア
 *
 * アプリの各種設定を管理し、expo-sqlite/kv-storeで永続化する
 */
export const useSettingsStore = create<SettingsState>((set, get) => ({
  // 初期状態
  dailyStepGoal: 10000,
  theme: 'system',
  weightUnit: 'kg',

  /**
   * 1日の歩数目標を設定
   */
  setDailyStepGoal: async (steps: number) => {
    if (steps <= 0) {
      console.warn('[SettingsStore] 無効な歩数目標:', steps);
      return;
    }

    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.DAILY_STEP_GOAL, steps.toString());

      set({ dailyStepGoal: steps });
      console.log('[SettingsStore] 歩数目標を設定しました:', steps);
    } catch (error) {
      console.error('[SettingsStore] 歩数目標の設定エラー:', error);
      throw error;
    }
  },

  /**
   * テーマを設定
   */
  setTheme: async (theme: Theme) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.THEME, theme);

      set({ theme });
      console.log('[SettingsStore] テーマを設定しました:', theme);
    } catch (error) {
      console.error('[SettingsStore] テーマの設定エラー:', error);
    }
  },

  /**
   * 重量単位を設定
   */
  setWeightUnit: async (unit: WeightUnit) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEYS.WEIGHT_UNIT, unit);

      set({ weightUnit: unit });
      console.log('[SettingsStore] 重量単位を設定しました:', unit);
    } catch (error) {
      console.error('[SettingsStore] 重量単位の設定エラー:', error);
    }
  },

  /**
   * 設定を読み込む
   */
  loadSettings: async () => {
    try {
      // 歩数目標を読み込む
      const goalStr = await AsyncStorage.getItem(SETTINGS_KEYS.DAILY_STEP_GOAL);
      const dailyStepGoal = goalStr ? parseInt(goalStr, 10) : 10000;

      // テーマを読み込む
      const themeStr = await AsyncStorage.getItem(SETTINGS_KEYS.THEME);
      const theme = (themeStr as Theme) || 'system';

      // 重量単位を読み込む
      const unitStr = await AsyncStorage.getItem(SETTINGS_KEYS.WEIGHT_UNIT);
      const weightUnit = (unitStr as WeightUnit) || 'kg';

      set({
        dailyStepGoal,
        theme,
        weightUnit,
      });

      console.log('[SettingsStore] 設定を読み込みました:', {
        dailyStepGoal,
        theme,
        weightUnit,
      });
    } catch (error) {
      console.error('[SettingsStore] 設定の読み込みエラー:', error);
      // エラー時はデフォルト値を使用
      set({
        dailyStepGoal: 10000,
        theme: 'system',
        weightUnit: 'kg',
      });
    }
  },
}));
