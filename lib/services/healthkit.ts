import { Platform } from 'react-native';
import type { StepRecord } from '@/types/steps';

// react-native-healthを条件付きでインポート
let AppleHealthKit: any = null;
let permissions: any = null;

try {
  AppleHealthKit = require('react-native-health').default;
  if (AppleHealthKit && AppleHealthKit.Constants) {
    permissions = {
      permissions: {
        read: [AppleHealthKit.Constants.Permissions.StepCount],
        write: [AppleHealthKit.Constants.Permissions.StepCount],
      },
    };
  }
} catch (error) {
  // Expo Goやモジュールが利用できない環境では何もしない
  console.log('[HealthKit] react-native-healthモジュールが利用できません');
}

/**
 * HealthKit権限をリクエスト (iOS)
 * @returns 権限が許可されたかどうか
 */
export async function requestHealthKitPermissions(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    console.warn('[HealthKit] iOS以外では利用できません');
    return false;
  }

  if (!AppleHealthKit || !permissions) {
    console.warn('[HealthKit] react-native-healthが利用できません（開発ビルドが必要です）');
    return false;
  }

  return new Promise((resolve) => {
    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.error('[HealthKit] 権限リクエストエラー:', error);
        resolve(false);
        return;
      }
      console.log('[HealthKit] 権限が許可されました');
      resolve(true);
    });
  });
}

/**
 * 今日の歩数を取得 (iOS)
 * @returns 今日の歩数
 */
export async function getTodaySteps(): Promise<number> {
  if (Platform.OS !== 'ios') {
    throw new Error('HealthKitはiOSのみで利用可能です');
  }

  if (!AppleHealthKit) {
    console.warn('[HealthKit] react-native-healthが利用できません');
    return 0;
  }

  return new Promise((resolve) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const options = {
      startDate: startOfDay.toISOString(),
      endDate: now.toISOString(),
    };

    AppleHealthKit.getStepCount(
      options,
      (error: Object, results: any) => {
        if (error) {
          console.error('[HealthKit] 今日の歩数取得エラー:', error);
          resolve(0);
          return;
        }

        const steps = results?.value ?? 0;
        console.log('[HealthKit] 今日の歩数を取得:', steps);
        resolve(steps);
      }
    );
  });
}

/**
 * 歩数履歴を取得 (iOS)
 * @param days 取得する日数
 * @returns 歩数記録の配列
 */
export async function getStepHistory(days: number): Promise<StepRecord[]> {
  if (Platform.OS !== 'ios') {
    throw new Error('HealthKitはiOSのみで利用可能です');
  }

  if (!AppleHealthKit) {
    console.warn('[HealthKit] react-native-healthが利用できません');
    return [];
  }

  return new Promise((resolve) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    const options = {
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
    };

    AppleHealthKit.getDailyStepCountSamples(
      options,
      (error: Object, results: any[]) => {
        if (error) {
          console.error('[HealthKit] 歩数履歴取得エラー:', error);
          resolve([]);
          return;
        }

        if (!results || results.length === 0) {
          console.log('[HealthKit] 歩数履歴が見つかりません');
          resolve([]);
          return;
        }

        const stepRecords: StepRecord[] = results.map((sample) => {
          const sampleDate = new Date(sample.startDate);
          const dateStr = sampleDate.toISOString().split('T')[0];

          return {
            date: dateStr,
            steps: sample.value,
            source: 'healthkit' as const,
            deviceName: null,
            createdAt: new Date().toISOString(),
          };
        });

        console.log('[HealthKit] 歩数履歴を取得:', stepRecords.length, '件');
        resolve(stepRecords);
      }
    );
  });
}
