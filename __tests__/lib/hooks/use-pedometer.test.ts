import { renderHook, act } from '@testing-library/react';
import { usePedometer } from '../../../lib/hooks/use-pedometer';
import { Pedometer } from 'expo-sensors';

// モック設定
jest.mock('expo-sensors', () => ({
  Pedometer: {
    isAvailableAsync: jest.fn(),
    watchStepCount: jest.fn(),
    getStepCountAsync: jest.fn(),
  },
}));

describe('usePedometer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('初期状態', () => {
    it('isAvailableがfalse、isPedometerAvailableがfalseで初期化される', () => {
      (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      const { result } = renderHook(() => usePedometer());

      expect(result.current.isPedometerAvailable).toBe(false);
      expect(result.current.currentStepCount).toBe(0);
    });
  });

  describe('Pedometerが利用可能な場合', () => {
    it('isPedometerAvailableがtrueになる', async () => {
      (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Pedometer.watchStepCount as jest.Mock).mockReturnValue({
        remove: jest.fn(),
      });

      const { result } = renderHook(() => usePedometer());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isPedometerAvailable).toBe(true);
    });

    it('歩数の更新を監視できる', async () => {
      let stepCallback: (data: { steps: number }) => void = () => {};

      (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Pedometer.watchStepCount as jest.Mock).mockImplementation((callback) => {
        stepCallback = callback;
        return { remove: jest.fn() };
      });

      const onStepUpdate = jest.fn();
      const { result } = renderHook(() => usePedometer(onStepUpdate));

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      // 歩数更新をシミュレート
      await act(async () => {
        stepCallback({ steps: 100 });
      });

      expect(result.current.currentStepCount).toBe(100);
      expect(onStepUpdate).toHaveBeenCalledWith(100);

      // 追加の更新
      await act(async () => {
        stepCallback({ steps: 250 });
      });

      expect(result.current.currentStepCount).toBe(250);
      expect(onStepUpdate).toHaveBeenCalledWith(250);
    });
  });

  describe('Pedometerが利用不可能な場合', () => {
    it('isPedometerAvailableがfalseのまま', async () => {
      (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(false);

      const { result } = renderHook(() => usePedometer());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isPedometerAvailable).toBe(false);
      expect(Pedometer.watchStepCount).not.toHaveBeenCalled();
    });
  });

  describe('クリーンアップ', () => {
    it('アンマウント時にサブスクリプションを解除する', async () => {
      const removeMock = jest.fn();
      (Pedometer.isAvailableAsync as jest.Mock).mockResolvedValue(true);
      (Pedometer.watchStepCount as jest.Mock).mockReturnValue({
        remove: removeMock,
      });

      const { unmount } = renderHook(() => usePedometer());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      unmount();

      expect(removeMock).toHaveBeenCalled();
    });
  });

  describe('エラーハンドリング', () => {
    it('isAvailableAsyncがエラーの場合、isPedometerAvailableはfalse', async () => {
      (Pedometer.isAvailableAsync as jest.Mock).mockRejectedValue(new Error('Permission denied'));

      const { result } = renderHook(() => usePedometer());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(result.current.isPedometerAvailable).toBe(false);
    });
  });
});
