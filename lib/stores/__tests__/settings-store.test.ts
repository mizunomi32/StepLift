import { act, renderHook } from '@testing-library/react';
import { useSettingsStore } from '../settings-store';

describe('useSettingsStore', () => {
  beforeEach(() => {
    // ストアをリセット
    const { result } = renderHook(() => useSettingsStore());
    act(() => {
      result.current.setDailyStepGoal(10000);
      result.current.setTheme('system');
      result.current.setWeightUnit('kg');
    });
  });

  describe('初期状態', () => {
    it('デフォルト値が設定されている', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.dailyStepGoal).toBe(10000);
      expect(result.current.theme).toBe('system');
      expect(result.current.weightUnit).toBe('kg');
    });
  });

  describe('setDailyStepGoal', () => {
    it('歩数目標を設定できる', async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setDailyStepGoal(8000);
      });

      expect(result.current.dailyStepGoal).toBe(8000);
    });

    it('負の値を拒否する', async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setDailyStepGoal(-1000);
      });

      // 元の値のまま
      expect(result.current.dailyStepGoal).toBe(10000);
    });

    it('0を拒否する', async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.setDailyStepGoal(0);
      });

      // 元の値のまま
      expect(result.current.dailyStepGoal).toBe(10000);
    });
  });

  describe('setTheme', () => {
    it('ライトテーマに設定できる', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.theme).toBe('light');
    });

    it('ダークテーマに設定できる', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('システムテーマに設定できる', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTheme('system');
      });

      expect(result.current.theme).toBe('system');
    });
  });

  describe('setWeightUnit', () => {
    it('kg単位に設定できる', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setWeightUnit('kg');
      });

      expect(result.current.weightUnit).toBe('kg');
    });

    it('lb単位に設定できる', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setWeightUnit('lb');
      });

      expect(result.current.weightUnit).toBe('lb');
    });
  });

  describe('loadSettings', () => {
    it('設定を読み込める', async () => {
      const { result } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result.current.loadSettings();
      });

      // デフォルト値または保存された値が読み込まれる
      expect(result.current.dailyStepGoal).toBeGreaterThan(0);
      expect(['light', 'dark', 'system']).toContain(result.current.theme);
      expect(['kg', 'lb']).toContain(result.current.weightUnit);
    });
  });

  describe('永続化', () => {
    it('設定を保存して読み込める', async () => {
      const { result } = renderHook(() => useSettingsStore());

      // 設定を変更
      await act(async () => {
        await result.current.setDailyStepGoal(12000);
        result.current.setTheme('dark');
        result.current.setWeightUnit('lb');
      });

      // 新しいストアインスタンスを作成して読み込み
      const { result: result2 } = renderHook(() => useSettingsStore());

      await act(async () => {
        await result2.current.loadSettings();
      });

      // 保存された値が読み込まれる
      expect(result2.current.dailyStepGoal).toBe(12000);
      expect(result2.current.theme).toBe('dark');
      expect(result2.current.weightUnit).toBe('lb');
    });
  });
});
