import { Pedometer } from 'expo-sensors';
import { useEffect, useState } from 'react';

interface UsePedometerResult {
  isPedometerAvailable: boolean;
  currentStepCount: number;
}

/**
 * 歩数センサーを監視するカスタムフック
 * @param onStepUpdate 歩数更新時のコールバック
 * @returns Pedometer利用可能フラグと現在の歩数
 */
export function usePedometer(onStepUpdate?: (steps: number) => void): UsePedometerResult {
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  useEffect(() => {
    let subscription: { remove: () => void } | null = null;

    // Pedometerが利用可能か確認
    const checkAvailability = async () => {
      try {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(isAvailable);

        if (isAvailable) {
          console.log('[usePedometer] Pedometerが利用可能です');

          // 歩数の監視を開始
          subscription = Pedometer.watchStepCount((result) => {
            const steps = result.steps;
            setCurrentStepCount(steps);
            onStepUpdate?.(steps);
            console.log('[usePedometer] 歩数を更新しました:', steps);
          });
        } else {
          console.warn('[usePedometer] Pedometerは利用できません');
        }
      } catch (error) {
        console.error('[usePedometer] Pedometer確認エラー:', error);
        setIsPedometerAvailable(false);
      }
    };

    checkAvailability();

    // クリーンアップ
    return () => {
      if (subscription) {
        subscription.remove();
        console.log('[usePedometer] Pedometerサブスクリプションを解除しました');
      }
    };
  }, [onStepUpdate]);

  return {
    isPedometerAvailable,
    currentStepCount,
  };
}
