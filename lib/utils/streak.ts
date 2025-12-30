import type { StepRecord } from '@/types/steps';
import type { Workout } from '@/types/workout';

/**
 * 連続トレーニング日数を計算
 * @param workouts ワークアウト一覧（新しい順にソート済みを想定）
 * @returns 連続トレーニング日数
 */
export function calculateWorkoutStreak(workouts: Workout[]): number {
  if (workouts.length === 0) {
    return 0;
  }

  // 日付のみを抽出してユニークな日付のリストを作成
  const workoutDates = workouts
    .map((workout) => workout.startedAt.split('T')[0])
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort()
    .reverse(); // 新しい日付から古い日付へ

  if (workoutDates.length === 0) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // 最新のワークアウト日が今日または昨日でない場合、ストリークは0
  const latestWorkoutDate = workoutDates[0];
  if (latestWorkoutDate !== todayStr && latestWorkoutDate !== yesterdayStr) {
    return 0;
  }

  // 連続日数をカウント
  let streak = 0;
  const currentDate = new Date(latestWorkoutDate);

  for (const workoutDate of workoutDates) {
    const expectedDateStr = currentDate.toISOString().split('T')[0];

    if (workoutDate === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
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

  // 目標達成日のみをフィルタ
  const achievedDates = records
    .filter((record) => record.steps >= goal)
    .map((record) => record.date)
    .sort()
    .reverse(); // 新しい日付から古い日付へ

  if (achievedDates.length === 0) {
    return 0;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // 最新の達成日が今日または昨日でない場合、ストリークは0
  const latestAchievedDate = achievedDates[0];
  if (latestAchievedDate !== todayStr && latestAchievedDate !== yesterdayStr) {
    return 0;
  }

  // 連続日数をカウント
  let streak = 0;
  const currentDate = new Date(latestAchievedDate);

  for (const achievedDate of achievedDates) {
    const expectedDateStr = currentDate.toISOString().split('T')[0];

    if (achievedDate === expectedDateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
