import { Platform } from 'react-native';
import type { StepRecord } from '@/types/steps';

/**
 * Health Connect権限をリクエスト (Android)
 * @returns 権限が許可されたかどうか
 */
export async function requestHealthConnectPermissions(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    console.warn('[HealthConnect] Android以外では利用できません');
    return false;
  }

  try {
    // TODO: react-native-health-connectを実装
    console.log('[HealthConnect] 権限リクエスト（未実装）');
    return false;
  } catch (error) {
    console.error('[HealthConnect] 権限リクエストエラー:', error);
    return false;
  }
}

/**
 * 今日の歩数を取得 (Android)
 * @returns 今日の歩数
 */
export async function getTodaySteps(): Promise<number> {
  if (Platform.OS !== 'android') {
    throw new Error('Health ConnectはAndroidのみで利用可能です');
  }

  try {
    // TODO: react-native-health-connectを実装
    console.log('[HealthConnect] 今日の歩数取得（未実装）');
    return 0;
  } catch (error) {
    console.error('[HealthConnect] 今日の歩数取得エラー:', error);
    throw error;
  }
}

/**
 * 歩数履歴を取得 (Android)
 * @param days 取得する日数
 * @returns 歩数記録の配列
 */
export async function getStepHistory(days: number): Promise<StepRecord[]> {
  if (Platform.OS !== 'android') {
    throw new Error('Health ConnectはAndroidのみで利用可能です');
  }

  try {
    // TODO: react-native-health-connectを実装
    console.log('[HealthConnect] 歩数履歴取得（未実装）:', days);
    return [];
  } catch (error) {
    console.error('[HealthConnect] 歩数履歴取得エラー:', error);
    throw error;
  }
}
