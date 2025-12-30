/**
 * 歩幅の推定（身長から）
 * @param heightCm 身長（cm）
 * @returns 歩幅（m）
 */
export function estimateStrideLength(heightCm: number): number {
  // 一般的な歩幅 = 身長 × 0.45（成人男性の平均）
  return (heightCm * 0.45) / 100;
}

/**
 * 距離計算
 * @param steps 歩数
 * @param strideLengthM 歩幅（m）、デフォルト0.7m（身長170cmの場合）
 * @returns 距離（km）
 */
export function calculateDistance(steps: number, strideLengthM: number = 0.7): number {
  if (steps === 0) return 0;
  const distanceM = steps * strideLengthM;
  return distanceM / 1000; // kmに変換
}

/**
 * カロリー計算
 * @param steps 歩数
 * @param weightKg 体重（kg）、デフォルト60kg
 * @returns 消費カロリー（kcal）
 */
export function calculateCalories(steps: number, weightKg: number = 60): number {
  if (steps === 0) return 0;
  // 概算式: 歩数 × 体重 × 0.0004
  // 例: 10000歩 × 70kg × 0.0004 = 280kcal
  return Math.round(steps * weightKg * 0.0004);
}

/**
 * 過去7日間の日付配列を取得（今日を含む）
 * @returns YYYY-MM-DD形式の日付配列（昇順）
 */
export function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(formatDate(date));
  }

  return dates;
}

/**
 * DateオブジェクトをYYYY-MM-DD形式の文字列に変換
 * @param date Dateオブジェクト
 * @returns YYYY-MM-DD形式の文字列
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
