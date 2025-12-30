import {
  estimateStrideLength,
  calculateDistance,
  calculateCalories,
  getWeekDates,
  formatDate,
} from '../../../lib/utils/step-calculations';

describe('step-calculations', () => {
  describe('estimateStrideLength', () => {
    it('身長から歩幅を推定できる（男性: 身長 × 0.45）', () => {
      expect(estimateStrideLength(170)).toBeCloseTo(0.765, 2); // 170cm × 0.45 = 76.5cm = 0.765m
      expect(estimateStrideLength(180)).toBeCloseTo(0.81, 2);
    });

    it('低身長でも正の値を返す', () => {
      expect(estimateStrideLength(150)).toBeGreaterThan(0);
    });
  });

  describe('calculateDistance', () => {
    it('歩数と歩幅から距離を計算できる（km）', () => {
      const steps = 10000;
      const strideLengthM = 0.75; // 75cm
      const expectedDistanceKm = (10000 * 0.75) / 1000; // 7.5km
      expect(calculateDistance(steps, strideLengthM)).toBeCloseTo(expectedDistanceKm, 2);
    });

    it('0歩の場合は0kmを返す', () => {
      expect(calculateDistance(0, 0.75)).toBe(0);
    });
  });

  describe('calculateCalories', () => {
    it('歩数と体重からカロリーを計算できる', () => {
      const steps = 10000;
      const weightKg = 70;
      // 概算: 歩数 × 体重 × 0.0004 = 10000 × 70 × 0.0004 = 280kcal
      const calories = calculateCalories(steps, weightKg);
      expect(calories).toBeGreaterThan(0);
      expect(calories).toBeCloseTo(280, 0);
    });

    it('0歩の場合は0kcalを返す', () => {
      expect(calculateCalories(0, 70)).toBe(0);
    });
  });

  describe('getWeekDates', () => {
    it('過去7日間の日付配列を返す（今日を含む）', () => {
      const dates = getWeekDates();
      expect(dates).toHaveLength(7);

      // 日付がYYYY-MM-DD形式であることを確認
      dates.forEach(date => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });

      // 最新の日付が今日であることを確認
      const today = new Date();
      const expectedToday = formatDate(today);
      expect(dates[dates.length - 1]).toBe(expectedToday);
    });

    it('日付が昇順でソートされている', () => {
      const dates = getWeekDates();
      for (let i = 1; i < dates.length; i++) {
        expect(new Date(dates[i]) >= new Date(dates[i - 1])).toBe(true);
      }
    });
  });

  describe('formatDate', () => {
    it('DateオブジェクトをYYYY-MM-DD形式の文字列に変換できる', () => {
      const date = new Date('2024-01-15T12:00:00');
      expect(formatDate(date)).toBe('2024-01-15');
    });

    it('1桁の月日を0埋めする', () => {
      const date = new Date('2024-03-05T12:00:00');
      expect(formatDate(date)).toBe('2024-03-05');
    });
  });
});
