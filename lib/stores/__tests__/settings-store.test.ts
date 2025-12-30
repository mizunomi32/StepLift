import { useSettingsStore } from '../settings-store';

describe('useSettingsStore', () => {
  beforeEach(() => {
    // ストアをリセット（初期値に戻す）
    useSettingsStore.setState({
      dailyStepGoal: 10000,
      theme: 'system',
      weightUnit: 'kg',
    });
  });

  describe('初期状態', () => {
    it('デフォルト値が設定されている', () => {
      const state = useSettingsStore.getState();

      expect(state.dailyStepGoal).toBe(10000);
      expect(state.theme).toBe('system');
      expect(state.weightUnit).toBe('kg');
    });
  });

  describe('setDailyStepGoal', () => {
    it('歩数目標を設定できる', async () => {
      const { setDailyStepGoal } = useSettingsStore.getState();

      await setDailyStepGoal(8000);

      expect(useSettingsStore.getState().dailyStepGoal).toBe(8000);
    });

    it('負の値を拒否する', async () => {
      const { setDailyStepGoal } = useSettingsStore.getState();

      await setDailyStepGoal(-1000);

      // 元の値のまま
      expect(useSettingsStore.getState().dailyStepGoal).toBe(10000);
    });

    it('0を拒否する', async () => {
      const { setDailyStepGoal } = useSettingsStore.getState();

      await setDailyStepGoal(0);

      // 元の値のまま
      expect(useSettingsStore.getState().dailyStepGoal).toBe(10000);
    });
  });

  describe('setTheme', () => {
    it('ライトテーマに設定できる', async () => {
      const { setTheme } = useSettingsStore.getState();

      await setTheme('light');

      expect(useSettingsStore.getState().theme).toBe('light');
    });

    it('ダークテーマに設定できる', async () => {
      const { setTheme } = useSettingsStore.getState();

      await setTheme('dark');

      expect(useSettingsStore.getState().theme).toBe('dark');
    });

    it('システムテーマに設定できる', async () => {
      const { setTheme } = useSettingsStore.getState();

      await setTheme('system');

      expect(useSettingsStore.getState().theme).toBe('system');
    });
  });

  describe('setWeightUnit', () => {
    it('kg単位に設定できる', async () => {
      const { setWeightUnit } = useSettingsStore.getState();

      await setWeightUnit('kg');

      expect(useSettingsStore.getState().weightUnit).toBe('kg');
    });

    it('lb単位に設定できる', async () => {
      const { setWeightUnit } = useSettingsStore.getState();

      await setWeightUnit('lb');

      expect(useSettingsStore.getState().weightUnit).toBe('lb');
    });
  });

  describe('loadSettings', () => {
    it('設定を読み込める', async () => {
      const { loadSettings } = useSettingsStore.getState();

      await loadSettings();

      const state = useSettingsStore.getState();
      // デフォルト値または保存された値が読み込まれる
      expect(state.dailyStepGoal).toBeGreaterThan(0);
      expect(['light', 'dark', 'system']).toContain(state.theme);
      expect(['kg', 'lb']).toContain(state.weightUnit);
    });
  });

  describe('永続化', () => {
    it('設定を保存するとAsyncStorageに保存される', async () => {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const store = useSettingsStore.getState();

      // 設定を変更
      await store.setDailyStepGoal(12000);
      await store.setTheme('dark');
      await store.setWeightUnit('lb');

      // AsyncStorage.setItemが呼ばれたことを確認
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('settings.dailyStepGoal', '12000');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('settings.theme', 'dark');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('settings.weightUnit', 'lb');

      // ストアの状態も更新されていることを確認
      const state = useSettingsStore.getState();
      expect(state.dailyStepGoal).toBe(12000);
      expect(state.theme).toBe('dark');
      expect(state.weightUnit).toBe('lb');
    });
  });
});

