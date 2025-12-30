import { Platform } from 'react-native';
import type { StepRecord } from '@/types/steps';

/**
 * HealthKit権限をリクエスト (iOS)
 * @returns 権限が許可されたかどうか
 */
export async function requestHealthKitPermissions(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    console.warn('[HealthKit] iOS以外では利用できません');
    return false;
  }

  try {
    // TODO: expo-healthまたはreact-native-healthを実装
    console.log('[HealthKit] 権限リクエスト（未実装）');
    return false;
  } catch (error) {
    console.error('[HealthKit] 権限リクエストエラー:', error);
    return false;
  }
}

/**
 * 今日の歩数を取得 (iOS)
 * @returns 今日の歩数
 */
export async function getTodaySteps(): Promise<number> {
  if (Platform.OS !== 'ios') {
    throw new Error('HealthKitはiOSのみで利用可能です');
  }

  try {
    // TODO: expo-healthまたはreact-native-healthを実装
    console.log('[HealthKit] 今日の歩数取得（未実装）');
    return 0;
  } catch (error) {
    console.error('[HealthKit] 今日の歩数取得エラー:', error);
    throw error;
  }
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

  try {
    // TODO: expo-healthまたはreact-native-healthを実装
    console.log('[HealthKit] 歩数履歴取得（未実装）:', days);
    return [];
  } catch (error) {
    console.error('[HealthKit] 歩数履歴取得エラー:', error);
    throw error;
  }
}
