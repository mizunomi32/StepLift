import type { StepRecord } from '@/types/steps';
import type { Workout } from '@/types/workout';

/**
 * 日付をローカルタイムゾーンのYYYY-MM-DD形式に変換
 */
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * ISO文字列またはDateからローカルタイムゾーンの日付文字列を抽出
 */
function extractLocalDate(isoString: string): string {
  const date = new Date(isoString);
  return formatLocalDate(date);
}

/**
 * 連続トレーニング日数を計算
 * @param workouts ワークアウト一覧（新しい順にソート済みを想定）
 * @returns 連続トレーニング日数
 */
export function calculateWorkoutStreak(workouts: Workout[]): number {
  if (workouts.length === 0) {
    return 0;
  }

  // 日付のみを抽出してユニークな日付のリストを作成（ローカルタイムゾーン基準）
  const workoutDates = workouts
    .map((workout) => extractLocalDate(workout.startedAt))
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .reverse(); // 新しい日付から古い日付へ

  if (workoutDates.length === 0) {
    return 0;
  }

  const today = new Date();
  const todayStr = formatLocalDate(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  // 最新のワークアウト日が今日または昨日でない場合、ストリークは0
  const latestWorkoutDate = workoutDates[0];
  if (latestWorkoutDate !== todayStr && latestWorkoutDate !== yesterdayStr) {
    return 0;
  }

  // 連続日数をカウント
  let streak = 0;
  let expectedDate = new Date(today);
  if (latestWorkoutDate === yesterdayStr) {
    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  for (const workoutDate of workoutDates) {
    const expectedDateStr = formatLocalDate(expectedDate);

    if (workoutDate === expectedDateStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * 連続歩数目標達成日数を計算
 * @param records 歩数記録一覧（新しい順にソート済みを想定）
 * @param goal 目標歩数
 * @returns 連続歩数目標達成日数
 */
export function calculateStepStreak(records: StepRecord[], goal: number): number {
  if (records.length === 0 || goal <= 0) {
    return 0;
  }

  // 目標達成日のみをフィルタ（recordのdateはYYYY-MM-DD形式を想定）
  const achievedDates = records
    .filter((record) => record.steps >= goal)
    .map((record) => record.date)
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .reverse(); // 新しい日付から古い日付へ

  if (achievedDates.length === 0) {
    return 0;
  }

  const today = new Date();
  const todayStr = formatLocalDate(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatLocalDate(yesterday);

  // 最新の達成日が今日または昨日でない場合、ストリークは0
  const latestAchievedDate = achievedDates[0];
  if (latestAchievedDate !== todayStr && latestAchievedDate !== yesterdayStr) {
    return 0;
  }

  // 連続日数をカウント
  let streak = 0;
  let expectedDate = new Date(today);
  if (latestAchievedDate === yesterdayStr) {
    expectedDate.setDate(expectedDate.getDate() - 1);
  }

  for (const achievedDate of achievedDates) {
    const expectedDateStr = formatLocalDate(expectedDate);

    if (achievedDate === expectedDateStr) {
      streak++;
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
