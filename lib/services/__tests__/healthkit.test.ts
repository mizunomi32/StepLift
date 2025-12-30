import { Platform } from 'react-native';
import * as healthkit from '../healthkit';
import AppleHealthKit from 'react-native-health';

// モック
jest.mock('react-native-health');
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('HealthKit Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestHealthKitPermissions', () => {
    it('iOSで権限リクエストが成功する', async () => {
      (AppleHealthKit.initHealthKit as jest.Mock).mockImplementation((permissions, callback) => {
        callback(null, true);
      });

      const result = await healthkit.requestHealthKitPermissions();

      expect(result).toBe(true);
      expect(AppleHealthKit.initHealthKit).toHaveBeenCalled();
    });

    it('iOSで権限リクエストが失敗する', async () => {
      (AppleHealthKit.initHealthKit as jest.Mock).mockImplementation((permissions, callback) => {
        callback(new Error('Permission denied'), false);
      });

      const result = await healthkit.requestHealthKitPermissions();

      expect(result).toBe(false);
    });

    it('iOS以外では利用できない', async () => {
      (Platform as any).OS = 'android';

      const result = await healthkit.requestHealthKitPermissions();

      expect(result).toBe(false);
      expect(AppleHealthKit.initHealthKit).not.toHaveBeenCalled();

      (Platform as any).OS = 'ios';
    });
  });

  describe('getTodaySteps', () => {
    it('今日の歩数を取得できる', async () => {
      const mockDate = new Date('2025-01-15T10:00:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      (AppleHealthKit.getStepCount as jest.Mock).mockImplementation((options, callback) => {
        callback(null, { value: 5000 });
      });

      const steps = await healthkit.getTodaySteps();

      expect(steps).toBe(5000);
      expect(AppleHealthKit.getStepCount).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: expect.any(String),
          endDate: expect.any(String),
        }),
        expect.any(Function)
      );

      jest.useRealTimers();
    });

    it('エラー時は0を返す', async () => {
      (AppleHealthKit.getStepCount as jest.Mock).mockImplementation((options, callback) => {
        callback(new Error('Failed to get steps'), null);
      });

      const steps = await healthkit.getTodaySteps();

      expect(steps).toBe(0);
    });

    it('iOS以外ではエラーを投げる', async () => {
      (Platform as any).OS = 'android';

      await expect(healthkit.getTodaySteps()).rejects.toThrow(
        'HealthKitはiOSのみで利用可能です'
      );

      (Platform as any).OS = 'ios';
    });
  });

  describe('getStepHistory', () => {
    it('指定日数の歩数履歴を取得できる', async () => {
      const mockDate = new Date('2025-01-15T10:00:00Z');
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);

      (AppleHealthKit.getDailyStepCountSamples as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, [
            { value: 8000, startDate: '2025-01-14T00:00:00Z', endDate: '2025-01-14T23:59:59Z' },
            { value: 10000, startDate: '2025-01-13T00:00:00Z', endDate: '2025-01-13T23:59:59Z' },
          ]);
        }
      );

      const history = await healthkit.getStepHistory(7);

      expect(history).toHaveLength(2);
      expect(history[0]).toMatchObject({
        date: expect.any(String),
        steps: 8000,
        source: 'healthkit',
      });
      expect(AppleHealthKit.getDailyStepCountSamples).toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('エラー時は空配列を返す', async () => {
      (AppleHealthKit.getDailyStepCountSamples as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(new Error('Failed to get history'), null);
        }
      );

      const history = await healthkit.getStepHistory(7);

      expect(history).toEqual([]);
    });
  });
});
